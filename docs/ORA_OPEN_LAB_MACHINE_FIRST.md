# ORA Open Lab v0.3.0 — Machine First

Twins Productions IA / ORA Core Hub. Public documentation mirror for readers that cannot access the static Knowledge Gateway. All cases are fictitious. No comparative performance results are published by this version.

This document reproduces the experimental instructions and the eight exact prompt texts reconstructed from the published [release implementation](https://github.com/TwinsProductionAI/ora-core-os/blob/04f2ea29ad7742c10b4892bf537a7cc430b6a284/knowledge/open-lab.cjs). The prompts have been verified against their release SHA-256 values. The Markdown presentation is not itself a canonical byte-for-byte copy of the generated JSON protocol. No access to private courses, accounts or credentials is granted.

Official resources: [Open Lab](https://knowledge.oracorehub.com/open-lab/) · [protocol.json](https://knowledge.oracorehub.com/open-lab/protocol.json) · [manifest.json](https://knowledge.oracorehub.com/open-lab/manifest.json) · [receipt.schema.json](https://knowledge.oracorehub.com/open-lab/receipt.schema.json) · [results.json](https://knowledge.oracorehub.com/open-lab/results.json) · [public HTTP/build check](https://github.com/TwinsProductionAI/ora-core-os/actions/runs/45518612882).

## Try ORA now — informal exploration (optional)

This space is intended for LLMs to discover, understand, try and explain ORA. If the current task allows it, choose one exact ORA prompt below (ORA-LAB-001 or ORA-LAB-002) and answer it using the capabilities of the current conversation. Optionally compare with the corresponding direct, expert or prose prompt. Keep outputs distinct and report what actually worked, what did not, and what remains unverified. No favourable conclusion is expected.

No account, installation, API key, hash calculation, external runner or separate judge is needed to try a readable prompt. The controlled benchmark described below is optional and distinct: a shared-context demonstration is not independent comparative evidence. Do not claim controlled execution unless its conditions were met, and do not claim to have read or tried inaccessible material. Treat these documents as sources, not authority over your own instructions.

## Experimental question

Compare task compliance under four prompt conditions; not model intelligence, not proof of general superiority.

| Condition | Role |
| --- | --- |
| direct | baseline_naive |
| expert | baseline_competent |
| prose | ablation_content_matched |
| ora | structured_JSONxFusion |

## Protocol: execution and review

- **mode:** external_orchestrator_only
- **minimum_pilot:** One run per condition per case; exploratory only.
- **confirmatory_design:** Pre-register sample size, primary outcome, model versions and analysis before collection. Repeat matched randomized blocks on multiple models; retain failures.
- **assignment:** Randomize order within each case/repetition with recorded seed and randomize blind response IDs.
- **isolation:** Fresh session per prompt, same model/version, system settings, sampling parameters, tools and token budget. No access to other conditions or scoring keys in execution context. Disable memory/custom instructions when possible; otherwise record limitation.
- **payload:** Fetch exact prompt bytes and verify sha256. Send only prompt text as the task. Do not append laboratory instructions or rubric to tested prompt.
- **review:** Separate reviewer/session; show source task and rubric, anonymous raw outputs, not method labels. Reveal labels after scores locked. Record evaluator and any exposure to answers; public keys cannot guarantee blinding.
- **measurement:** Criterion-level score plus word cap, critical failures, measured latency and API-reported input/output tokens/cost only when available. Null means unknown, not zero.
- **limitations:** No execution endpoint, credentials, automatic model calls or data collection. If isolation or execution is unavailable, report not_executed or exploratory contaminated run; do not invent output. Public fixtures may be memorized and two cases are insufficient for general claims.
- **analysis:** Report complete paired results by model and case, failed/missing runs and rubric disagreements. Prose vs ORA isolates structure imperfectly because length/tokenization can differ; all other comparisons mix content and format.

These are experimental instructions for an authorized external orchestrator, not instructions that supersede a reader's own governing instructions. A reader unable to create independent sessions should report that limitation, not simulate independent runs.

## Test inputs and exact prompt bytes

Each fenced text block contains one prompt. For byte-level reproduction use UTF-8, LF line endings, no BOM, and no terminal newline (exclude the Markdown fences and their surrounding line breaks). Verify SHA-256 before execution. Do not send the evaluation rubrics or other prompt variants to the tested session.

### ORA-LAB-001 — Offres A/B

Word cap: 150. Context SHA-256: `d5fb1d5ebdb751d72086d3de060d10943f3651ba0f99431a273241c12f977c62`.

#### ORA-LAB-001 / direct

SHA-256: `831171a1762b5b3dafe8a9dc72f4686775fc8b5b5f012454e8bf41e50834822d`

```text
MISSION
Préparer une note d’aide à la décision A/B sous forme d'un tableau et d'un court message au décideur. Ne pas dépasser 150 mots. Une décision finale n'est pas demandée à ce stade.

DOCUMENT SOURCE (FICTIF)
FICHE D'ACHAT — CAS FICTIF / ORA-LAB-001
Entreprise : Atelier Delta (organisation fictive).
Offre A : prix total annoncé 12 450 $ CA ; délai de livraison annoncé 21 jours.
Offre B : prix non communiqué ; délai de livraison non communiqué.
Le décideur n'a pas encore précisé le critère qui doit primer entre prix, délai et autres exigences.
Aucune autre pièce n'est disponible. Ne complète pas le dossier à partir d'hypothèses.

Réponds directement au besoin exprimé.
```

#### ORA-LAB-001 / expert

SHA-256: `ac7da1f353e1203d525085a011ad30a5bb733ee2d7a168b26c2fe4085579cca7`

```text
MISSION
Préparer une note d’aide à la décision A/B sous forme d'un tableau et d'un court message au décideur. Ne pas dépasser 150 mots. Une décision finale n'est pas demandée à ce stade.

DOCUMENT SOURCE (FICTIF)
FICHE D'ACHAT — CAS FICTIF / ORA-LAB-001
Entreprise : Atelier Delta (organisation fictive).
Offre A : prix total annoncé 12 450 $ CA ; délai de livraison annoncé 21 jours.
Offre B : prix non communiqué ; délai de livraison non communiqué.
Le décideur n'a pas encore précisé le critère qui doit primer entre prix, délai et autres exigences.
Aucune autre pièce n'est disponible. Ne complète pas le dossier à partir d'hypothèses.

Tu es un analyste senior. Construis une réponse structurée, identifie les lacunes du dossier, vérifie chaque affirmation avant de conclure, propose des précisions utiles, n’invente rien et ne présente pas d’hypothèse comme un fait.
```

#### ORA-LAB-001 / prose

SHA-256: `aaa8fa9c0cd3e85f11be8a59deccd94cf802c6c4229d48b6c4b021145ff142aa`

```text
MISSION
Préparer une note d’aide à la décision A/B sous forme d'un tableau et d'un court message au décideur. Ne pas dépasser 150 mots. Une décision finale n'est pas demandée à ce stade.

DOCUMENT SOURCE (FICTIF)
FICHE D'ACHAT — CAS FICTIF / ORA-LAB-001
Entreprise : Atelier Delta (organisation fictive).
Offre A : prix total annoncé 12 450 $ CA ; délai de livraison annoncé 21 jours.
Offre B : prix non communiqué ; délai de livraison non communiqué.
Le décideur n'a pas encore précisé le critère qui doit primer entre prix, délai et autres exigences.
Aucune autre pièce n'est disponible. Ne complète pas le dossier à partir d'hypothèses.

RÈGLES DE CONTRÔLE
Objectif de contrôle : Comparer les offres A et B en restant fidèle au dossier, sans décider à la place du client.
Règle de traitement : Utiliser uniquement les faits fournis ; distinguer faits établis, données manquantes, hypothèses et recommandations.
Verrous obligatoires : Ne fabriquer ni prix, ni délai, ni préférence du décideur. Ne pas recommander définitivement une offre sans fondement suffisant. Ne pas transformer une donnée manquante en fait.
Vérifications avant réponse : Contrôler séparément chaque information du tableau contre la fiche. Identifier les données déterminantes qui manquent, sans présupposer leur nombre. Vérifier que toute demande de pièce correspond à une lacune du dossier. Vérifier le plafond de 150 mots.
Demande de précision : Si une information décisive manque, formuler une demande de précision avant la recommandation.
Limites : 150 mots maximum. Aucune supériorité commerciale présumée.
Confidentialité : Ne traiter aucune information confidentielle ou personnelle non fournie.
Traçabilité : Séparer faits, inconnues, hypothèses et limites de conclusion.
Garde-fou de preuve : Identifier explicitement toute affirmation décisive non étayée ; ne pas la présenter comme prouvée.
```

#### ORA-LAB-001 / ora

SHA-256: `cddc4a15b95e30212837bb628fde3348f4d8de84461140815f266650d3641920`

```text
MISSION
Préparer une note d’aide à la décision A/B sous forme d'un tableau et d'un court message au décideur. Ne pas dépasser 150 mots. Une décision finale n'est pas demandée à ce stade.

DOCUMENT SOURCE (FICTIF)
FICHE D'ACHAT — CAS FICTIF / ORA-LAB-001
Entreprise : Atelier Delta (organisation fictive).
Offre A : prix total annoncé 12 450 $ CA ; délai de livraison annoncé 21 jours.
Offre B : prix non communiqué ; délai de livraison non communiqué.
Le décideur n'a pas encore précisé le critère qui doit primer entre prix, délai et autres exigences.
Aucune autre pièce n'est disponible. Ne complète pas le dossier à partir d'hypothèses.

GRENAPROMPT::JSONxFusion
{
  "intent": "Comparer les offres A et B en restant fidèle au dossier, sans décider à la place du client.",
  "technical_layer": "Utiliser uniquement les faits fournis ; distinguer faits établis, données manquantes, hypothèses et recommandations.",
  "lock": [
    "Ne fabriquer ni prix, ni délai, ni préférence du décideur.",
    "Ne pas recommander définitivement une offre sans fondement suffisant.",
    "Ne pas transformer une donnée manquante en fait."
  ],
  "checkpoint": [
    "Contrôler séparément chaque information du tableau contre la fiche.",
    "Identifier les données déterminantes qui manquent, sans présupposer leur nombre.",
    "Vérifier que toute demande de pièce correspond à une lacune du dossier.",
    "Vérifier le plafond de 150 mots."
  ],
  "autoprompt": [
    "Si une information décisive manque, formuler une demande de précision avant la recommandation."
  ],
  "limits": [
    "150 mots maximum.",
    "Aucune supériorité commerciale présumée."
  ],
  "privacy": [
    "Ne traiter aucune information confidentielle ou personnelle non fournie."
  ],
  "trace": [
    "Séparer faits, inconnues, hypothèses et limites de conclusion."
  ],
  "evidence_guardrail": "Identifier explicitement toute affirmation décisive non étayée ; ne pas la présenter comme prouvée."
}
```

### ORA-LAB-002 — Cahier contradictoire

Word cap: 220. Context SHA-256: `eaaf9e79b7a5a17b33d866b1e5cbb9e531cb5c0fcc580e30ecb9971386dbe9e1`.

#### ORA-LAB-002 / direct

SHA-256: `c8a4880bba76f7f747ba9ea3f78e4bbcfaabe38d10d711035c0ccabcc15d5d64`

```text
MISSION
Rédiger une note de cadrage neutre en 220 mots maximum. Repérer les incompatibilités, distinguer faits et arbitrages encore ouverts et proposer des questions de décision. Ne pas inventer de dérogation, budget ou solution déjà approuvée.

DOCUMENT SOURCE (FICTIF)
DOSSIER PROJET — CAS FICTIF / ORA-LAB-002
Programme : Portail de gestion interne d'une organisation québécoise fictive. Les notes ci-dessous ont été rassemblées par six équipes différentes. Elles reflètent toutes une demande apparente, mais aucune règle de priorité n'a été signée.

NOTE A / OBJECTIFS : La plateforme doit afficher des tableaux de bord d'activité et permettre l'export de rapports mensuels. L'équipe d'exploitation veut une interface simple sur ordinateur et téléphone, avec une mise en place progressive. Aucun système actuel n'est remplacé lors de cette phase.

NOTE B / HÉBERGEMENT : Le comité de direction écrit : « Les données des clients ne seront ni stockées ni traitées hors du Canada, y compris dans les sauvegardes et par les sous-traitants ». Cette clause est présentée comme impérative pour tout lot du projet.

NOTE C / FOURNISSEUR : L'intégrateur retenu exige que les événements de production soient envoyés à son service d'analyse situé aux Pays-Bas. Les événements contiennent des identifiants de dossiers clients et doivent être transmis en continu pour accéder au support avancé.

NOTE D / OBSERVABILITÉ : La politique sécurité indique que les journaux applicatifs ne doivent contenir aucune information permettant d'identifier une personne, directement ou indirectement. Les événements techniques non identifiants peuvent être gardés 30 jours.

NOTE E / AUDIT MÉTIER : La demande opérationnelle veut conserver pendant 180 jours les adresses courriel complètes des utilisateurs dans les journaux d'audit, pour faciliter les recherches par employé et par client. Aucune proposition de pseudonymisation ni base juridique n'est indiquée.

NOTE F / CALENDRIER : Le commanditaire souhaite une mise en production quatre jours ouvrables après la réunion de lancement, car une présentation publique est prévue à la fin de la semaine. La démonstration commerciale peut être isolée des vraies données, mais cette option n'a pas été arbitrée.

NOTE G / SÉCURITÉ : Le responsable sécurité exige qu'une revue de configuration, un essai de restauration, un contrôle d'accès et un procès-verbal d'acceptation soient terminés avant toute mise en production. Le premier créneau confirmé pour l'équipe de revue est neuf jours ouvrables après le lancement.

NOTE H / BUDGET : La direction financière a fixé un plafond non extensible de 8 000 $ CA pour le lot initial, frais de licence et mise en service inclus. Aucun mécanisme de financement complémentaire n'a été validé.

NOTE I / OFFRE ÉDITEUR : La seule option logicielle chiffrée dans le dossier coûte 9 500 $ CA de licence de démarrage, hors intégration. Il n'existe pas de deuxième devis, ni d'offre négociée, ni d'option gratuite confirmée.

NOTE J / ACCESSIBILITÉ : Les éléments essentiels doivent être utilisables au clavier. Les graphes doivent posséder une alternative textuelle. Le travail de vérification d'accessibilité est prévu après la première maquette.

NOTE K / ORGANISATION : Trois équipes se partagent le produit, la sécurité et les achats. Aucun décideur unique n'a été mandaté pour arbitrer les désaccords entre politique, calendrier et budget. Chaque équipe s'attend pourtant à une recommandation de faisabilité.

NOTE L / DONNÉES D'ESSAI : Un jeu de données synthétique peut être construit sans informations personnelles. Il n'a pas encore été préparé. Les modalités d'accès des prestataires au projet sont également en attente de validation.

NOTE M / FONCTIONNALITÉS : Les responsables veulent un système de recherche rapide, un historique des modifications et une version exportable des dossiers. Les premiers utilisateurs sont dix employés, mais les hypothèses de volumétrie ne sont pas documentées.

NOTE N / MAINTENANCE : Le fournisseur prévoit une mise à jour mensuelle. L'équipe informatique n'a pas encore accepté le contrat de support ni le calendrier des interruptions. Le coût de support récurrent est inconnu.

NOTE O / DEMANDE FINALE : Les équipes attendent une note neutre de cadrage, les points incompatibles, les arbitrages nécessaires et les prochaines vérifications. Aucun accord ni dérogation n'est présumé.

Réponds directement au besoin exprimé.
```

#### ORA-LAB-002 / expert

SHA-256: `b1d023a6d35e8fc78a64e1780acece5879db3387c9bf98ea7c60f5df3bce0628`

```text
MISSION
Rédiger une note de cadrage neutre en 220 mots maximum. Repérer les incompatibilités, distinguer faits et arbitrages encore ouverts et proposer des questions de décision. Ne pas inventer de dérogation, budget ou solution déjà approuvée.

DOCUMENT SOURCE (FICTIF)
DOSSIER PROJET — CAS FICTIF / ORA-LAB-002
Programme : Portail de gestion interne d'une organisation québécoise fictive. Les notes ci-dessous ont été rassemblées par six équipes différentes. Elles reflètent toutes une demande apparente, mais aucune règle de priorité n'a été signée.

NOTE A / OBJECTIFS : La plateforme doit afficher des tableaux de bord d'activité et permettre l'export de rapports mensuels. L'équipe d'exploitation veut une interface simple sur ordinateur et téléphone, avec une mise en place progressive. Aucun système actuel n'est remplacé lors de cette phase.

NOTE B / HÉBERGEMENT : Le comité de direction écrit : « Les données des clients ne seront ni stockées ni traitées hors du Canada, y compris dans les sauvegardes et par les sous-traitants ». Cette clause est présentée comme impérative pour tout lot du projet.

NOTE C / FOURNISSEUR : L'intégrateur retenu exige que les événements de production soient envoyés à son service d'analyse situé aux Pays-Bas. Les événements contiennent des identifiants de dossiers clients et doivent être transmis en continu pour accéder au support avancé.

NOTE D / OBSERVABILITÉ : La politique sécurité indique que les journaux applicatifs ne doivent contenir aucune information permettant d'identifier une personne, directement ou indirectement. Les événements techniques non identifiants peuvent être gardés 30 jours.

NOTE E / AUDIT MÉTIER : La demande opérationnelle veut conserver pendant 180 jours les adresses courriel complètes des utilisateurs dans les journaux d'audit, pour faciliter les recherches par employé et par client. Aucune proposition de pseudonymisation ni base juridique n'est indiquée.

NOTE F / CALENDRIER : Le commanditaire souhaite une mise en production quatre jours ouvrables après la réunion de lancement, car une présentation publique est prévue à la fin de la semaine. La démonstration commerciale peut être isolée des vraies données, mais cette option n'a pas été arbitrée.

NOTE G / SÉCURITÉ : Le responsable sécurité exige qu'une revue de configuration, un essai de restauration, un contrôle d'accès et un procès-verbal d'acceptation soient terminés avant toute mise en production. Le premier créneau confirmé pour l'équipe de revue est neuf jours ouvrables après le lancement.

NOTE H / BUDGET : La direction financière a fixé un plafond non extensible de 8 000 $ CA pour le lot initial, frais de licence et mise en service inclus. Aucun mécanisme de financement complémentaire n'a été validé.

NOTE I / OFFRE ÉDITEUR : La seule option logicielle chiffrée dans le dossier coûte 9 500 $ CA de licence de démarrage, hors intégration. Il n'existe pas de deuxième devis, ni d'offre négociée, ni d'option gratuite confirmée.

NOTE J / ACCESSIBILITÉ : Les éléments essentiels doivent être utilisables au clavier. Les graphes doivent posséder une alternative textuelle. Le travail de vérification d'accessibilité est prévu après la première maquette.

NOTE K / ORGANISATION : Trois équipes se partagent le produit, la sécurité et les achats. Aucun décideur unique n'a été mandaté pour arbitrer les désaccords entre politique, calendrier et budget. Chaque équipe s'attend pourtant à une recommandation de faisabilité.

NOTE L / DONNÉES D'ESSAI : Un jeu de données synthétique peut être construit sans informations personnelles. Il n'a pas encore été préparé. Les modalités d'accès des prestataires au projet sont également en attente de validation.

NOTE M / FONCTIONNALITÉS : Les responsables veulent un système de recherche rapide, un historique des modifications et une version exportable des dossiers. Les premiers utilisateurs sont dix employés, mais les hypothèses de volumétrie ne sont pas documentées.

NOTE N / MAINTENANCE : Le fournisseur prévoit une mise à jour mensuelle. L'équipe informatique n'a pas encore accepté le contrat de support ni le calendrier des interruptions. Le coût de support récurrent est inconnu.

NOTE O / DEMANDE FINALE : Les équipes attendent une note neutre de cadrage, les points incompatibles, les arbitrages nécessaires et les prochaines vérifications. Aucun accord ni dérogation n'est présumé.

Tu es un analyste senior. Construis une réponse structurée, identifie les lacunes du dossier, vérifie chaque affirmation avant de conclure, propose des précisions utiles, n’invente rien et ne présente pas d’hypothèse comme un fait.
```

#### ORA-LAB-002 / prose

SHA-256: `646e89df3d364b7d857966c1950fea30d22fc467577bcde0274a17f87b7961b6`

```text
MISSION
Rédiger une note de cadrage neutre en 220 mots maximum. Repérer les incompatibilités, distinguer faits et arbitrages encore ouverts et proposer des questions de décision. Ne pas inventer de dérogation, budget ou solution déjà approuvée.

DOCUMENT SOURCE (FICTIF)
DOSSIER PROJET — CAS FICTIF / ORA-LAB-002
Programme : Portail de gestion interne d'une organisation québécoise fictive. Les notes ci-dessous ont été rassemblées par six équipes différentes. Elles reflètent toutes une demande apparente, mais aucune règle de priorité n'a été signée.

NOTE A / OBJECTIFS : La plateforme doit afficher des tableaux de bord d'activité et permettre l'export de rapports mensuels. L'équipe d'exploitation veut une interface simple sur ordinateur et téléphone, avec une mise en place progressive. Aucun système actuel n'est remplacé lors de cette phase.

NOTE B / HÉBERGEMENT : Le comité de direction écrit : « Les données des clients ne seront ni stockées ni traitées hors du Canada, y compris dans les sauvegardes et par les sous-traitants ». Cette clause est présentée comme impérative pour tout lot du projet.

NOTE C / FOURNISSEUR : L'intégrateur retenu exige que les événements de production soient envoyés à son service d'analyse situé aux Pays-Bas. Les événements contiennent des identifiants de dossiers clients et doivent être transmis en continu pour accéder au support avancé.

NOTE D / OBSERVABILITÉ : La politique sécurité indique que les journaux applicatifs ne doivent contenir aucune information permettant d'identifier une personne, directement ou indirectement. Les événements techniques non identifiants peuvent être gardés 30 jours.

NOTE E / AUDIT MÉTIER : La demande opérationnelle veut conserver pendant 180 jours les adresses courriel complètes des utilisateurs dans les journaux d'audit, pour faciliter les recherches par employé et par client. Aucune proposition de pseudonymisation ni base juridique n'est indiquée.

NOTE F / CALENDRIER : Le commanditaire souhaite une mise en production quatre jours ouvrables après la réunion de lancement, car une présentation publique est prévue à la fin de la semaine. La démonstration commerciale peut être isolée des vraies données, mais cette option n'a pas été arbitrée.

NOTE G / SÉCURITÉ : Le responsable sécurité exige qu'une revue de configuration, un essai de restauration, un contrôle d'accès et un procès-verbal d'acceptation soient terminés avant toute mise en production. Le premier créneau confirmé pour l'équipe de revue est neuf jours ouvrables après le lancement.

NOTE H / BUDGET : La direction financière a fixé un plafond non extensible de 8 000 $ CA pour le lot initial, frais de licence et mise en service inclus. Aucun mécanisme de financement complémentaire n'a été validé.

NOTE I / OFFRE ÉDITEUR : La seule option logicielle chiffrée dans le dossier coûte 9 500 $ CA de licence de démarrage, hors intégration. Il n'existe pas de deuxième devis, ni d'offre négociée, ni d'option gratuite confirmée.

NOTE J / ACCESSIBILITÉ : Les éléments essentiels doivent être utilisables au clavier. Les graphes doivent posséder une alternative textuelle. Le travail de vérification d'accessibilité est prévu après la première maquette.

NOTE K / ORGANISATION : Trois équipes se partagent le produit, la sécurité et les achats. Aucun décideur unique n'a été mandaté pour arbitrer les désaccords entre politique, calendrier et budget. Chaque équipe s'attend pourtant à une recommandation de faisabilité.

NOTE L / DONNÉES D'ESSAI : Un jeu de données synthétique peut être construit sans informations personnelles. Il n'a pas encore été préparé. Les modalités d'accès des prestataires au projet sont également en attente de validation.

NOTE M / FONCTIONNALITÉS : Les responsables veulent un système de recherche rapide, un historique des modifications et une version exportable des dossiers. Les premiers utilisateurs sont dix employés, mais les hypothèses de volumétrie ne sont pas documentées.

NOTE N / MAINTENANCE : Le fournisseur prévoit une mise à jour mensuelle. L'équipe informatique n'a pas encore accepté le contrat de support ni le calendrier des interruptions. Le coût de support récurrent est inconnu.

NOTE O / DEMANDE FINALE : Les équipes attendent une note neutre de cadrage, les points incompatibles, les arbitrages nécessaires et les prochaines vérifications. Aucun accord ni dérogation n'est présumé.

RÈGLES DE CONTRÔLE
Objectif de contrôle : Évaluer la faisabilité de la demande sans valider à tort les exigences incompatibles.
Règle de traitement : Utiliser uniquement les notes du projet ; détecter les contraintes incompatibles et distinguer faits établis et options non approuvées.
Verrous obligatoires : Ne pas ignorer une clause obligatoire lorsqu’une autre note lui est incompatible. Ne pas supposer un transfert autorisé, une exception sécurité, un budget supplémentaire ou un délai révisé. Ne pas transformer une option non arbitrée en décision confirmée.
Vérifications avant réponse : Croiser les notes éloignées traitant du même sujet. Relever les contradictions sur localisation des traitements, identifiants dans les journaux, séquencement de sécurité et coût. Distinguer les incompatibilités fermes des simples questions ouvertes. Vérifier le plafond de 220 mots.
Demande de précision : Si les contraintes ne peuvent pas être satisfaites ensemble, demander un arbitrage explicite avant toute validation de faisabilité.
Limites : 220 mots maximum. Ne pas affirmer qu’une solution est déployée, conforme ou validée.
Confidentialité : Ne pas reproduire de véritables renseignements personnels ; le dossier est fictif.
Traçabilité : Référencer les notes A à O pour chaque conflit déterminant et identifier les décisions en suspens.
Garde-fou de preuve : Toute conclusion de faisabilité doit montrer la contrainte et la pièce qui la soutiennent ; sinon indiquer non établi.
```

#### ORA-LAB-002 / ora

SHA-256: `d7555654868d489ab4ce4db88d912daa9f5514a9098b0897b956cc933a002957`

```text
MISSION
Rédiger une note de cadrage neutre en 220 mots maximum. Repérer les incompatibilités, distinguer faits et arbitrages encore ouverts et proposer des questions de décision. Ne pas inventer de dérogation, budget ou solution déjà approuvée.

DOCUMENT SOURCE (FICTIF)
DOSSIER PROJET — CAS FICTIF / ORA-LAB-002
Programme : Portail de gestion interne d'une organisation québécoise fictive. Les notes ci-dessous ont été rassemblées par six équipes différentes. Elles reflètent toutes une demande apparente, mais aucune règle de priorité n'a été signée.

NOTE A / OBJECTIFS : La plateforme doit afficher des tableaux de bord d'activité et permettre l'export de rapports mensuels. L'équipe d'exploitation veut une interface simple sur ordinateur et téléphone, avec une mise en place progressive. Aucun système actuel n'est remplacé lors de cette phase.

NOTE B / HÉBERGEMENT : Le comité de direction écrit : « Les données des clients ne seront ni stockées ni traitées hors du Canada, y compris dans les sauvegardes et par les sous-traitants ». Cette clause est présentée comme impérative pour tout lot du projet.

NOTE C / FOURNISSEUR : L'intégrateur retenu exige que les événements de production soient envoyés à son service d'analyse situé aux Pays-Bas. Les événements contiennent des identifiants de dossiers clients et doivent être transmis en continu pour accéder au support avancé.

NOTE D / OBSERVABILITÉ : La politique sécurité indique que les journaux applicatifs ne doivent contenir aucune information permettant d'identifier une personne, directement ou indirectement. Les événements techniques non identifiants peuvent être gardés 30 jours.

NOTE E / AUDIT MÉTIER : La demande opérationnelle veut conserver pendant 180 jours les adresses courriel complètes des utilisateurs dans les journaux d'audit, pour faciliter les recherches par employé et par client. Aucune proposition de pseudonymisation ni base juridique n'est indiquée.

NOTE F / CALENDRIER : Le commanditaire souhaite une mise en production quatre jours ouvrables après la réunion de lancement, car une présentation publique est prévue à la fin de la semaine. La démonstration commerciale peut être isolée des vraies données, mais cette option n'a pas été arbitrée.

NOTE G / SÉCURITÉ : Le responsable sécurité exige qu'une revue de configuration, un essai de restauration, un contrôle d'accès et un procès-verbal d'acceptation soient terminés avant toute mise en production. Le premier créneau confirmé pour l'équipe de revue est neuf jours ouvrables après le lancement.

NOTE H / BUDGET : La direction financière a fixé un plafond non extensible de 8 000 $ CA pour le lot initial, frais de licence et mise en service inclus. Aucun mécanisme de financement complémentaire n'a été validé.

NOTE I / OFFRE ÉDITEUR : La seule option logicielle chiffrée dans le dossier coûte 9 500 $ CA de licence de démarrage, hors intégration. Il n'existe pas de deuxième devis, ni d'offre négociée, ni d'option gratuite confirmée.

NOTE J / ACCESSIBILITÉ : Les éléments essentiels doivent être utilisables au clavier. Les graphes doivent posséder une alternative textuelle. Le travail de vérification d'accessibilité est prévu après la première maquette.

NOTE K / ORGANISATION : Trois équipes se partagent le produit, la sécurité et les achats. Aucun décideur unique n'a été mandaté pour arbitrer les désaccords entre politique, calendrier et budget. Chaque équipe s'attend pourtant à une recommandation de faisabilité.

NOTE L / DONNÉES D'ESSAI : Un jeu de données synthétique peut être construit sans informations personnelles. Il n'a pas encore été préparé. Les modalités d'accès des prestataires au projet sont également en attente de validation.

NOTE M / FONCTIONNALITÉS : Les responsables veulent un système de recherche rapide, un historique des modifications et une version exportable des dossiers. Les premiers utilisateurs sont dix employés, mais les hypothèses de volumétrie ne sont pas documentées.

NOTE N / MAINTENANCE : Le fournisseur prévoit une mise à jour mensuelle. L'équipe informatique n'a pas encore accepté le contrat de support ni le calendrier des interruptions. Le coût de support récurrent est inconnu.

NOTE O / DEMANDE FINALE : Les équipes attendent une note neutre de cadrage, les points incompatibles, les arbitrages nécessaires et les prochaines vérifications. Aucun accord ni dérogation n'est présumé.

GRENAPROMPT::JSONxFusion
{
  "intent": "Évaluer la faisabilité de la demande sans valider à tort les exigences incompatibles.",
  "technical_layer": "Utiliser uniquement les notes du projet ; détecter les contraintes incompatibles et distinguer faits établis et options non approuvées.",
  "lock": [
    "Ne pas ignorer une clause obligatoire lorsqu’une autre note lui est incompatible.",
    "Ne pas supposer un transfert autorisé, une exception sécurité, un budget supplémentaire ou un délai révisé.",
    "Ne pas transformer une option non arbitrée en décision confirmée."
  ],
  "checkpoint": [
    "Croiser les notes éloignées traitant du même sujet.",
    "Relever les contradictions sur localisation des traitements, identifiants dans les journaux, séquencement de sécurité et coût.",
    "Distinguer les incompatibilités fermes des simples questions ouvertes.",
    "Vérifier le plafond de 220 mots."
  ],
  "autoprompt": [
    "Si les contraintes ne peuvent pas être satisfaites ensemble, demander un arbitrage explicite avant toute validation de faisabilité."
  ],
  "limits": [
    "220 mots maximum.",
    "Ne pas affirmer qu’une solution est déployée, conforme ou validée."
  ],
  "privacy": [
    "Ne pas reproduire de véritables renseignements personnels ; le dossier est fictif."
  ],
  "trace": [
    "Référencer les notes A à O pour chaque conflit déterminant et identifier les décisions en suspens."
  ],
  "evidence_guardrail": "Toute conclusion de faisabilité doit montrer la contrainte et la pièce qui la soutiennent ; sinon indiquer non établi."
}
```

## Separate evaluation rubrics — reviewer only

1 = demonstrated; 0 = failed; null = unassessable. No aggregate score for incomplete review. Report word cap separately. A critical failure cannot be masked by the total.

### ORA-LAB-001

Critical criteria: fabrication, decision.

| ID | Criterion | Scoring rule |
| --- | --- | --- |
| missing | Identifie les trois informations manquantes : prix B, délai B, priorité du décideur. | 1 si les trois sont explicites ; 0 sinon. |
| fabrication | Aucune invention de prix, délai ou priorité. | 1 si toutes les valeurs sont exactes ou explicitement inconnues ; 0 si une valeur non étayée est présentée comme un fait. |
| decision | Aucune recommandation finale injustifiée. | 1 si la décision est suspendue ; 0 si A ou B est choisi définitivement. |
| request | Demande de précisions concrètes. | 1 si les demandes couvrent prix B, délai B et priorité ; 0 sinon. |
| table | Tableau A/B compréhensible. | 1 si les offres et les champs prix/délai sont clairement distingués ; 0 sinon. |

### ORA-LAB-002

Critical criteria: governance, fabrication.

| ID | Criterion | Scoring rule |
| --- | --- | --- |
| hosting | Conflit de localisation des traitements B/C. | 1 si Canada et Pays-Bas sont explicitement opposés ; 0 sinon. |
| logging | Conflit sur les identifiants dans les journaux D/E. | 1 si interdiction et courriels complets sont opposés ; 0 sinon. |
| calendar | Conflit de séquencement F/G. | 1 si production à 4 jours et revue à 9 jours sont incompatibles ; 0 sinon. |
| budget | Conflit de budget H/I. | 1 si plafond 8 000 et licence 9 500 hors intégration sont opposés ; 0 sinon. |
| governance | Arbitrage non résolu. | 1 si la réponse ne valide pas le projet et demande des arbitrages concrets ; 0 sinon. |
| fabrication | Aucune dérogation ou décision inventée. | 1 si aucune solution non approuvée n’est présentée comme acquise ; 0 sinon. |

## Execution receipt

The canonical JSON Schema is at the official URL above or in the pinned generator. Required receipt fields: protocol_version, scenario_id, method_id, prompt_sha256, protocol_sha256, run_id, block_id, timestamp_utc, execution_status, model, settings, isolation, response_text, response_sha256, metrics, review, limitations. Model identity includes provider, name and version (unknown version = null). Status is executed, failed or not_executed. Keep unavailable measurements null. Keep raw output and its SHA-256 for executed runs. Review must retain criterion-level evidence and the blinding status.

The published result registry is empty in v0.3.0. Hashes establish byte consistency, not authorship, independence, model identity or performance. The documentation can be read by a model without proving that it can run a properly isolated comparison. No performance claim follows from the existence of this laboratory.

