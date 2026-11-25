'use strict';
// HALO Experimental 0.2.0: Open Lab v0.3 adapter, NOT Monarch trace schema.
// Offline only. No network, provider calls, automatic publication or execution authority.
const fs=require('node:fs');
const crypto=require('node:crypto');
const {buildOpenLab}=require('./open-lab.cjs');
const VERSION='0.2.0', BASE='https://knowledge.oracorehub.com';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=x=>typeof x==='string'&&x.trim().length>0;
const hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const keys=(x,expected)=>obj(x)&&Object.keys(x).length===expected.length&&expected.every(k=>Object.hasOwn(x,k));
const numeric=(x,int=false)=>x===null||(typeof x==='number'&&Number.isFinite(x)&&x>=0&&(!int||Number.isSafeInteger(x)));
const clone=x=>JSON.parse(JSON.stringify(x));
function sorted(x){if(Array.isArray(x))return x.map(sorted);if(obj(x))return Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])]));return x}
function stable(x){return JSON.stringify(sorted(x))}
const fields=['protocol_version','scenario_id','method_id','prompt_sha256','protocol_sha256','run_id','block_id','timestamp_utc','execution_status','model','settings','isolation','response_text','response_sha256','metrics','review','limitations'];
const metricKeys=['latency_ms','input_tokens','output_tokens','cost','currency','word_count','word_cap_pass'];
// Auditor selects revision independently of the submitted receipt. Canonical data
// regenerated from trusted local release code, never from a submitter's rubric.
function reference(revision){
 if(typeof revision!=='string'||!/^[a-f0-9]{40}$/.test(revision))throw Error('Auditor-selected 40-hex release revision required');
 const files=buildOpenLab({base:BASE,revision,page:()=>'',link:()=>'',quiet:true,includeHalo:false});
 const bytes=files.get('open-lab/protocol.json');
 const protocol=JSON.parse(bytes),rubrics=new Map(),prompts=new Map();
 if(protocol.schema!=='ora-open-lab/protocol/0.3'||protocol.version!=='0.3.0')throw Error('Unsupported release');
 for(const c of protocol.cases){
  const rubricBytes=files.get('open-lab/evaluation/'+c.id+'.json');
  rubrics.set(c.id,{data:JSON.parse(rubricBytes),sha256:sha(rubricBytes)});
  for(const v of c.variants){
   const raw=files.get('open-lab/prompts/'+c.id+'-'+v.method_id+'.txt');
   if(typeof raw!=='string'||sha(raw)!==v.sha256||Buffer.byteLength(raw)!==v.bytes)throw Error('Trusted fixture mismatch');
   prompts.set(c.id+'/'+v.method_id,{sha256:v.sha256,bytes:v.bytes});
  }
 }
 return {revision,protocol,protocol_sha256:sha(bytes),rubrics,prompts};
}
function referenceSummary(ref){
 return {adapter_version:VERSION,source_version:ref.protocol.version,source_revision:ref.revision,protocol_sha256:ref.protocol_sha256,prompts:Object.fromEntries(ref.prompts),rubric_sha256:Object.fromEntries([...ref.rubrics].map(([k,v])=>[k,v.sha256]))};
}
function utc(v){
 if(typeof v!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(v))return false;
 const d=new Date(v);
 if(!Number.isFinite(d.valueOf()))return false;
 const expected=v.replace(/(?:\.(\d{1,3}))?Z$/,(_,s)=>'.'+(s||'').padEnd(3,'0')+'Z');
 return d.toISOString()===expected;
}
function validate(receipt,ref){
 const r=receipt,errors=[],limits=[],checks={protocol:'UNB',prompt:'UNB',response:'UNB'};
 const check=(v,m)=>{if(!v)errors.push(m);return !!v};
 let score=null,critical=null,wordCount=null,wordCap=null;
 const result=()=>{
  const consistency=errors.length===0;
  return {adapter_version:VERSION,namespace:'ORA_OPEN_LAB_EXPERIMENTAL',source_version:'0.3.0',version_gate:{monarch:'FOREIGN',adapted_principles:['MEAS/EST/UNB','no execution authority','version isolation'],canonical_monarch_trace:false},reference_revision:ref.revision,reference_protocol_sha256:ref.protocol_sha256,
   receipt_consistency:consistency?'PASS':'FAIL',trace_status:consistency?'UNB':'CONFLICT',errors,limits:[...limits,'Independent provider, execution, review, telemetry and isolation evidence unavailable. A consistent receipt is not authenticated.'],
   checks,reported_score:consistency?score:null,reported_critical_failure:consistency?critical:null,
   observed_response_word_count:wordCount,observed_word_cap_pass:wordCap,word_count_method:'whitespace-separated nonempty strings; only received text, not proof of model execution',
   eligible_for_controlled_comparison:false,proof:{execution:'UNB',independence:'UNB',provider_identity:'UNB',review_correctness:'UNB',telemetry:'UNB'},execution_authority:'none'};
 };
 if(!check(keys(r,fields),'Receipt fields mismatch'))return result();
 check(r.protocol_version===ref.protocol.version,'Version mismatch');
 checks.protocol=check(r.protocol_sha256===ref.protocol_sha256,'Protocol digest mismatch')?'MEAS':'CONFLICT';
 const fixture=ref.prompts.get(r.scenario_id+'/'+r.method_id);
 const rubric=ref.rubrics.get(r.scenario_id)?.data;
 checks.prompt=check(!!fixture&&fixture.sha256===r.prompt_sha256,'Unknown scenario/method or prompt digest mismatch')?'MEAS':'CONFLICT';
 check(str(r.run_id)&&str(r.block_id),'Missing identifiers');
 check(utc(r.timestamp_utc),'Invalid UTC timestamp');
 check(['executed','failed','not_executed'].includes(r.execution_status),'Invalid execution status');
 check(keys(r.model,['provider','name','version'])&&str(r.model.provider)&&str(r.model.name)&&(r.model.version===null||str(r.model.version)),'Invalid model');
 check(obj(r.settings),'Invalid settings');
 check(['confirmed','not_confirmed','contaminated','not_applicable'].includes(r.isolation),'Invalid isolation status');
 check(Array.isArray(r.limitations)&&r.limitations.every(x=>typeof x==='string'),'Invalid limitations');
 const executed=r.execution_status==='executed';
 if(executed){
  checks.response=check(str(r.response_text)&&hash(r.response_sha256)&&sha(r.response_text)===r.response_sha256,'Response or digest mismatch')?'MEAS':'CONFLICT';
  check(r.isolation!=='not_applicable','Executed run requires an isolation status');
  if(typeof r.response_text==='string'&&rubric){
   wordCount=r.response_text.trim()?r.response_text.trim().split(/\s+/u).length:0;
   wordCap=wordCount<=rubric.word_cap;
  }
 }else{
  check(r.response_text===null&&r.response_sha256===null&&r.review===null,'Non-executed receipt cannot contain response or review');
  limits.push('No successful execution reported');
 }
 const m=r.metrics;
 if(check(keys(m,metricKeys),'Metric fields mismatch')){
  check(numeric(m.latency_ms)&&numeric(m.input_tokens,true)&&numeric(m.output_tokens,true)&&numeric(m.cost)&&numeric(m.word_count,true),'Invalid numeric metrics');
  check(m.currency===null||str(m.currency),'Invalid currency');
  check(m.word_cap_pass===null||typeof m.word_cap_pass==='boolean','Invalid word cap flag');
  check(m.cost===null||str(m.currency),'Cost requires currency');
  check(executed||(m.word_count===null&&m.word_cap_pass===null),'Non-executed receipt cannot contain output word count');
  check(m.word_count!==null||m.word_cap_pass===null,'Word cap flag requires reported count');
  if(m.word_count!==null&&rubric){
   check(m.word_cap_pass===null||m.word_cap_pass===(m.word_count<=rubric.word_cap),'Reported word cap inconsistent with reported count');
   if(wordCount!==null&&m.word_count!==wordCount)limits.push('Reported word count differs from adapter convention; retain both');
  }
  if(metricKeys.some(k=>m[k]===null))limits.push('Unavailable metrics remain null');
 }
 if(executed&&r.review!==null){
  const q=r.review;
  if(check(!!rubric&&keys(q,['reviewer','blinding','criteria','critical_failure'])&&str(q.reviewer)&&['confirmed','not_confirmed','none'].includes(q.blinding)&&Array.isArray(q.criteria),'Invalid review')){
   const ids=rubric.criteria.map(x=>x.id),seen=new Set();
   for(const item of q.criteria){
    if(!check(keys(item,['id','score','evidence']),'Invalid criterion fields'))continue;
    check(ids.includes(item.id)&&!seen.has(item.id),'Unknown or duplicate criterion');
    seen.add(item.id);
    check([0,1,null].includes(item.score),'Invalid criterion score');
    check(item.score===null?item.evidence===null||typeof item.evidence==='string':str(item.evidence),'Missing review evidence');
   }
   check(seen.size===ids.length&&ids.every(id=>seen.has(id)),'Incomplete criterion set');
   if(q.criteria.length===ids.length&&ids.every(id=>seen.has(id))&&q.criteria.every(x=>obj(x)&&[0,1].includes(x.score)))score=q.criteria.reduce((a,x)=>a+x.score,0);
   const ci=q.criteria.filter(x=>obj(x)&&rubric.critical_criteria.includes(x.id));
   critical=ci.some(x=>x.score===0)?true:ci.length===rubric.critical_criteria.length&&ci.every(x=>x.score===1)?false:null;
   check(q.critical_failure===critical,'Critical failure flag inconsistent');
   if(q.blinding!=='confirmed')limits.push('Review blinding not confirmed');
   if(score===null)limits.push('Incomplete review; no aggregate score');
  }
 }else limits.push('No completed review');
 if(r.isolation!=='confirmed')limits.push('Isolation not confirmed');
 if(!str(r.model?.version))limits.push('Exact model version unknown');
 return result();
}
// Strict JSON input: reject duplicate keys, invalid UTF-8, excessive nesting,
// nonfinite numeric values. JSON.parse handles quoted strings/escapes.
function parseStrict(bytes){
 const s=new TextDecoder('utf-8',{fatal:true}).decode(bytes);let p=0;
 const ws=()=>{while(p<s.length&&/[ \t\r\n]/.test(s[p]))p++};
 function tokenString(){
  const start=p++;
  while(p<s.length){const c=s[p++];if(c==='"')return JSON.parse(s.slice(start,p));if(c==='\\')p++}
  throw Error('Unterminated JSON string');
 }
 function value(depth){
  if(depth>50)throw Error('JSON nesting limit');ws();const c=s[p];
  if(c==='"')return tokenString();
  if(c==='{'||c==='['){
   const isObject=c==='{',end=isObject?'}':']',o=isObject?Object.create(null):[],seen=new Set();p++;ws();
   if(s[p]===end){p++;return o}
   for(;;){
    ws();
    if(isObject){if(s[p]!=='"')throw Error('Expected JSON key');const k=tokenString();if(seen.has(k))throw Error('Duplicate JSON key');seen.add(k);ws();if(s[p++]!==':')throw Error('Expected colon');o[k]=value(depth+1)}
    else o.push(value(depth+1));
    ws();const t=s[p++];if(t===end)return o;if(t!==',')throw Error('Invalid JSON separator');
   }
  }
  const m=s.slice(p).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
  if(!m)throw Error('Invalid JSON value');p+=m[0].length;const x=JSON.parse(m[0]);if(typeof x==='number'&&!Number.isFinite(x))throw Error('Nonfinite number');return x;
 }
 const result=value(0);ws();if(p!==s.length)throw Error('Trailing JSON content');return result;
}
function readBounded(path){
 const fd=fs.openSync(path,'r');
 try{const st=fs.fstatSync(fd);if(!st.isFile()||st.size>2000000)throw Error('Input must be regular file <= 2 MB');
 const data=Buffer.alloc(st.size+1);let n=0;
 while(n<data.length){const k=fs.readSync(fd,data,n,data.length-n,null);if(!k)break;n+=k}
 if(n!==st.size)throw Error('File changed during read');return data.subarray(0,n)
 }finally{fs.closeSync(fd)}
}
function entry(bytes,ref){
 const digest=sha(bytes);
 try{const r=parseStrict(bytes),audit=validate(r,ref);
 return {receipt_sha256:digest,receipt:r,audit}
 }catch(e){return {receipt_sha256:digest,receipt:null,audit:{receipt_consistency:'FAIL',trace_status:'CONFLICT',errors:['Input parsing failed'],eligible_for_controlled_comparison:false,execution_authority:'none'}}}
}
// Registry keeps every input digest, including invalid, failed and not executed.
// Raw outputs remain with the auditor; they are not copied into reports.
function report(entries,ref){
 const runIds=new Map(),slots=new Map(),rows=[];
 for(const e of entries){
  const r=e.receipt,a=e.audit,valid=a.receipt_consistency==='PASS';
  const row={receipt_sha256:e.receipt_sha256,receipt_consistency:a.receipt_consistency,trace_status:a.trace_status,execution_status:valid?r.execution_status:null,scenario_id:valid?r.scenario_id:null,method_id:valid?r.method_id:null,block_id:valid?r.block_id:null,run_id:valid?r.run_id:null,model:valid?clone(r.model):null,reported_score:valid?a.reported_score:null,reported_critical_failure:valid?a.reported_critical_failure:null,observed_word_cap_pass:valid?a.observed_word_cap_pass:null,errors:a.errors,eligible_for_controlled_comparison:false,flags:[]};
  rows.push(row);
  if(valid){
   const slot=stable([r.model,r.scenario_id,r.block_id,r.method_id]);
   for(const [map,key,flag] of [[runIds,r.run_id,'duplicate_run_id'],[slots,slot,'duplicate_block_method']]){
    if(map.has(key)){row.flags.push(flag);const prev=map.get(key);if(!prev.flags.includes(flag))prev.flags.push(flag)}
    else map.set(key,row);
   }
  }
 }
 const blocks=new Map();
 for(const row of rows)if(row.receipt_consistency==='PASS'){
  const key=stable([row.model,row.scenario_id,row.block_id]);if(!blocks.has(key))blocks.set(key,[]);blocks.get(key).push(row);
 }
 const summaries=[...blocks.values()].map(rs=>{
  const a=rs[0],methods=ref.protocol.methods.map(m=>m.id),byMethod=Object.fromEntries(methods.map(m=>[m,rs.filter(r=>r.method_id===m).map(r=>({status:r.execution_status,score:r.reported_score,critical_failure:r.reported_critical_failure,word_cap_pass:r.observed_word_cap_pass,flags:r.flags}))]));
  const complete=methods.every(m=>byMethod[m].length===1&&byMethod[m][0].status==='executed'&&byMethod[m][0].score!==null&&byMethod[m][0].flags.length===0);
  return {model:a.model,scenario_id:a.scenario_id,block_id:a.block_id,conditions:byMethod,complete_reported_block:complete,controlled_comparison:'UNB',effect_size:null,note:'Descriptive submitted scores only; no effect estimate or verified performance ranking'};
 });
 const counts={total:rows.length,consistent:rows.filter(r=>r.receipt_consistency==='PASS').length,rejected:rows.filter(r=>r.receipt_consistency==='FAIL').length,executed_reported:rows.filter(r=>r.execution_status==='executed').length,failed_reported:rows.filter(r=>r.execution_status==='failed').length,not_executed_reported:rows.filter(r=>r.execution_status==='not_executed').length,flagged_duplicates:rows.filter(r=>r.flags.length>0).length,eligible:0};
 const payload={schema:'ora-open-lab/halo-report/0.2',reference:referenceSummary(ref),counts,entries:rows,blocks:summaries,trace_status:counts.rejected||counts.flagged_duplicates?'CONFLICT':'UNB',execution_authority:'none',limitations:['Submitted receipts are not independent evidence','No model output or provider telemetry authenticated','No raw responses included in report; retain originals locally','No result automatically published']};
 return {...payload,report_sha256:sha(stable(payload)),digest_convention:'SHA-256 of recursively key-sorted compact UTF-8 JSON payload excluding report_sha256 and digest_convention; not a signature'};
}
// Reproducible pilot assignment; no model execution. Block IDs and blind labels
// are distinct; share only anonymous response IDs and rubric with reviewer.
function plan(ref,seed,repetitions=1){
 if(!str(seed)||seed.length>256||!Number.isInteger(repetitions)||repetitions<1||repetitions>100)throw Error('Seed and repetitions (1..100) required');
 const blocks=[];
 for(const c of ref.protocol.cases)for(let i=0;i<repetitions;i++){
  const block_id='BLOCK-'+sha(stable([ref.protocol_sha256,seed,c.id,i])).slice(0,20);
  const jobs=c.variants.map(v=>{
   const h=sha(stable([block_id,v.method_id,seed]));
   return {method_id:v.method_id,prompt_sha256:v.sha256,prompt_url:v.prompt_url,run_id:'RUN-'+h.slice(0,20),blind_id:'RESP-'+sha(h+'blind').slice(0,20),order_key:sha(h+'order')};
  }).sort((a,b)=>a.order_key.localeCompare(b.order_key)).map(({order_key,...job},index)=>({...job,order:index+1}));
  blocks.push({block_id,scenario_id:c.id,repetition:i+1,jobs});
 }
 return {schema:'ora-open-lab/pilot-plan/0.2',protocol_sha256:ref.protocol_sha256,revision:ref.revision,seed,repetitions,blocks,status:'not_executed',note:'Exploratory plan only; keep assignments private from reviewer; use fresh sessions; no execution performed'};
}
module.exports={reference,referenceSummary,validate,parseStrict,entry,report,plan,sha,stable};
if(require.main===module){
 try{
  const [cmd,revision,...args]=process.argv.slice(2);
  const ref=reference(revision);let out;
  if(cmd==='reference'&&args.length===0)out=referenceSummary(ref);
  else if(cmd==='validate'&&args.length===1){out=entry(readBounded(args[0]),ref).audit;process.exitCode=out.receipt_consistency==='PASS'?0:1}
  else if(cmd==='report'&&args.length>=1&&args.length<=1000){out=report(args.map(p=>entry(readBounded(p),ref)),ref);process.exitCode=out.trace_status==='CONFLICT'?1:0}
  else if(cmd==='plan'&&(args.length===1||args.length===2))out=plan(ref,args[0],args[1]===undefined?1:Number(args[1]));
  else throw Error('Usage: node halo-experimental.cjs reference REV | validate REV receipt.json | report REV receipt1.json ... | plan REV SEED [REPETITIONS]');
  console.log(JSON.stringify(out,null,2));
 }catch(e){console.error('HALO input/reference error: '+e.message);process.exitCode=2}
}
