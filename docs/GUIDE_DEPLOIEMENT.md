# Guide de Déploiement — Investisseur Afrique BRVM

Déploiement MVP en 5 étapes, dans l'ordre. Durée estimée : 3 à 5 heures.

---

## Prérequis

| Outil | Coût | Lien |
|---|---|---|
| Google Sheets | Gratuit | sheets.google.com |
| n8n Cloud | ~20$/mois OU gratuit (auto-hébergé) | n8n.io |
| Telegram | Gratuit | telegram.org |
| API Claude (Anthropic) | Pay-as-you-go ~5-20$/mois | console.anthropic.com |
| Compte Google Cloud | Gratuit (API Sheets) | console.cloud.google.com |

**Total estimé : 25 à 40 USD/mois** selon usage.

---

## Étape 1 — Créer le Google Sheets

### 1.1 Créer le fichier

1. Aller sur [sheets.google.com](https://sheets.google.com)
2. Créer un nouveau fichier
3. Le nommer : **"Investisseur Afrique - BRVM"**

### 1.2 Créer les 8 onglets

Créer les onglets suivants dans l'ordre (clic droit sur l'onglet → Insérer) :
- `PARAMETRES`
- `WATCHLIST_BRVM`
- `PORTEFEUILLE`
- `DIVIDENDES`
- `JOURNAL_DECISIONS`
- `ALERTES`
- `RAPPORTS_HEBDO`
- `EDUCATION_BOURSE`

### 1.3 Remplir les en-têtes de chaque onglet

Copier exactement les noms de colonnes du fichier `google-sheets/TEMPLATE_SHEETS.md`.

**Pour PARAMETRES** (lignes, pas colonnes) :
```
Colonne A : budget_mensuel | cash_disponible | risque_max_par_ligne |
            devise | SGI | objectif | horizon_investissement |
            montant_total_investi | valeur_totale_actuelle |
            gain_perte_total | gain_perte_pct | cash_securite_min
Colonne B : Vos valeurs personnelles
Colonne C : Notes explicatives
```

**Pour WATCHLIST_BRVM** (en-têtes ligne 1) :
```
ticker | societe | secteur | prix_actuel | variation_jour | variation_7j |
variation_30j | dividende_dernier | rendement_dividende | liquidite |
note_analyste | commentaire | derniere_maj | statut_agent
```

Voir `google-sheets/TEMPLATE_SHEETS.md` pour les autres onglets.

### 1.4 Remplir vos paramètres personnels

Dans l'onglet PARAMETRES, remplir :
- `budget_mensuel` : ce que vous pouvez investir par mois (ex: 50000 FCFA)
- `cash_securite_min` : épargne de sécurité intouchable (ex: 300000 FCFA)
- `SGI` : CGF Bourse (ou votre SGI choisie)
- `risque_max_par_ligne` : 15 (15% max par action, recommandé pour débutant)

### 1.5 Remplir la WATCHLIST de départ

Ajouter au moins ces 5 actions pour commencer :

| ticker | societe | secteur |
|---|---|---|
| SNTS | Sonatel | Télécom |
| ETIT | Ecobank Transnational | Finance |
| SGBCI | Société Générale CI | Finance |
| PALC | Palm CI | Agriculture |
| ONTBF | ONATEL Burkina | Télécom |

### 1.6 Configurer le Apps Script

1. Dans Sheets : **Extensions → Apps Script**
2. Copier-coller le code de `google-sheets/TEMPLATE_SHEETS.md` (section Apps Script)
3. Cliquer **Exécuter** → sélectionner `configurerSheets`
4. Autoriser les permissions demandées
5. Les onglets prennent leurs couleurs automatiquement

### 1.7 Récupérer l'ID du fichier Sheets

L'ID est dans l'URL de votre fichier :
```
https://docs.google.com/spreadsheets/d/[CECI_EST_L_ID]/edit
```
Noter cet ID, il sera utilisé dans n8n.

---

## Étape 2 — Créer le bot Telegram

### 2.1 Créer le bot avec BotFather

1. Ouvrir Telegram
2. Chercher **@BotFather**
3. Envoyer `/newbot`
4. Suivre les instructions :
   - Nom du bot : `InvestisseurAfriqueBRVM`
   - Username : `investisseur_afrique_brvm_bot` (ou votre choix)
5. **Copier le Token API** (ressemble à : `123456789:AABcdEfghIJKlmNOpqRSTUVwxYZ`)

