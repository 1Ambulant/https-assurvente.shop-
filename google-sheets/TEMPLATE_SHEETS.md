# Google Sheets — Modèle Investisseur Afrique BRVM

## Création du fichier

1. Créer un nouveau Google Sheets : **"Investisseur Afrique - BRVM"**
2. Créer 8 onglets dans l'ordre ci-dessous
3. Appliquer les couleurs suggérées pour retrouver rapidement

---

## Onglet 1 — PARAMETRES

Couleur onglet : **Gris**

| Colonne A (Paramètre) | Colonne B (Valeur) | Colonne C (Notes) |
|---|---|---|
| budget_mensuel | 50000 | FCFA pouvant être investi par mois |
| cash_disponible | 0 | FCFA disponible en compte SGI |
| risque_max_par_ligne | 15 | % max du portefeuille sur 1 action |
| devise | FCFA | Devise principale |
| SGI | CGF Bourse | Société de Gestion et d'Intermédiation choisie |
| objectif | Apprentissage + croissance long terme | |
| horizon_investissement | 3 à 5 ans minimum | |
| montant_total_investi | =SOMME(PORTEFEUILLE!H:H) | Calculé automatiquement |
| valeur_totale_actuelle | =SOMME(PORTEFEUILLE!J:J) | Calculé automatiquement |
| gain_perte_total | =B10-B9 | Calculé automatiquement |
| gain_perte_pct | =B11/B9 | Calculé automatiquement |
| cash_securite_min | 100000 | Toujours garder cette somme hors bourse |

**Règle d'or** : Ne jamais investir si `cash_disponible` ferait descendre votre épargne
de sécurité en dessous de `cash_securite_min`.

---

## Onglet 2 — WATCHLIST_BRVM

Couleur onglet : **Bleu**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | ticker | Texte | Ex: SNTS, ETIT, SGBCI |
| B | societe | Texte | Nom complet de la société |
| C | secteur | Texte | Finance, Télécom, Agriculture, Industrie... |
| D | prix_actuel | Nombre | En FCFA |
| E | variation_jour | % | Variation du jour |
| F | variation_7j | % | Variation sur 7 jours |
| G | variation_30j | % | Variation sur 30 jours |
| H | dividende_dernier | Nombre | Dernier dividende versé en FCFA/action |
| I | rendement_dividende | % | =H/D — rendement estimé |
| J | liquidite | Texte | Faible / Moyenne / Bonne |
| K | note_analyste | Texte | éviter / surveiller / intéressante / achat_progressif |
| L | commentaire | Texte | Notes libres |
| M | derniere_maj | Date | Date de dernière mise à jour |
| N | statut_agent | Texte | Statut donné par l'agent IA |

### Données de départ recommandées (actions BRVM à surveiller)

| ticker | societe | secteur |
|---|---|---|
| SNTS | Sonatel | Télécom |
| ETIT | Ecobank Transnational | Finance |
| SGBCI | Société Générale CI | Finance |
| SDCC | SDCC | Négoce |
| BICC | BICC | Finance |
| PALC | Palm CI | Agriculture |
| SIVC | SIV CI | Agriculture |
| ONTBF | ONATEL Burkina | Télécom |
| STAC | STAC | Industrie |
| BOAS | Bank of Africa Sénégal | Finance |

### Mise en forme conditionnelle suggérée

- `variation_jour` > 3% → fond vert
- `variation_jour` < -3% → fond rouge
- `note_analyste` = "éviter" → texte rouge
- `note_analyste` = "achat_progressif" → texte vert foncé

---

## Onglet 3 — PORTEFEUILLE

