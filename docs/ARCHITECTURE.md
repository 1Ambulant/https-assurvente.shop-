# Architecture — Investisseur Afrique BRVM

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    SOURCES D'INFORMATION                     │
│  BRVM (brvm.org) │ Africa Markets │ Jeune Afrique │ Autres  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         n8n                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Workflow A   │  │ Workflow B   │  │   Workflow C     │  │
│  │ Veille 18h   │  │ Rapport Dim  │  │   Alertes 19h30  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│         └─────────────────┴────────────────────┘            │
│                           │                                  │
│                    ┌──────▼───────┐                          │
│                    │  Agents IA   │                          │
│                    │  (Claude)    │                          │
│                    │  Analyste    │                          │
│                    │  Risque      │                          │
│                    │  Rapport     │                          │
│                    └──────┬───────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│     Google Sheets       │    │         Telegram          │
│                         │    │                           │
│  PARAMETRES             │    │  📊 Résumé quotidien      │
│  WATCHLIST_BRVM    ◄────┤    │  📋 Rapport hebdomadaire  │
│  PORTEFEUILLE           │    │  🚨 Alertes               │
│  DIVIDENDES             │    │                           │
│  JOURNAL_DECISIONS      │    │  Commands :               │
│  ALERTES           ◄────┤    │  /apprendre [notion]      │
│  RAPPORTS_HEBDO    ◄────┤    │  /analyse [ticker]        │
│  EDUCATION_BOURSE  ◄────┘    │  /risque [question]       │
└─────────────────────────┘    └───────────┬───────────────┘
                                           │
                                           ▼ (Workflow D)
                                ┌──────────────────────┐
                                │    Agent Mentor       │
                                │    (Claude)           │
                                └──────────────────────┘
```

## Flux de données

### Flux quotidien (Workflow A, 18h)
```
Sources web → n8n scraping → Agent Analyste (Claude) →
→ Mise à jour WATCHLIST → Envoi Telegram
```

### Flux d'alerte (Workflow C, 19h30)
```
WATCHLIST + PORTEFEUILLE → Détection signaux →
→ Agent Risque (validation) → ALERTES Sheets + Telegram
```

### Flux hebdomadaire (Workflow B, dimanche 20h)
```
WATCHLIST + PORTEFEUILLE + JOURNAL + ALERTES →
→ Agent Rapport (Claude) → RAPPORTS_HEBDO + Telegram
```

### Flux à la demande (Workflow D)
```
Commande Telegram → Routage →
→ Agent Mentor / Analyste / Risque →
→ Réponse Telegram + Sauvegarde EDUCATION_BOURSE
```

## Principes de conception

### 1. Humain au centre
Le système ne décide jamais. Il informe, analyse, alerte.
Chaque recommandation se termine par "vous êtes le seul décisionnaire".

### 2. Garde-fous multiples
- Agent Risque valide toutes les alertes avant envoi
- Seuils configurables dans PARAMETRES
- Journal des décisions force la réflexion avant l'action

### 3. Traçabilité complète
- Chaque décision documentée dans JOURNAL_DECISIONS
- Chaque alerte horodatée dans ALERTES
- Chaque rapport archivé dans RAPPORTS_HEBDO

### 4. Simplicité volontaire
- Pas d'application web
- Pas d'API temps réel (données approximatives acceptées)
- Pas d'achat automatique
- Interface : Telegram + Google Sheets uniquement

## Limites connues du MVP

| Limite | Impact | Solution future |
|---|---|---|
| Données BRVM approximatives | Prix non temps réel | API BRVM payante |
| Analyse manuelle des prix | Effort utilisateur | Connexion directe BRVM |
| Pas de backtesting | Impossible de tester les stratégies | Outil dédié |
| Sources web fragiles | Peut échouer si site change | Diversifier les sources |
| Coût IA mensuel | 5-20 USD/mois | Caching, modèles moins chers |
