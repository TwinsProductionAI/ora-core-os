'use strict';
// Synthetic test fixtures only. These are NOT benchmark results.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {reference,referenceSummary,validate,parseStrict,entry,report,verifyReport,plan,sha,stable}=require('./halo-experimental.cjs');
const REV='04f2ea29ad7742c10b4892bf537a7cc430b6a284';
const ref=reference(REV);
const clone=x=>JSON.parse(JSON.stringify(x));
const bytes=x=>Buffer.from(JSON.stringify(x));
const fixture=(method='direct',scenario='ORA-LAB-001')=>{
 const rubric=ref.rubrics.get(scenario).data;
 const text='Synthetic response for validator unit testing only.';
 return {protocol_version:'0.3.0',scenario_id:scenario,method_id:method,prompt_sha256:ref.prompts.get(scenario+'/'+method).sha256,protocol_sha256:ref.protocol_sha256,run_id:'SYNTHETIC-'+scenario+'-'+method,block_id:'SYNTHETIC-BLOCK',timestamp_utc:'2026-01-01T00:00:00Z',execution_status:'executed',model:{provider:'synthetic',name:'synthetic-test',version:'synthetic-v1'},settings:{temperature:null,seed:null},isolation:'confirmed',response_text:text,response_sha256:sha(text),metrics:{latency_ms:null,input_tokens:null,output_tokens:null,cost:null,currency:null,word_count:null,word_cap_pass:null},review:{reviewer:'synthetic-reviewer',blinding:'confirmed',criteria:rubric.criteria.map(c=>({id:c.id,score:1,evidence:'Synthetic unit test evidence; not a real observation'})),critical_failure:false},limitations:['Synthetic unit test; never publish as evidence']};
};
const failed=()=>{
 const r=fixture();r.execution_status='failed';r.isolation='not_applicable';r.response_text=null;r.response_sha256=null;r.review=null;return r;
};
const passes=r=>{const a=validate(r,ref);assert.equal(a.receipt_consistency,'PASS',JSON.stringify(a.errors));assert.equal(a.trace_status,'UNB');assert.equal(a.eligible_for_controlled_comparison,false);assert.equal(a.execution_authority,'none');return a};
const rejects=(mutate,message)=>{const r=fixture();mutate(r);const a=entry(bytes(r),ref).audit;assert.equal(a.receipt_consistency,'FAIL');assert.equal(a.trace_status,'CONFLICT');assert.equal(a.eligible_for_controlled_comparison,false);if(message)assert.ok(a.errors.some(e=>e.includes(message)),JSON.stringify(a.errors));return a};
test('reference reconstructs eight exact prompt hashes and two rubrics',()=>{
 const s=referenceSummary(ref);assert.equal(Object.keys(s.prompts).length,8);assert.equal(Object.keys(s.rubric_sha256).length,2);
 assert.equal(s.prompts['ORA-LAB-001/direct'].sha256,'831171a1762b5b3dafe8a9dc72f4686775fc8b5b5f012454e8bf41e50834822d');
 assert.notEqual(reference('a'.repeat(40)).protocol_sha256,ref.protocol_sha256);
 assert.throws(()=>reference('main'));
});
test('consistent receipt never authenticates a model or execution',()=>{const a=passes(fixture());assert.equal(a.reported_score,5);assert.equal(a.proof.execution,'UNB');assert.equal(a.proof.independence,'UNB');assert.equal(a.version_gate.canonical_monarch_trace,false);assert.equal(a.checks.response,'MEAS')});
test('all eight variants remain accepted under the trusted reference',()=>{for(const c of ref.protocol.cases)for(const v of c.variants)passes(fixture(v.method_id,c.id))});
test('reject protocol substitution even with otherwise coherent receipt',()=>rejects(r=>{r.protocol_sha256=reference('b'.repeat(40)).protocol_sha256},'Protocol digest'));
test('reject wrong protocol version',()=>rejects(r=>{r.protocol_version='0.2.1'},'Version mismatch'));
test('reject prompt substitution',()=>rejects(r=>{r.prompt_sha256=ref.prompts.get('ORA-LAB-001/ora').sha256},'prompt digest'));
test('reject unknown or nonstring identifiers',()=>{rejects(r=>{r.scenario_id='fake'},'identifier');rejects(r=>{r.method_id={toString:'bad'}},'identifier')});
test('reject modified response with stale hash',()=>rejects(r=>{r.response_text+=' modified'},'Response or digest'));
test('rehashed fabricated output does not prove execution',()=>{const r=fixture();r.response_text='fabricated and rehashed';r.response_sha256=sha(r.response_text);passes(r)});
test('reject missing or extra top-level fields',()=>{rejects(r=>{delete r.review},'Receipt fields');rejects(r=>{r.authorized=true},'Receipt fields')});
test('reject invalid timestamps, including normalized dates',()=>{for(const d of ['2026-02-30T00:00:00Z','2026-01-01T24:00:00Z','yesterday','2026-01-01T00:00:00+00:00'])rejects(r=>{r.timestamp_utc=d},'timestamp')});
test('reject invalid model and settings',()=>{rejects(r=>{r.model.version=5},'Invalid model');rejects(r=>{r.settings=[]},'Invalid settings')});
test('unavailable metrics remain unknown; reject negative or fractional tokens',()=>{passes(fixture());rejects(r=>{r.metrics.output_tokens=-1},'numeric');rejects(r=>{r.metrics.output_tokens=1.5},'numeric');rejects(r=>{r.metrics.cost=1},'currency')});
test('word count is computed independently from response',()=>{const r=fixture();r.response_text='word '.repeat(151);r.response_sha256=sha(r.response_text);r.metrics.word_count=1;r.metrics.word_cap_pass=true;const a=passes(r);assert.equal(a.observed_response_word_count,151);assert.equal(a.observed_word_cap_pass,false);assert.ok(a.limits.some(x=>x.includes('differs')))});
test('reject inconsistent claimed word cap',()=>rejects(r=>{r.metrics.word_count=151;r.metrics.word_cap_pass=true},'word cap'));
test('failed and not-executed states preserve absence of response',()=>{const r=failed();assert.equal(passes(r).checks.response,'UNB');r.execution_status='not_executed';passes(r);rejects(r=>{r.execution_status='failed'},'Non-executed')});
test('declared contamination remains excluded',()=>{const r=fixture();r.isolation='contaminated';const a=passes(r);assert.ok(a.limits.some(x=>x.includes('Isolation')));rejects(r=>{r.isolation='not_applicable'},'isolation')});
test('reject duplicate, missing, unknown and inflated rubric scores',()=>{rejects(r=>{r.review.criteria[1]=clone(r.review.criteria[0])},'duplicate');rejects(r=>{r.review.criteria.pop()},'Incomplete');rejects(r=>{r.review.criteria[0].id='made_up'},'Unknown');rejects(r=>{r.review.criteria[0].score=2},'Invalid criterion score')});
test('reject absent evidence or inconsistent critical flag',()=>{rejects(r=>{r.review.criteria[0].evidence=null},'evidence');rejects(r=>{r.review.criteria.find(c=>c.id==='fabrication').score=0},'Critical failure')});
test('retain critical failures and incomplete scores',()=>{let r=fixture();r.review.criteria.find(c=>c.id==='fabrication').score=0;r.review.critical_failure=true;assert.equal(passes(r).reported_critical_failure,true);r=fixture();r.review.criteria[0].score=null;r.review.criteria[0].evidence=null;assert.equal(passes(r).reported_score,null)});
test('strict parser rejects duplicate keys, nested duplicates and escaped duplicates',()=>{for(const s of ['{"a":1,"a":2}','{"x":{"a":1,"a":2}}','{"a":1,"\\u0061":2}'])assert.throws(()=>parseStrict(Buffer.from(s)),/Duplicate/)});
test('strict parser rejects bad UTF-8, unpaired surrogate, nonfinite, trailing and deep JSON',()=>{for(const s of [Buffer.from([0xff]),Buffer.from('"\\ud800"'),Buffer.from('1e999'),Buffer.from('{}{}'),Buffer.from('['.repeat(52)+'0'+']'.repeat(52))])assert.throws(()=>parseStrict(s))});
test('strict parser preserves UTF-8 and does not pollute prototype',()=>{const r=parseStrict(Buffer.from('{"__proto__":{"polluted":true},"text":"é 😀"}'));assert.equal(r.text,'é 😀');assert.equal({}.polluted,undefined);assert.equal(Object.getPrototypeOf(r),null)});
test('registry retains failures, rejected receipts and all duplicate rows',()=>{
 const bad=fixture();bad.response_sha256='0'.repeat(64);
 const r=report([fixture(),fixture(),failed(),bad].map(x=>entry(bytes(x),ref)),ref);
 assert.equal(r.counts.total,4);assert.equal(r.counts.rejected,1);assert.equal(r.counts.failed_reported,1);assert.equal(r.counts.flagged_duplicates,3);assert.equal(r.counts.eligible,0);
 assert.equal(r.trace_status,'CONFLICT');assert.ok(r.entries.slice(0,3).every(e=>e.flags.includes('duplicate_run_id')));
});
test('complete four-condition block is descriptive only',()=>{
 const r=report(ref.protocol.methods.map(m=>entry(bytes(fixture(m.id)),ref)),ref);
 assert.equal(r.blocks.length,1);assert.equal(r.blocks[0].complete_reported_block,true);assert.equal(r.blocks[0].controlled_comparison,'UNB');assert.equal(r.blocks[0].effect_size,null);assert.equal(r.counts.eligible,0);
 assert.ok(!JSON.stringify(r).includes('Synthetic response for validator unit testing only.'));
});
test('missing methods and duplicates prevent complete block',()=>{const r=report([entry(bytes(fixture()),ref),entry(bytes(fixture()),ref)],ref);assert.equal(r.blocks[0].complete_reported_block,false)});
test('report hash verifies and rejects modification or wrong revision',()=>{
 const r=report([entry(bytes(fixture()),ref)],ref);assert.equal(verifyReport(r,ref),true);assert.equal(verifyReport(r,reference('b'.repeat(40))),false);r.counts.eligible=1;assert.equal(verifyReport(r,ref),false);
});
test('plan is deterministic, covers all methods, and contains no executed outcomes',()=>{
 const a=plan(ref,'SYNTHETIC-SEED',3),b=plan(ref,'SYNTHETIC-SEED',3);
 assert.deepEqual(a,b);assert.equal(a.blocks.length,6);assert.equal(a.status,'not_executed');const jobs=a.blocks.flatMap(x=>x.jobs);assert.equal(jobs.length,24);assert.equal(new Set(jobs.map(x=>x.run_id)).size,24);assert.equal(new Set(jobs.map(x=>x.blind_id)).size,24);
 for(const block of a.blocks){assert.equal(new Set(block.jobs.map(x=>x.method_id)).size,4);assert.deepEqual(block.jobs.map(x=>x.order),[1,2,3,4])}
 assert.throws(()=>plan(ref,'',1));assert.throws(()=>plan(ref,'seed',101));
});
test('CLI rejects symlinks, oversize and malformed input; verifies report offline',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ora-halo-test-'));
 try{const cli=path.join(__dirname,'halo-experimental.cjs'),call=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',timeout:10000});
 const p=path.join(dir,'receipt.json');fs.writeFileSync(p,bytes(fixture()));
 assert.equal(call('validate',REV,p).status,0);
 const symlink=path.join(dir,'link.json');fs.symlinkSync(p,symlink);assert.equal(call('validate',REV,symlink).status,2);
 const big=path.join(dir,'big.json');fs.writeFileSync(big,Buffer.alloc(2000001));assert.equal(call('validate',REV,big).status,2);
 const malformed=path.join(dir,'bad.json');fs.writeFileSync(malformed,'{"a":1,"a":2}');assert.equal(call('validate',REV,malformed).status,1);
 const rep=call('report',REV,p);assert.equal(rep.status,0);const rp=path.join(dir,'report.json');fs.writeFileSync(rp,rep.stdout);assert.equal(call('verify-report',REV,rp).status,0);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
