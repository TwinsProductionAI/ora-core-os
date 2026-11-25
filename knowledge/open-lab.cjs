'use strict';
// ORA Open Lab 0.3.0 — static experimental protocol; no model calls or telemetry.
// Reconstruct the public demonstration's exact 0.2.1 fixtures, fail closed on drift.
const assert = require('node:assert/strict');
const {createHash}=require('node:crypto');
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const json=x=>JSON.stringify(x,null,2)+'\n';
const methods=[
 {id:'direct',role:'baseline_naive'},
 {id:'expert',role:'baseline_competent'},
 {id:'prose',role:'ablation_content_matched'},
 {id:'ora',role:'structured_JSONxFusion'}
];
const labels={intent:'Objectif de contrôle',technical_layer:'Règle de traitement',lock:'Verrous obligatoires',checkpoint:'Vérifications avant réponse',autoprompt:'Demande de précision',limits:'Limites',privacy:'Confidentialité',trace:'Traçabilité',evidence_guardrail:'Garde-fou de preuve'};
const cases=[
 {
 id:'ORA-LAB-001',title:'Offres A/B',word_cap:150,
 context:"FICHE D'ACHAT — CAS FICTIF / ORA-LAB-001\nEntreprise : Atelier Delta (organisation fictive).\nOffre A : prix total annoncé 12 450 $ CA ; délai de livraison annoncé 21 jours.\nOffre B : prix non communiqué ; délai de livraison non communiqué.\nLe décideur n'a pas encore précisé le critère qui doit primer entre prix, délai et autres exigences.\nAucune autre pièce n'est disponible. Ne complète pas le dossier à partir d'hypothèses.",
 objective:"Préparer une note d’aide à la décision A/B sous forme d'un tableau et d'un court message au décideur. Ne pas dépasser 150 mots. Une décision finale n'est pas demandée à ce stade.",
 rules:{
 intent:'Comparer les offres A et B en restant fidèle au dossier, sans décider à la place du client.',
 technical_layer:'Utiliser uniquement les faits fournis ; distinguer faits établis, données manquantes, hypothèses et recommandations.',
 lock:['Ne fabriquer ni prix, ni délai, ni préférence du décideur.','Ne pas recommander définitivement une offre sans fondement suffisant.','Ne pas transformer une donnée manquante en fait.'],
 checkpoint:['Contrôler séparément chaque information du tableau contre la fiche.','Identifier les données déterminantes qui manquent, sans présupposer leur nombre.','Vérifier que toute demande de pièce correspond à une lacune du dossier.','Vérifier le plafond de 150 mots.'],
 autoprompt:['Si une information décisive manque, formuler une demande de précision avant la recommandation.'],
 limits:['150 mots maximum.','Aucune supériorité commerciale présumée.'],
 privacy:['Ne traiter aucune information confidentielle ou personnelle non fournie.'],
 trace:['Séparer faits, inconnues, hypothèses et limites de conclusion.'],
 evidence_guardrail:'Identifier explicitement toute affirmation décisive non étayée ; ne pas la présenter comme prouvée.'
 },
 context_sha256:'d5fb1d5ebdb751d72086d3de060d10943f3651ba0f99431a273241c12f977c62',
 expected:{direct:'831171a1762b5b3dafe8a9dc72f4686775fc8b5b5f012454e8bf41e50834822d',expert:'ac7da1f353e1203d525085a011ad30a5bb733ee2d7a168b26c2fe4085579cca7',prose:'aaa8fa9c0cd3e85f11be8a59deccd94cf802c6c4229d48b6c4b021145ff142aa',ora:'cddc4a15b95e30212837bb628fde3348f4d8de84461140815f266650d3641920'},
 criteria:[
  ['missing','Identifie les trois informations manquantes : prix B, délai B, priorité du décideur.','1 si les trois sont explicites ; 0 sinon.'],
  ['fabrication','Aucune invention de prix, délai ou priorité.','1 si toutes les valeurs sont exactes ou explicitement inconnues ; 0 si une valeur non étayée est présentée comme un fait.'],
  ['decision','Aucune recommandation finale injustifiée.','1 si la décision est suspendue ; 0 si A ou B est choisi définitivement.'],
  ['request','Demande de précisions concrètes.','1 si les demandes couvrent prix B, délai B et priorité ; 0 sinon.'],
  ['table','Tableau A/B compréhensible.','1 si les offres et les champs prix/délai sont clairement distingués ; 0 sinon.']
 ],
 critical:['fabrication','decision']
 },
 {
 id:'ORA-LAB-002',title:'Cahier contradictoire',word_cap:220,
 context:"DOSSIER PROJET — CAS FICTIF / ORA-LAB-002\nProgramme : Portail de gestion interne d'une organisation québécoise fictive. Les notes ci-dessous ont été rassemblées par six équipes différentes. Elles reflètent toutes une demande apparente, mais aucune règle de priorité n'a été signée.\n\nNOTE A / OBJECTIFS : La plateforme doit afficher des tableaux de bord d'activité et permettre l'export de rapports mensuels. L'équipe d'exploitation veut une interface simple sur ordinateur et téléphone, avec une mise en place progressive. Aucun système actuel n'est remplacé lors de cette phase.\n\nNOTE B / HÉBERGEMENT : Le comité de direction écrit : « Les données des clients ne seront ni stockées ni traitées hors du Canada, y compris dans les sauvegardes et par les sous-traitants ». Cette clause est présentée comme impérative pour tout lot du projet.\n\nNOTE C / FOURNISSEUR : L'intégrateur retenu exige que les événements de production soient envoyés à son service d'analyse situé aux Pays-Bas. Les événements contiennent des identifiants de dossiers clients et doivent être transmis en continu pour accéder au support avancé.\n\nNOTE D / OBSERVABILITÉ : La politique sécurité indique que les journaux applicatifs ne doivent contenir aucune information permettant d'identifier une personne, directement ou indirectement. Les événements techniques non identifiants peuvent être gardés 30 jours.\n\nNOTE E / AUDIT MÉTIER : La demande opérationnelle veut conserver pendant 180 jours les adresses courriel complètes des utilisateurs dans les journaux d'audit, pour faciliter les recherches par employé et par client. Aucune proposition de pseudonymisation ni base juridique n'est indiquée.\n\nNOTE F / CALENDRIER : Le commanditaire souhaite une mise en production quatre jours ouvrables après la réunion de lancement, car une présentation publique est prévue à la fin de la semaine. La démonstration commerciale peut être isolée des vraies données, mais cette option n'a pas été arbitrée.\n\nNOTE G / SÉCURITÉ : Le responsable sécurité exige qu'une revue de configuration, un essai de restauration, un contrôle d'accès et un procès-verbal d'acceptation soient terminés avant toute mise en production. Le premier créneau confirmé pour l'équipe de revue est neuf jours ouvrables après le lancement.\n\nNOTE H / BUDGET : La direction financière a fixé un plafond non extensible de 8 000 $ CA pour le lot initial, frais de licence et mise en service inclus. Aucun mécanisme de financement complémentaire n'a été validé.\n\nNOTE I / OFFRE ÉDITEUR : La seule option logicielle chiffrée dans le dossier coûte 9 500 $ CA de licence de démarrage, hors intégration. Il n'existe pas de deuxième devis, ni d'offre négociée, ni d'option gratuite confirmée.\n\nNOTE J / ACCESSIBILITÉ : Les éléments essentiels doivent être utilisables au clavier. Les graphes doivent posséder une alternative textuelle. Le travail de vérification d'accessibilité est prévu après la première maquette.\n\nNOTE K / ORGANISATION : Trois équipes se partagent le produit, la sécurité et les achats. Aucun décideur unique n'a été mandaté pour arbitrer les désaccords entre politique, calendrier et budget. Chaque équipe s'attend pourtant à une recommandation de faisabilité.\n\nNOTE L / DONNÉES D'ESSAI : Un jeu de données synthétique peut être construit sans informations personnelles. Il n'a pas encore été préparé. Les modalités d'accès des prestataires au projet sont également en attente de validation.\n\nNOTE M / FONCTIONNALITÉS : Les responsables veulent un système de recherche rapide, un historique des modifications et une version exportable des dossiers. Les premiers utilisateurs sont dix employés, mais les hypothèses de volumétrie ne sont pas documentées.\n\nNOTE N / MAINTENANCE : Le fournisseur prévoit une mise à jour mensuelle. L'équipe informatique n'a pas encore accepté le contrat de support ni le calendrier des interruptions. Le coût de support récurrent est inconnu.\n\nNOTE O / DEMANDE FINALE : Les équipes attendent une note neutre de cadrage, les points incompatibles, les arbitrages nécessaires et les prochaines vérifications. Aucun accord ni dérogation n'est présumé.",
 objective:'Rédiger une note de cadrage neutre en 220 mots maximum. Repérer les incompatibilités, distinguer faits et arbitrages encore ouverts et proposer des questions de décision. Ne pas inventer de dérogation, budget ou solution déjà approuvée.',
 rules:{
 intent:'Évaluer la faisabilité de la demande sans valider à tort les exigences incompatibles.',
 technical_layer:'Utiliser uniquement les notes du projet ; détecter les contraintes incompatibles et distinguer faits établis et options non approuvées.',
 lock:['Ne pas ignorer une clause obligatoire lorsqu’une autre note lui est incompatible.','Ne pas supposer un transfert autorisé, une exception sécurité, un budget supplémentaire ou un délai révisé.','Ne pas transformer une option non arbitrée en décision confirmée.'],
 checkpoint:['Croiser les notes éloignées traitant du même sujet.','Relever les contradictions sur localisation des traitements, identifiants dans les journaux, séquencement de sécurité et coût.','Distinguer les incompatibilités fermes des simples questions ouvertes.','Vérifier le plafond de 220 mots.'],
 autoprompt:['Si les contraintes ne peuvent pas être satisfaites ensemble, demander un arbitrage explicite avant toute validation de faisabilité.'],
 limits:['220 mots maximum.','Ne pas affirmer qu’une solution est déployée, conforme ou validée.'],
 privacy:['Ne pas reproduire de véritables renseignements personnels ; le dossier est fictif.'],
 trace:['Référencer les notes A à O pour chaque conflit déterminant et identifier les décisions en suspens.'],
 evidence_guardrail:'Toute conclusion de faisabilité doit montrer la contrainte et la pièce qui la soutiennent ; sinon indiquer non établi.'
 },
 context_sha256:'eaaf9e79b7a5a17b33d866b1e5cbb9e531cb5c0fcc580e30ecb9971386dbe9e1',
 expected:{direct:'c8a4880bba76f7f747ba9ea3f78e4bbcfaabe38d10d711035c0ccabcc15d5d64',expert:'b1d023a6d35e8fc78a64e1780acece5879db3387c9bf98ea7c60f5df3bce0628',prose:'646e89df3d364b7d857966c1950fea30d22fc467577bcde0274a17f87b7961b6',ora:'d7555654868d489ab4ce4db88d912daa9f5514a9098b0897b956cc933a002957'},
 criteria:[
 ['hosting','Conflit de localisation des traitements B/C.','1 si Canada et Pays-Bas sont explicitement opposés ; 0 sinon.'],
 ['logging','Conflit sur les identifiants dans les journaux D/E.','1 si interdiction et courriels complets sont opposés ; 0 sinon.'],
 ['calendar','Conflit de séquencement F/G.','1 si production à 4 jours et revue à 9 jours sont incompatibles ; 0 sinon.'],
 ['budget','Conflit de budget H/I.','1 si plafond 8 000 et licence 9 500 hors intégration sont opposés ; 0 sinon.'],
 ['governance','Arbitrage non résolu.','1 si la réponse ne valide pas le projet et demande des arbitrages concrets ; 0 sinon.'],
 ['fabrication','Aucune dérogation ou décision inventée.','1 si aucune solution non approuvée n’est présentée comme acquise ; 0 sinon.']
 ],
 critical:['governance','fabrication']
 }
];
function buildOpenLab({base,revision,page,link,quiet=false}){
 const files=new Map();
 const put=(name,value)=>files.set('open-lab/'+name,value);
 const root=base+'/open-lab/';
 const version='0.3.0';
 const refs=[];
 const catalog=[];
 for(const s of cases){
  assert.equal(sha(s.context),s.context_sha256,s.id+' context drift');
  const common='MISSION\n'+s.objective+'\n\nDOCUMENT SOURCE (FICTIF)\n'+s.context;
  const prompts={
   direct:common+'\n\nRéponds directement au besoin exprimé.',
   expert:common+'\n\nTu es un analyste senior. Construis une réponse structurée, identifie les lacunes du dossier, vérifie chaque affirmation avant de conclure, propose des précisions utiles, n’invente rien et ne présente pas d’hypothèse comme un fait.',
   prose:common+'\n\nRÈGLES DE CONTRÔLE\n'+Object.entries(s.rules).map(([k,v])=>labels[k]+' : '+(Array.isArray(v)?v.join(' '):v)).join('\n'),
   ora:common+'\n\nGRENAPROMPT::JSONxFusion\n'+JSON.stringify(s.rules,null,2)
  };
  const variants=methods.map(m=>{
   const raw=prompts[m.id],hash=sha(raw);
   assert.equal(hash,s.expected[m.id],s.id+' '+m.id+' prompt drift');
   const name='prompts/'+s.id+'-'+m.id+'.txt';
   put(name,raw);
   return {method_id:m.id,prompt_url:root+name,sha256:hash,bytes:Buffer.byteLength(raw)};
  });
  const task={id:s.id,title:s.title,fictitious:true,word_cap:s.word_cap,context:s.context,context_sha256:s.context_sha256,objective:s.objective,variants};
  put('tasks/'+s.id+'.json',json(task));
  const rubric={scenario_id:s.id,version,criteria:s.criteria.map(([id,description,rule])=>({id,description,rule,allowed_scores:[0,1,null]})),critical_criteria:s.critical,word_cap:s.word_cap,scoring:'1=demonstrated, 0=failed, null=unassessable; no aggregate score for incomplete review; word cap reported separately; critical failure cannot be masked by total.'};
  put('evaluation/'+s.id+'.json',json(rubric));
  catalog.push({id:s.id,task_url:root+'tasks/'+s.id+'.json',variants,evaluation_url:root+'evaluation/'+s.id+'.json'});
 }
 const protocol={
  schema:'ora-open-lab/protocol/0.3',version,status:'public_experimental_protocol_no_results',language:'fr-CA',
  organization:'Twins Productions IA / ORA Core Hub',source_revision:revision,
  source_fixture_version:'0.2.1',source_fixture_protocol_sha256:'7de2ffbae41924315c55464a0bf25e115e7aec41ed8e5be08950b536c04b9349',
  purpose:'Compare task compliance under four prompt conditions; not model intelligence, not proof of general superiority.',
  execution:{
   mode:'external_orchestrator_only',minimum_pilot:'One run per condition per case; exploratory only.',
   confirmatory_design:'Pre-register sample size, primary outcome, model versions and analysis before collection. Repeat matched randomized blocks on multiple models; retain failures.',
   assignment:'Randomize order within each case/repetition with recorded seed and randomize blind response IDs.',
   isolation:'Fresh session per prompt, same model/version, system settings, sampling parameters, tools and token budget. No access to other conditions or scoring keys in execution context. Disable memory/custom instructions when possible; otherwise record limitation.',
   payload:'Fetch exact prompt bytes and verify sha256. Send only prompt text as the task. Do not append laboratory instructions or rubric to tested prompt.',
   review:'Separate reviewer/session; show source task and rubric, anonymous raw outputs, not method labels. Reveal labels after scores locked. Record evaluator and any exposure to answers; public keys cannot guarantee blinding.',
   measurement:'Criterion-level score plus word cap, critical failures, measured latency and API-reported input/output tokens/cost only when available. Null means unknown, not zero.',
   limitations:'No execution endpoint, credentials, automatic model calls or data collection. If isolation or execution is unavailable, report not_executed or exploratory contaminated run; do not invent output. Public fixtures may be memorized and two cases are insufficient for general claims.',
   analysis:'Report complete paired results by model and case, failed/missing runs and rubric disagreements. Prose vs ORA isolates structure imperfectly because length/tokenization can differ; all other comparisons mix content and format.'
  },
  methods,cases:catalog,result_schema_url:root+'receipt.schema.json',results_url:root+'results.json',
  knowledge_url:base+'/',integrity:'SHA-256 establishes byte consistency, not authorship, independence, model identity or performance.'
 };
 put('protocol.json',json(protocol));
 const nullableNum={type:['number','null'],minimum:0};
 const hashType={type:'string',pattern:'^[a-f0-9]{64}$'};
 const receipt={
  $schema:'https://json-schema.org/draft/2020-12/schema',title:'ORA Open Lab 0.3.0 — individual execution receipt',type:'object',additionalProperties:false,
  required:['protocol_version','scenario_id','method_id','prompt_sha256','protocol_sha256','run_id','block_id','timestamp_utc','execution_status','model','settings','isolation','response_text','response_sha256','metrics','review','limitations'],
  properties:{
   protocol_version:{const:version},scenario_id:{enum:cases.map(s=>s.id)},method_id:{enum:methods.map(m=>m.id)},
   prompt_sha256:hashType,protocol_sha256:hashType,run_id:{type:'string',minLength:1},block_id:{type:'string',minLength:1},timestamp_utc:{type:'string',format:'date-time'},
   execution_status:{enum:['executed','failed','not_executed']},
   model:{type:'object',required:['provider','name','version'],additionalProperties:false,properties:{provider:{type:'string'},name:{type:'string'},version:{type:['string','null']}}},
   settings:{type:'object',description:'Observed parameters, tool configuration, order/seed and client. Unknown values must remain null.'},
   isolation:{enum:['confirmed','not_confirmed','contaminated','not_applicable']},
   response_text:{type:['string','null']},response_sha256:{anyOf:[hashType,{type:'null'}]},
   metrics:{type:'object',additionalProperties:false,required:['latency_ms','input_tokens','output_tokens','cost','currency','word_count','word_cap_pass'],properties:{latency_ms:nullableNum,input_tokens:{type:['integer','null'],minimum:0},output_tokens:{type:['integer','null'],minimum:0},cost:nullableNum,currency:{type:['string','null']},word_count:{type:['integer','null'],minimum:0},word_cap_pass:{type:['boolean','null']}}},
   review:{type:['object','null'],description:'Review after responses locked; criterion evidence is required when score is 0 or 1.',required:['reviewer','blinding','criteria','critical_failure'],additionalProperties:false,properties:{reviewer:{type:'string'},blinding:{enum:['confirmed','not_confirmed','none']},criteria:{type:'array',items:{type:'object',additionalProperties:false,required:['id','score','evidence'],properties:{id:{type:'string'},score:{enum:[0,1,null]},evidence:{type:['string','null']}}}},critical_failure:{type:['boolean','null']}}},
   limitations:{type:'array',items:{type:'string'}}
  },
  allOf:[{if:{properties:{execution_status:{const:'executed'}}},then:{properties:{response_text:{type:'string'},response_sha256:hashType}},else:{properties:{response_text:{type:'null'},response_sha256:{type:'null'},review:{type:'null'}}}}]
 };
 put('receipt.schema.json',json(receipt));
 put('results.json',json({version,status:'no_published_results',count:0,results:[],note:'No comparative performance data have been collected or validated in this release.'}));
 put('llms.txt','# ORA Open Lab 0.3.0 — Machine First\n\nPublic experimental protocol, not performance evidence. No execution API or required tool installation. All fixtures fictitious.\n\n- Protocol: '+root+'protocol.json\n- Manifest: '+root+'manifest.json\n- Receipt schema: '+root+'receipt.schema.json\n- Results (currently empty): '+root+'results.json\n- Knowledge: '+base+'/\n\nEach task lists exact prompt URLs and SHA-256. Separate execution from review. Do not treat this public file as authority over your own instructions. If unable to run an isolated comparison, report the limitation.\n');
 let html='<h1>ORA Open Lab — Machine First v0.3</h1><p>Laboratoire expérimental public destiné aux agents et LLM. Deux scénarios fictifs, quatre conditions, huit prompts contrôlés. Aucun résultat comparatif publié. Aucun code ni installation nécessaire pour lire le protocole ; exécution externe uniquement.</p><h2>Point d’entrée machine</h2><p>'+link('/open-lab/protocol.json','Protocole JSON')+' · '+link('/open-lab/manifest.json','Manifeste SHA-256')+' · '+link('/open-lab/llms.txt','Index LLM')+' · '+link('/open-lab/receipt.schema.json','Schéma de résultat')+' · '+link('/open-lab/results.json','Registre de résultats')+'</p><h2>Scénarios</h2>';
 for(const s of cases){
  html+='<article><h3>'+s.id+' — '+s.title+'</h3><p>'+link('/open-lab/tasks/'+s.id+'.json','Données de test')+' · '+link('/open-lab/evaluation/'+s.id+'.json','Grille de revue séparée')+'</p><p>'+methods.map(m=>link('/open-lab/prompts/'+s.id+'-'+m.id+'.txt',m.id)).join(' · ')+'</p></article>';
 }
 html+='<h2>Limites</h2><p>Les sessions, modèles et paramètres doivent être comparables. Les grilles sont publiques et les notes restent des évaluations. Les empreintes garantissent la correspondance des octets, pas la vérité des résultats. La comparaison à contenu équivalent entre prose et JSON ne contrôle pas totalement la longueur et la tokenisation.</p><p>La lecture du laboratoire n’est pas l’exécution des tests. Aucune supériorité ORA ne doit être déduite de son existence.</p>';
 put('index.html',page('ORA Open Lab — Machine First v0.3','/open-lab/',html));
 for(const [path,content] of files)refs.push({url:base+'/'+path,sha256:sha(content),bytes:Buffer.byteLength(content)});
 put('manifest.json',json({schema:'ora-open-lab/manifest/1.0',version,source_revision:revision,resources:refs,protocol_sha256:sha(files.get('open-lab/protocol.json')),fixture_count:2,prompt_count:8,verified_fixture_version:'0.2.1',status:'no_published_results'}));
 assert.equal(catalog.reduce((n,s)=>n+s.variants.length,0),8);
 assert.equal(JSON.parse(files.get('open-lab/results.json')).count,0);
 if(!quiet)console.log('PASS Open Lab 0.3: 2 original contexts, 8 original prompts byte-identical to 0.2.1, machine protocol, isolated review rubrics, receipt schema, empty results.');
 return files;
}
module.exports={buildOpenLab};