Couleur onglet : **Vert**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | date_achat | Date | Date réelle de l'ordre exécuté |
| B | ticker | Texte | Ticker BRVM |
| C | societe | Texte | Nom de la société |
| D | quantite | Nombre | Nombre d'actions achetées |
| E | prix_achat | Nombre | Prix unitaire en FCFA |
| F | frais | Nombre | Frais de courtage (environ 0,6% à 1,5% via SGI) |
| G | montant_investi | Formule | =D*E+F |
| H | prix_actuel | Nombre | À mettre à jour manuellement ou via n8n |
| I | valeur_actuelle | Formule | =D*H |
| J | gain_perte | Formule | =I-G |
| K | gain_perte_pct | Formule | =J/G |
| L | dividendes_recus | Nombre | Total dividendes encaissés depuis achat |
| M | rendement_total | Formule | =(J+L)/G |
| N | poids_portefeuille | Formule | =I/SOMME($I:$I) |
| O | decision | Texte | conserver / renforcer / alléger / vendre |
| P | notes | Texte | Notes personnelles |

### Règle de concentration

Formule de garde-fou dans `N` :
- Si `N > 0,15` (15%), afficher en orange
- Si `N > 0,20` (20%), afficher en rouge — risque élevé de concentration

---

## Onglet 4 — DIVIDENDES

Couleur onglet : **Jaune**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | date_annonce | Date | Date d'annonce du dividende |
| B | societe | Texte | Nom de la société |
| C | ticker | Texte | Ticker BRVM |
| D | dividende_par_action | Nombre | En FCFA |
| E | date_detachement | Date | Date de détachement du coupon |
| F | date_paiement | Date | Date de versement effectif |
| G | rendement_estime | % | =D/VLOOKUP(C,WATCHLIST!A:D,4,0) |
| H | source | Texte | URL ou nom de la source |
| I | dans_portefeuille | Formule | =SI(COUNTIF(PORTEFEUILLE!B:B,C2)>0,"Oui","Non") |
| J | dividendes_a_recevoir | Formule | =SI(I2="Oui", D2*VLOOKUP(C2,PORTEFEUILLE!B:D,3,0), 0) |

---

## Onglet 5 — JOURNAL_DECISIONS

Couleur onglet : **Violet**

Ce journal est le plus important : il trace votre apprentissage et vos émotions.

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | date | Date | Date de la réflexion |
| B | ticker | Texte | Action concernée (ou "général") |
| C | contexte | Texte long | Pourquoi j'ai regardé cette action |
| D | recommandation_agent | Texte long | Ce que l'agent IA a dit |
| E | decision_finale_humaine | Texte | acheter / ne pas acheter / attendre / vendre |
| F | montant | Nombre | Montant impliqué en FCFA |
| G | raison | Texte long | Pourquoi j'ai pris cette décision |
| H | emotion | Texte | peur / confiance / enthousiasme / neutre / incertitude |
| I | resultat_apres_30j | % | À remplir 30 jours après |
| J | lecon_apprise | Texte long | Ce que j'ai appris |

**Usage** : Remplir ce journal AVANT chaque achat potentiel.
Si vous ne pouvez pas remplir les colonnes C, G, H, c'est un signal : attendez.

---

## Onglet 6 — ALERTES

Couleur onglet : **Orange**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | date | Date | Date de l'alerte |
| B | type_alerte | Texte | baisse_forte / dividende / communique / variation_inhabituelle |
| C | ticker | Texte | Action concernée |
| D | message | Texte long | Description de l'alerte |
| E | niveau_risque | Texte | faible / moyen / élevé |
| F | action_recommandee | Texte | analyser / surveiller / ignorer |
| G | statut | Texte | nouvelle / lue / traitée / ignorée |
| H | source | Texte | Source de l'information |

### Mise en forme conditionnelle

- `niveau_risque` = "élevé" → fond rouge
- `statut` = "nouvelle" → fond orange
- `statut` = "traitée" → fond vert clair

---

## Onglet 7 — RAPPORTS_HEBDO

Couleur onglet : **Bleu foncé**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | semaine | Texte | Ex: "Semaine 23 - 2025" |
| B | date_rapport | Date | Date de génération |
| C | resume_marche | Texte long | Ce qui s'est passé sur la BRVM |
| D | meilleures_opportunites | Texte long | Actions à surveiller selon l'agent |
| E | risques_identifies | Texte long | Risques macro et sectoriels |
| F | etat_portefeuille | Texte long | Résumé de mon portefeuille |
| G | decision_recommandee | Texte | attendre / surveiller / achat_progressif_possible / eviter |
| H | actions_a_faire | Texte long | Liste des actions concrètes |
| I | note_apprentissage | Texte long | Ce que j'ai appris cette semaine |