### 2.2 Récupérer votre Chat ID

1. Démarrer le bot en envoyant `/start`
2. Ouvrir cette URL dans votre navigateur (remplacer TOKEN) :
   ```
   https://api.telegram.org/bot[VOTRE_TOKEN]/getUpdates
   ```
3. Dans la réponse JSON, chercher `"chat":{"id":` — c'est votre Chat ID
4. Alternativement : envoyer un message à `@userinfobot` qui vous donne votre ID

### 2.3 Tester le bot

Dans votre navigateur (remplacer TOKEN et CHAT_ID) :
```
https://api.telegram.org/bot[TOKEN]/sendMessage?chat_id=[CHAT_ID]&text=Test+Investisseur+Afrique
```
Vous devriez recevoir "Test Investisseur Afrique" sur Telegram.

---

## Étape 3 — Configurer Google Cloud pour n8n

### 3.1 Créer un projet Google Cloud

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un nouveau projet : "InvestisseurAfrique"
3. Activer l'API **Google Sheets** :
   - Menu → APIs & Services → Bibliothèque
   - Chercher "Google Sheets API" → Activer

### 3.2 Créer un Service Account

1. APIs & Services → Identifiants → Créer des identifiants → Compte de service
2. Nom : `n8n-investisseur-afrique`
3. Rôle : Éditeur (ou Propriétaire pour les tests)
4. Créer et télécharger la **clé JSON** (garder ce fichier secret !)

### 3.3 Partager le Sheets avec le Service Account

1. Ouvrir votre Google Sheets
2. Cliquer **Partager** (bouton en haut à droite)
3. Coller l'email du Service Account (ressemble à : `n8n-investisseur-afrique@[projet].iam.gserviceaccount.com`)
4. Rôle : **Éditeur**
5. Envoyer

---

## Étape 4 — Configurer n8n

### 4.1 Créer un compte n8n

