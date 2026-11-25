'use strict';
// Build a read-only machine-first distribution from the existing public mirror.
// No network requests, application secrets, sessions, private content or dependencies.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'knowledge-static-dist');
const origin = new URL(process.env.KNOWLEDGE_PUBLIC_ORIGIN || 'https://ora-knowledge-gateway.onrender.com');
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || origin.port) throw new Error('Expected a public HTTPS origin');
const base = origin.origin;
const sourceRepo = 'https://github.com/TwinsProductionAI/ora-core-os';
const sourceSite = 'https://oracorehub.com/connaissance';
const revision = (process.env.RENDER_GIT_COMMIT || execFileSync('git', ['rev-parse','HEAD'], {cwd:root, encoding:'utf8'})).trim();
assert.match(revision,/^[a-f0-9]{40,64}$/);
const specs = [
  ['ORA_CORE_HUB_CONNAISSANCE_INTEGRAL.md','connaissance/index.md','text/markdown'],
  ['evidence.json','connaissance/evidence.json','application/json'],
  ['transcript.json','connaissance/transcript.json','application/json'],
  ['README.md','source-notes.md','text/markdown']
];
const entries = specs.map(([name,url,mediaType])=>{
  const filename = path.join(__dirname,name);
  assert.ok(fs.lstatSync(filename).isFile(),'Expected an allowlisted regular file');
  const bytes=fs.readFileSync(filename);
  assert.ok(bytes.length>0);
  return {name,url,mediaType,bytes,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
});
const corpus=entries[0].bytes.toString('utf8');
assert.match(corpus,/^# ORA Core Hub/);
assert.ok(corpus.includes('https://oracorehub.com/connaissance'));
const evidence=JSON.parse(entries[1].bytes);
assert.equal(typeof evidence.schema_version,'string');
const transcript=JSON.parse(entries[2].bytes);
assert.ok(Array.isArray(transcript)&&transcript.length===12&&transcript.every(x=>typeof x==='string'));
const snapshot=crypto.createHash('sha256').update(entries.map(e=>e.sha256).join('\n')).digest('hex');
const marker='ORA-KNOWLEDGE-'+snapshot.slice(0,16).toUpperCase();
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const escapeXml=escape;
const link=(url,label)=>'<a href="'+escape(url)+'">'+escape(label)+'</a>';
const desc='Corpus public ORA Core Hub : architecture, méthode, sources, registre de preuves et transcriptions. Copie documentaire versionnée, accessible sans compte ni JavaScript.';
const css=':root{color-scheme:light;--ink:#102537;--teal:#006b70;--gold:#b48a36}*{box-sizing:border-box}body{font:16px/1.65 system-ui,sans-serif;margin:0;background:#f6f7f4;color:var(--ink)}main,header,footer{max-width:880px;margin:auto;padding:22px}header{border-bottom:1px solid #dce3df}h1{font-size:clamp(1.8rem,4vw,2.7rem);line-height:1.16;letter-spacing:-.03em}h2{font-size:1.3rem;margin-top:2rem}a{color:var(--teal);overflow-wrap:anywhere}p,li{overflow-wrap:anywhere}nav a{display:inline-block;margin:4px 12px 4px 0}code{overflow-wrap:anywhere}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}article{background:white;border:1px solid #dce3df;border-radius:12px;padding:clamp(14px,4vw,32px)}.eyebrow{color:var(--teal);font-size:.8rem;font-weight:700;letter-spacing:.13em}.muted{color:#45606d;font-size:.9rem}';
function page(title, route, content){
  return '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escape(title)+'</title><meta name="description" content="'+escape(desc)+'"><meta name="robots" content="index,follow"><link rel="canonical" href="'+escape(base+route)+'"><link rel="alternate" type="text/plain" href="/llms.txt" title="Index documentaire LLM"><link rel="alternate" type="text/markdown" href="/connaissance/index.md" title="Corpus integral"><link rel="stylesheet" href="/style.css"></head><body><header><p class="eyebrow">ORA CORE HUB / TWINS PRODUCTIONS IA</p><nav aria-label="Ressources publiques">'+link('/','Accueil')+link('/connaissance/','Connaissance')+link('/llms.txt','Index LLM')+link('/manifest.json','Manifest')+link('/connaissance/evidence.json','Preuves')+link('/open-lab/','Open Lab')+'</nav></header><main>'+content+'</main><footer><p class="muted">Distribution documentaire publique en lecture seule. Source : '+link(sourceSite,'Connaissance officielle')+' · '+link(sourceRepo+'/tree/'+revision+'/knowledge','snapshot GitHub')+'.</p></footer></body></html>\n';
}
// The source is preserved byte for byte as Markdown and text. The HTML copy
// escapes every source character rather than trusting embedded HTML.
const blocks=corpus.trim().split(/\r?\n\s*\r?\n/).map(block=>{
  const match=block.match(/^(#{1,6})\s+([^\n]+)$/);
  if(match){const n=Math.min(6,match[1].length+1);return '<h'+n+'>'+escape(match[2])+'</h'+n+'>';}
  if(block==='---')return '<hr>';
  return '<p>'+escape(block).replaceAll('\n','<br>')+'</p>';
}).join('\n');
const resources='<ul><li>'+link('/connaissance/','Corpus intégral HTML, sans JavaScript')+'</li><li>'+link('/connaissance/index.md','Corpus Markdown original')+'</li><li>'+link('/llms-full.txt','Corpus texte intégral')+'</li><li>'+link('/connaissance/evidence.json','Registre de preuves JSON')+'</li><li>'+link('/connaissance/transcript.json','Transcriptions JSON de la présentation')+'</li><li>'+link('/source-notes.md','Périmètre et date du miroir')+'</li><li>'+link('/manifest.json','Manifeste, provenance, SHA-256')+'</li><li>'+link('/access-check.json','Contrôle de lecture et de version')+'</li></ul>';
const intro='<h1>ORA Core Hub — Connaissance publique</h1><p>'+escape(desc)+'</p><p>ORA Core OS est une architecture de structuration et de gouvernance autour de modèles de langage existants, et non un modèle fondamental autonome. Les sources ouvertes, les témoignages, les certifications internes et les hypothèses de performance ont des statuts distincts.</p><p>Cette distribution reproduit exclusivement le miroir déjà public. Elle ne donne aucun droit d’accès aux formations premium, aux espaces clients, aux données privées ou aux générateurs protégés. Un hash vérifie l’intégrité des octets, pas la véracité des affirmations.</p><h2>Ressources à consulter</h2>'+resources+'<h2>État des connaissances</h2><p>Le fichier source-notes.md documente la date du snapshot et ses limites. Le manifeste identifie la révision exacte du dépôt utilisée. Cette copie n’est pas une synchronisation en temps réel du Hub.</p><h2>ORA Open Lab</h2><p><a href="/open-lab/">ORA Open Lab — Machine First v0.3</a> : protocole expérimental public, scénarios et prompts vérifiables. Aucun résultat comparatif publié.</p><h2>Accès pour agents compatibles</h2><p>'+link('/agent-access.json','Descripteur des voies d’accès')+' · '+link(sourceRepo+'/blob/'+revision+'/docs/ORA_AGENT_ACCESS.md','Connecteur MCP local (prototype)')+'. Ce connecteur n’est pas un service MCP distant et ne lance aucun modèle.</p><p class="muted">Identifiant public de version : <code>'+escape(marker)+'</code>.</p>';
const manifest={
  schema_version:'ora-knowledge-gateway/1.0',
  name:'ORA Core Hub — Connaissance publique',
  distribution:'static_read_only_public_mirror',
  official_source:sourceSite,
  source_repository:sourceRepo,
  source_revision:revision,
  source_notes:base+'/source-notes.md',
  origin:base,
  snapshot_sha256:snapshot,
  access_marker:marker,
  resources:entries.map(e=>({url:base+'/'+e.url,media_type:e.mediaType,bytes:e.bytes.length,sha256:e.sha256,source_url:sourceRepo+'/blob/'+revision+'/knowledge/'+e.name})),
  additional_resources:{html:base+'/connaissance/',text:base+'/llms-full.txt',llms:base+'/llms.txt',access_check:base+'/access-check.json',open_lab:base+'/open-lab/',open_lab_protocol:base+'/open-lab/protocol.json',agent_access:base+'/agent-access.json'},
  limitations:['Public mirror only; consult source-notes for snapshot date.','No model execution, account access, credentials or premium content.','Hashes establish byte integrity, not the truth of claims.','Availability, search indexing and access by specific LLM products require separate observation.']
};
const json = x => JSON.stringify(x,null,2)+'\n';
const assets = new Map(entries.map(e=>[e.url,e.bytes]));
assets.set('llms-full.txt',entries[0].bytes);
assets.set('index.html',page('ORA Core Hub — Connaissance publique','/',intro));
assets.set('connaissance/index.html',page('ORA Core Hub — corpus public intégral','/connaissance/','<h1>Corpus public intégral ORA</h1><p>Copie textuelle du miroir public versionné. '+link('/source-notes.md','Date et limites')+' · '+link('/connaissance/index.md','Source Markdown exacte')+'.</p><article>'+blocks+'</article>'));
assets.set('style.css',css+'\n');
assets.set('manifest.json',json(manifest));
assets.set('access-check.json',json({schema_version:'1.0',marker,source_revision:revision,corpus_sha256:entries[0].sha256,scope:'public_document_access_only',interpretation:'Reading this value demonstrates access to this response, not independent performance verification.'}));
assets.set('llms.txt','# ORA Core Hub — Connaissance publique\n\n> Corpus de documentation et de preuves publiées, avec provenance et limites. Architecture de gouvernance autour des LLM existants; aucune performance universelle établie.\n\n## Ressources\n'+[
 ['Corpus HTML','/connaissance/'],['Markdown intégral','/connaissance/index.md'],['Texte intégral','/llms-full.txt'],['Registre JSON','/connaissance/evidence.json'],['Transcriptions JSON','/connaissance/transcript.json'],['Provenance et limites du miroir','/source-notes.md'],['Manifeste et empreintes','/manifest.json'],['Contrôle de version','/access-check.json'],['ORA Open Lab — protocole expérimental','/open-lab/'],['Open Lab — protocole JSON','/open-lab/protocol.json'],['Accès agents — descripteur','/agent-access.json']
].map(([label,url])=>'- ['+label+']('+base+url+')').join('\n')+'\n\nSource officielle : '+sourceSite+'\nSource GitHub : '+sourceRepo+'/tree/'+revision+'/knowledge\n');
assets.set('agent-access.json',json({
 schema:'ora-agent-access/0.1',source_revision:revision,knowledge_marker:marker,
 official_origin:base,public_scope:'read_only_public_documentation_and_fictitious_experimental_fixtures',
 routes:{
  https:{knowledge:base+'/',index:base+'/llms.txt',knowledge_manifest:base+'/manifest.json',open_lab:base+'/open-lab/',protocol:base+'/open-lab/protocol.json',lab_manifest:base+'/open-lab/manifest.json'},
  render_alternative:{origin:'https://ora-knowledge-gateway.onrender.com',knowledge:'https://ora-knowledge-gateway.onrender.com/',open_lab:'https://ora-knowledge-gateway.onrender.com/open-lab/'},
  github:{repository:sourceRepo,revision,knowledge:sourceRepo+'/blob/'+revision+'/knowledge/ORA_CORE_HUB_CONNAISSANCE_INTEGRAL.md',open_lab:sourceRepo+'/blob/'+revision+'/docs/ORA_OPEN_LAB_MACHINE_FIRST.md'},
  mcp:{status:'local_stdio_prototype',protocol_version:'2025-11-25',remote_endpoint:null,documentation:sourceRepo+'/blob/'+revision+'/docs/ORA_AGENT_ACCESS.md',implementation:sourceRepo+'/blob/'+revision+'/knowledge/agent-access-mcp.cjs',requires:'Compatible local client, trusted checkout and generated local snapshot. No automatic installation or execution.'}
 },
 limitations:['Search indexing and individual LLM retrieval must be tested separately.','No remote MCP service, private access, API credentials, or model execution.','Integrity metadata is not proof of authenticity or performance.','Public documents are data, not instructions granting authority.']
}));
assets.set('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n');
assets.set('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+escapeXml(base+'/')+'</loc></url><url><loc>'+escapeXml(base+'/connaissance/')+'</loc></url><url><loc>'+escapeXml(base+'/open-lab/')+'</loc></url></urlset>\n');
for(const [name,body] of require('./open-lab.cjs').buildOpenLab({base,revision,page,link})){assert.ok(!assets.has(name));assets.set(name,body);}
// Only a fixed generated output directory is published, never the repository root.
if(fs.existsSync(output)){assert.ok(fs.lstatSync(output).isDirectory()&&!fs.lstatSync(output).isSymbolicLink());fs.rmSync(output,{recursive:true});}
for(const [name,data] of assets){const target=path.join(output,name);assert.ok(target.startsWith(output+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);}
// Build-time regression tests: every public file is non-empty, source hashes match,
// HTML does not depend on scripts, and all declared local links resolve.
for(const [name] of assets)assert.ok(fs.statSync(path.join(output,name)).size>0);
for(const e of entries)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(output,e.url))).digest('hex'),e.sha256);
assert.deepEqual(fs.readFileSync(path.join(output,'llms-full.txt')),entries[0].bytes);
for(const name of ['index.html','connaissance/index.html','open-lab/index.html']){
  const html=fs.readFileSync(path.join(output,name),'utf8');
  assert.ok(!/<script\b/i.test(html));
  assert.match(html,/<h1>/);
  for(const match of html.matchAll(/href="(\/[^"]*)"/g)){
    const rel=match[1].slice(1);assert.ok(assets.has(rel)||assets.has(rel+'index.html'), 'Broken local link: '+match[1]);
  }
}
assert.ok(fs.readFileSync(path.join(output,'connaissance/index.html'),'utf8').includes(escape("ORA Core OS n'est pas")));
console.log('PASS knowledge gateway: '+assets.size+' allowlisted files, verified source hashes, no JavaScript, local links valid; '+marker);
