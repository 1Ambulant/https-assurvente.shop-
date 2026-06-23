# Variables d'Environnement — n8n

Toutes ces variables doivent être configurées dans n8n : **Settings → Variables**

## Variables obligatoires

| Variable | Description | Exemple |
|---|---|---|
| `SHEETS_ID` | ID de votre Google Sheets | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |
| `TELEGRAM_CHAT_ID` | Votre Chat ID Telegram | `123456789` |

## Credentials n8n (pas des variables, mais à créer)

| Credential | Type dans n8n | Données nécessaires |
|---|---|---|
| `Google Sheets` | Google Sheets API / Service Account | Fichier JSON Service Account |
| `Telegram` | Telegram API | Bot Token |
| `Anthropic` | Anthropic | Clé API Claude |

## Comment obtenir chaque valeur

### SHEETS_ID
URL de votre fichier :
`https://docs.google.com/spreadsheets/d/**[CECI]**/edit`

### TELEGRAM_CHAT_ID
1. Envoyez `/start` à votre bot
2. Ouvrez : `https://api.telegram.org/bot[TOKEN]/getUpdates`
3. Cherchez `"chat":{"id":[VOTRE_ID]`

### Clé API Anthropic
1. [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Budget recommandé : fixer une limite de 20 USD/mois

## Sécurité

- **Ne jamais** committer ces valeurs dans Git
- **Ne jamais** partager le fichier JSON du Service Account
- **Régénérer** les clés si vous suspectez une fuite
- n8n stocke ces credentials de façon chiffrée
