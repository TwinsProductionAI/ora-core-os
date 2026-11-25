'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {createHash}=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {loadCatalog,session,MCP}=require('./agent-access-mcp.cjs');
const root=path.join(__dirname,'..','knowledge-static-dist');
const data=loadCatalog(root);
const req=(id,method,params)=>({jsonrpc:'2.0',id,method,...(params===undefined?{}:{params})});
const init=req(1,'initialize',{protocolVersion:MCP,capabilities:{},clientInfo:{name:'synthetic-wire-test',version:'1'}});
const ready={jsonrpc:'2.0',method:'notifications/initialized'};
const call=(id,name,args)=>req(id,'tools/call',{name,arguments:args});
const start=()=>{const d=session(data);assert.equal(d(init).result.protocolVersion,MCP);assert.equal(d(ready),null);return d};
const sha=x=>createHash('sha256').update(x).digest('hex');
test('snapshot exposes only fixed public resources and validates manifest references',()=>{
 assert.equal(data.catalog.length,24);
 assert.equal(data.meta.knowledge_marker,'ORA-KNOWLEDGE-7D8689CA76E44941');
 assert.equal(data.meta.open_lab_version,'0.3.0');
 assert.equal(data.meta.published_result_count,0);
 assert.equal(data.meta.execution_authority,'none');
 assert.equal(data.catalog.filter(x=>x.name.includes('/prompts/')).length,8);
 assert.equal(data.catalog.filter(x=>x.name.includes('/evaluation/')).length,2);
 for(const f of data.catalog){const raw=data.byName.get(f.name).text;assert.equal(sha(raw),f.sha256);assert.equal(Buffer.byteLength(raw),f.bytes)}
 assert.equal(data.meta.protocol_sha256,sha(data.byName.get('open-lab/protocol.json').text));
});
test('initialization negotiates only the declared revision, notifications emit nothing',()=>{
 const d=session(data);
 assert.equal(d(req(2,'resources/list')).error.code,-32000);
 assert.equal(d(req(1,'initialize',{...init.params,protocolVersion:'2026-07-28'})).result.protocolVersion,MCP);
 assert.equal(d(req(3,'tools/list')).error.code,-32000);
 assert.equal(d(ready),null);
 assert.equal(d(req(4,'ping')).result.constructor,Object);
 assert.equal(d(init).error.code,-32602);
});
test('resources list and read expose exact source text',()=>{
 const d=start(),r=d(req(2,'resources/list')).result.resources;
 assert.equal(r.length,24);
 for(const item of r){const a=d(req(3,'resources/read',{uri:item.uri})).result.contents[0];assert.equal(a.text,data.byUri.get(item.uri).text)}
 assert.deepEqual(d(req(4,'resources/templates/list')).result.resourceTemplates,[]);
 assert.equal(d(req(5,'resources/list',{cursor:'x'})).error.code,-32602);
});
test('tools list and call return metadata and exact bytes, without execution',()=>{
 const d=start(),tools=d(req(2,'tools/list')).result.tools;
 assert.deepEqual(tools.map(t=>t.name),['ora_list_resources','ora_read_resource']);
 assert.ok(tools.every(t=>t.annotations.readOnlyHint===true));
 const catalog=JSON.parse(d(call(3,'ora_list_resources',{})).result.content[0].text);
 assert.equal(catalog.resources.length,24);assert.equal(catalog.snapshot.execution_authority,'none');
 const read=JSON.parse(d(call(4,'ora_read_resource',{resource_id:'open-lab/protocol.json'})).result.content[0].text);
 assert.equal(read.resource.sha256,data.meta.protocol_sha256);
 assert.equal(sha(read.resource.text),read.resource.sha256);
});
test('arbitrary paths, network URLs, writes and model execution are unavailable',()=>{
 const d=start();
 for(const resource_id of ['../../.env','file:///etc/passwd','https://example.com','open-lab/../manifest.json','__proto__']){
  assert.equal(d(call(2,'ora_read_resource',{resource_id})).result.isError,true);
  assert.equal(d(req(3,'resources/read',{uri:resource_id})).error.code,-32002);
 }
 for(const name of ['execute_model','write_file','shell','fetch_url'])assert.equal(d(call(4,name,{})).error.code,-32602);
 assert.equal(d(call(5,'ora_read_resource',{resource_id:'manifest.json',path:'secret'})).error.code,-32602);
 assert.equal(d(req(6,'resources/write',{})).error.code,-32601);
});
test('tampering, symlinks and inconsistent revision fail closed at startup',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ora-mcp-test-')),snap=path.join(dir,'snapshot');
 try{
  fs.cpSync(root,snap,{recursive:true});
  const p=path.join(snap,'open-lab','prompts','ORA-LAB-001-direct.txt'),original=fs.readFileSync(p);
  fs.appendFileSync(p,'\nmodified');assert.throws(()=>loadCatalog(snap),/integrity mismatch/);
  fs.writeFileSync(p,original);fs.unlinkSync(p);fs.symlinkSync(path.join(root,'open-lab','prompts','ORA-LAB-001-direct.txt'),p);
  assert.throws(()=>loadCatalog(snap),/file type/);
  fs.unlinkSync(p);fs.writeFileSync(p,original);
  const m=path.join(snap,'open-lab','manifest.json'),manifest=JSON.parse(fs.readFileSync(m,'utf8'));
  manifest.source_revision='0'.repeat(40);fs.writeFileSync(m,JSON.stringify(manifest));
  assert.throws(()=>loadCatalog(snap),/revision mismatch/);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('actual stdio process emits only valid JSON-RPC and rejects malformed input',()=>{
 const cli=path.join(__dirname,'agent-access-mcp.cjs');
 const run=input=>spawnSync(process.execPath,[cli],{input,encoding:'utf8',timeout:10000,maxBuffer:4000000});
 const input=[JSON.stringify(init),JSON.stringify(ready),'{"a":1,"a":2}',JSON.stringify(req(2,'tools/list')),JSON.stringify(call(3,'ora_read_resource',{resource_id:'access-check.json'})),JSON.stringify(req(4,'unknown'))].join('\n')+'\n';
 const r=run(input);assert.equal(r.status,0,r.stderr);assert.equal(r.stderr,'');
 const lines=r.stdout.trim().split('\n').map(x=>JSON.parse(x));
 assert.equal(lines.length,5);assert.ok(lines.every(x=>x.jsonrpc==='2.0'));
 assert.equal(lines[1].error.code,-32700);assert.equal(lines[2].result.tools.length,2);assert.equal(lines[4].error.code,-32601);
 const big=run('x'.repeat(65537)+'\n');assert.equal(big.status,2);assert.equal(big.stdout,'');assert.match(big.stderr,/64 KiB/);
});
