'use strict';
// Experimental adapter only. Not the Monarch trace schema or an authority engine.
const fs=require('node:fs');
const crypto=require('node:crypto');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function validate(receipt,protocolBytes,rubric){
 const errors=[],limits=[];
 const protocol=JSON.parse(protocolBytes);
 const r=receipt;
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const str=x=>typeof x==='string'&&x.trim().length>0;
 const hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
 const check=(v,m)=>{if(!v)errors.push(m)};
 if(!obj(r))return {status:'UNB',errors:['Receipt must be an object'],eligible:false};
 const fields=['protocol_version','scenario_id','method_id','prompt_sha256','protocol_sha256','run_id','block_id','timestamp_utc','execution_status','model','settings','isolation','response_text','response_sha256','metrics','review','limitations'];
 check(fields.every(k=>Object.hasOwn(r,k))&&Object.keys(r).every(k=>fields.includes(k)),'Receipt fields mismatch');
 check(protocol.schema==='ora-open-lab/protocol/0.3'&&protocol.version==='0.3.0'&&r.protocol_version===protocol.version,'Version mismatch');
 check(r.protocol_sha256===sha(protocolBytes),'Protocol digest mismatch');
 const c=protocol.cases.find(x=>x.id===r.scenario_id);
 const v=c?.variants.find(x=>x.method_id===r.method_id);
 check(!!v&&r.prompt_sha256===v.sha256,'Unknown scenario/method or prompt digest mismatch');
 check(obj(rubric)&&rubric.scenario_id===r.scenario_id&&rubric.version===r.protocol_version,'Rubric mismatch');
 check(str(r.run_id)&&str(r.block_id),'Missing identifiers');
 check(typeof r.timestamp_utc==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(r.timestamp_utc)&&Number.isFinite(Date.parse(r.timestamp_utc)),'Invalid UTC timestamp');
 check(['executed','failed','not_executed'].includes(r.execution_status),'Invalid execution status');
 check(obj(r.model)&&str(r.model.provider)&&str(r.model.name)&&(r.model.version===null||str(r.model.version)),'Invalid model');
 check(obj(r.settings),'Invalid settings');
 check(['confirmed','not_confirmed','contaminated','not_applicable'].includes(r.isolation),'Invalid isolation status');
 check(Array.isArray(r.limitations)&&r.limitations.every(x=>typeof x==='string'),'Invalid limitations');
 const executed=r.execution_status==='executed';
 check(executed?typeof r.response_text==='string'&&hash(r.response_sha256)&&sha(r.response_text)===r.response_sha256:r.response_text===null&&r.response_sha256===null&&r.review===null,'Response or digest inconsistent with execution status');
 const metrics=r.metrics;
 const nums=['latency_ms','input_tokens','output_tokens','cost','word_count'];
 check(obj(metrics)&&nums.every(k=>metrics[k]===null||(Number.isFinite(metrics[k])&&metrics[k]>=0&&(!['input_tokens','output_tokens','word_count'].includes(k)||Number.isInteger(metrics[k])))),'Invalid numeric metrics');
 check(obj(metrics)&&(metrics.currency===null||str(metrics.currency))&&(metrics.word_cap_pass===null||typeof metrics.word_cap_pass==='boolean'),'Invalid metric fields');
 if(obj(metrics)&&metrics.cost!==null)check(str(metrics.currency),'Measured cost requires currency');
 let score=null,critical=null;
 if(r.review!==null&&executed){
  const q=r.review;
  if(!obj(q)||!str(q.reviewer)||!['confirmed','not_confirmed','none'].includes(q.blinding)||!Array.isArray(q.criteria)||!Array.isArray(rubric?.criteria)){errors.push('Invalid review')}
  else{
   const ids=rubric.criteria.map(x=>x.id);
   const seen=new Set();
   for(const item of q.criteria){
    if(!obj(item)){errors.push('Invalid criterion');continue}
    check(ids.includes(item.id)&&!seen.has(item.id),'Unknown/duplicate criterion: '+item.id);
    seen.add(item.id);
    check([0,1,null].includes(item.score),'Invalid criterion score');
    check(item.score===null?item.evidence===null||typeof item.evidence==='string':str(item.evidence),'Missing review evidence');
   }
   check(seen.size===ids.length&&ids.every(id=>seen.has(id)),'Incomplete criterion set');
   if(q.criteria.every(x=>obj(x)&&[0,1].includes(x.score))&&seen.size===ids.length)score=q.criteria.reduce((a,x)=>a+x.score,0);
   const criticalItems=q.criteria.filter(x=>obj(x)&&rubric.critical_criteria.includes(x.id));
   critical=criticalItems.some(x=>x.score===0)?true:criticalItems.length===rubric.critical_criteria.length&&criticalItems.every(x=>x.score===1)?false:null;
   check(q.critical_failure===critical,'Critical failure flag inconsistent');
   if(q.blinding!=='confirmed')limits.push('Review blinding not confirmed');
  }
 }else limits.push('No completed review');
 if(executed&&obj(metrics)&&Number.isInteger(metrics.word_count)){
  check(metrics.word_cap_pass===(metrics.word_count<=rubric.word_cap),'Word cap flag inconsistent with reported count');
  limits.push('Word count supplied by submitter; counting method not established');
 }
 if(!executed)limits.push('Experiment not executed successfully');
 if(r.isolation!=='confirmed')limits.push('Isolation not confirmed');
 if(!str(r.model?.version))limits.push('Exact model version unknown');
 limits.push('Receipt consistency does not authenticate provider, execution, reviewer, telemetry or session isolation');
 return {adapter_version:'0.1.0',target:'ORA_CORE_MONARCH',source_version:'ORA Open Lab 0.3.0',version_class:'FOREIGN',trace_status:errors.length?'CONFLICT':'PARTIAL',errors,limits,reported_score:errors.length?null:score,reported_critical_failure:errors.length?null:critical,eligible_for_controlled_comparison:false,provenance:{protocol_digest_check:'MEAS',reported_execution:'UNB',independent_isolation:'UNB'},execution_authority:'none'};
}
module.exports={validate};
if(require.main===module){
 try{
  const [receipt,protocol,rubric]=process.argv.slice(2);
  if(!receipt||!protocol||!rubric)throw Error('Usage: node halo-experimental.cjs receipt.json protocol.json rubric.json');
  const read=p=>{if(fs.statSync(p).size>2000000)throw Error('Input too large');return fs.readFileSync(p)};
  const out=validate(JSON.parse(read(receipt)),read(protocol),JSON.parse(read(rubric)));
  console.log(JSON.stringify(out,null,2));process.exitCode=out.errors.length?1:0;
 }catch(e){console.error(e.message);process.exitCode=2}
}