---

## Onglet 8 — EDUCATION_BOURSE

Couleur onglet : **Rose**

### Colonnes

| # | Colonne | Type | Description |
|---|---|---|---|
| A | date | Date | Date d'apprentissage |
| B | notion | Texte | Ex: "PER", "dividende", "liquidité" |
| C | explication_simple | Texte long | Explication en français simple |
| D | exemple_BRVM | Texte long | Exemple concret avec une action BRVM |
| E | compris | Texte | oui / à revoir |
| F | source | Texte | Source de l'explication |

### Notions à apprendre en priorité

1. PER (Price Earnings Ratio)
2. Dividende et rendement
3. Capitalisation boursière
4. Liquidité d'une action
5. Diversification
6. Horizon d'investissement
7. Frais de courtage BRVM
8. Détachement de coupon
9. Ordre à cours limité vs ordre au marché
10. Analyse fondamentale vs technique

---

## Script Google Apps Script — Mise en forme automatique

Coller ce code dans **Extensions > Apps Script** puis exécuter `configurerSheets` :

```javascript
function configurerSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Figer la ligne d'en-tête sur chaque onglet
  const onglets = ['PARAMETRES','WATCHLIST_BRVM','PORTEFEUILLE',
                   'DIVIDENDES','JOURNAL_DECISIONS','ALERTES',
                   'RAPPORTS_HEBDO','EDUCATION_BOURSE'];
  onglets.forEach(nom => {
    const sheet = ss.getSheetByName(nom);
    if (sheet) sheet.setFrozenRows(1);
  });

  // Couleurs d'onglets
  const couleurs = {
    'PARAMETRES': '#9E9E9E',
    'WATCHLIST_BRVM': '#1565C0',
    'PORTEFEUILLE': '#2E7D32',
    'DIVIDENDES': '#F9A825',
    'JOURNAL_DECISIONS': '#6A1B9A',
    'ALERTES': '#E65100',
    'RAPPORTS_HEBDO': '#0D47A1',
    'EDUCATION_BOURSE': '#AD1457'
  };

  Object.entries(couleurs).forEach(([nom, couleur]) => {
    const sheet = ss.getSheetByName(nom);
    if (sheet) sheet.setTabColor(couleur);
  });

  SpreadsheetApp.getUi().alert('Configuration terminée !');
}

// Fonction appelée par n8n via Apps Script API
// pour ajouter une alerte depuis un workflow
function ajouterAlerte(ticker, type, message, niveau, action, source) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ALERTES');
  const nouvelleLigne = [
    new Date(),
    type,
    ticker,
    message,
    niveau,
    action,
    'nouvelle',
    source
  ];
  sheet.appendRow(nouvelleLigne);
}

// Fonction appelée par n8n pour mettre à jour WATCHLIST
function mettreAJourWatchlist(ticker, prixActuel, variationJour, noteAgent) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('WATCHLIST_BRVM');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ticker) {
      sheet.getRange(i + 1, 4).setValue(prixActuel);       // prix_actuel
      sheet.getRange(i + 1, 5).setValue(variationJour);    // variation_jour
      sheet.getRange(i + 1, 13).setValue(new Date());      // derniere_maj
      if (noteAgent) {
        sheet.getRange(i + 1, 14).setValue(noteAgent);     // statut_agent
      }
      return;
    }
  }
}
```

---

## Partage avec n8n

Pour que n8n puisse lire/écrire dans Sheets :

1. **Créer un compte Google Service Account** (dans Google Cloud Console)
2. **Activer Google Sheets API** sur le projet
3. **Partager le fichier Sheets** avec l'email du Service Account
4. **Dans n8n** : Credentials → Google Sheets → Service Account

Voir le guide complet dans `docs/GUIDE_DEPLOIEMENT.md`.