Option A — Cloud (plus simple) :
- Aller sur [n8n.io](https://n8n.io) → Start Free
- Plan gratuit disponible (limité) ou ~20$/mois pour le plan de base

Option B — Auto-hébergé sur VPS (moins cher long terme) :
```bash
# Sur un VPS Ubuntu (Hetzner, DigitalOcean...)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

### 4.2 Configurer les Credentials dans n8n

**Google Sheets** :
1. Settings → Credentials → New Credential
2. Sélectionner : `Google Sheets API`
3. Authentication : `Service Account`
4. Coller le contenu du fichier JSON téléchargé à l'étape 3.2

**Telegram** :
1. Settings → Credentials → New Credential
2. Sélectionner : `Telegram API`
3. Access Token : coller votre token BotFather

**Anthropic (Claude)** :
1. Aller sur [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Dans n8n : Credentials → `Anthropic` → coller la clé

### 4.3 Configurer les variables d'environnement n8n

Dans n8n Settings → Variables :

| Variable | Valeur |
|---|---|
| `SHEETS_ID` | L'ID de votre Google Sheets |
| `TELEGRAM_CHAT_ID` | Votre Chat ID Telegram |
| `TELEGRAM_BOT_TOKEN` | Token de votre bot |

### 4.4 Importer les workflows

1. Dans n8n : Workflows → Import from File
2. Importer dans cet ordre :
   - `n8n/workflow-D-agent-mentor.json` (en premier, pour tester)
   - `n8n/workflow-C-alerte-opportunite.json`
   - `n8n/workflow-A-veille-quotidienne.json`
   - `n8n/workflow-B-rapport-hebdomadaire.json`

3. Pour chaque workflow importé :
   - Ouvrir le workflow
   - Cliquer sur chaque nœud qui utilise Google Sheets → sélectionner votre credential
   - Cliquer sur chaque nœud Telegram → sélectionner votre credential
   - Cliquer sur chaque nœud Claude/Anthropic → sélectionner votre credential
   - Activer le workflow (toggle en haut à droite)

### 4.5 Tester chaque workflow manuellement

1. Ouvrir **Workflow D** (Agent Mentor)
2. Cliquer **Execute Workflow** pour déclencher manuellement
3. Envoyer `/aide` dans votre bot Telegram
4. Vérifier que vous recevez une réponse

5. Ouvrir **Workflow A** (Veille)
6. Cliquer **Execute Workflow**
7. Vérifier que vous recevez un résumé sur Telegram ET que WATCHLIST est mise à jour

---

## Étape 5 — Vérifications finales

### Checklist avant de commencer à utiliser le système

```
[ ] Google Sheets créé avec les 8 onglets
[ ] PARAMETRES remplis avec mes données personnelles
[ ] WATCHLIST avec au moins 5 actions
[ ] Apps Script configuré et exécuté
[ ] Bot Telegram créé et fonctionnel
[ ] Credentials n8n configurés (Sheets, Telegram, Claude)
[ ] Variables d'environnement n8n remplies
[ ] 4 workflows importés et activés
[ ] Test manuel du Workflow D : réponse reçue sur Telegram
[ ] Test manuel du Workflow A : résumé reçu ET Sheets mis à jour
```

### Vérification de sécurité

```
[ ] Le fichier JSON du Service Account Google est stocké de façon sécurisée
[ ] Le token Telegram est dans les credentials n8n, pas dans le code
[ ] La clé API Claude est dans les credentials n8n, pas dans le code
[ ] Le Google Sheets est partagé uniquement avec le Service Account (pas public)
```

---

## Guide d'utilisation quotidienne

### Ce que vous faites vous-même

**Chaque jour** (5 minutes) :
1. Lire le résumé BRVM reçu à 18h sur Telegram
2. Si une alerte à 19h30, lire attentivement et noter dans JOURNAL_DECISIONS
3. Mettre à jour manuellement dans WATCHLIST si vous avez des infos fiables

**Chaque semaine** (15 minutes) :
1. Lire le rapport du dimanche soir
2. Remplir une ligne dans EDUCATION_BOURSE (notion apprise)
3. Mettre à jour les prix dans PORTEFEUILLE si vous avez des positions

**Avant tout achat potentiel** :
1. Remplir le JOURNAL_DECISIONS COMPLET (contexte, recommandation agent, votre décision, raison, émotion)
2. Envoyer `/analyse [TICKER]` sur Telegram
3. Envoyer `/risque [situation]` sur Telegram
4. Attendre 48h avant de décider
5. Consulter votre SGI (CGF Bourse) pour l'exécution

### Commandes Telegram disponibles

| Commande | Usage |
|---|---|
| `/aide` | Affiche toutes les commandes |
| `/apprendre [notion]` | Ex: `/apprendre dividende` |
| `/analyse [TICKER]` | Ex: `/analyse SNTS` |
| `/risque [situation]` | Ex: `/risque j'ai 100000 FCFA à investir` |

---

## Évolution future (ne pas construire maintenant)

Quand vous serez à l'aise avec le MVP (6 à 12 mois) :

- [ ] Ajouter des sources de données BRVM plus fiables (API payante)
- [ ] Créer un tableau de bord simple (Google Looker Studio, gratuit)
- [ ] Connecter directement à l'API de votre SGI si disponible
- [ ] Application mobile légère (React Native ou PWA)
- [ ] Connexion à des données macro-économiques CEDEAO

---

## Contacts utiles

| Ressource | Informations |
|---|---|
| BRVM | [brvm.org](https://www.brvm.org) — Cotations officielles |
| CGF Bourse | [cgfbourse.com](https://www.cgfbourse.com) — SGI Sénégal |
| CREPMF | Régulateur des marchés financiers UEMOA |
| Africa Markets | [africamarkets.net](https://www.africamarkets.net) — Actualités marchés |

---

## Dépannage courant

### Le workflow n8n ne s'exécute pas

1. Vérifier que le workflow est bien **activé** (toggle vert)
2. Vérifier que les credentials sont bien configurés sur chaque nœud
3. Cliquer sur le nœud en erreur → voir le message d'erreur

### Sheets ne se met pas à jour

1. Vérifier que le Service Account a bien accès au fichier
2. Vérifier que l'ID du fichier dans les variables n8n est correct
3. Vérifier que les noms des onglets correspondent exactement (majuscules)

### Telegram ne reçoit pas de messages

1. Vérifier que le Chat ID est correct
2. Envoyer `/start` au bot depuis votre compte
3. Tester manuellement avec l'URL de test (voir Étape 2.3)

### L'agent IA donne des réponses bizarres

1. Vérifier que le System Prompt complet est bien collé
2. Réduire la temperature à 0.2 (réponses plus cohérentes)
3. Vérifier les limites de tokens (augmenter à 2000 si nécessaire)
