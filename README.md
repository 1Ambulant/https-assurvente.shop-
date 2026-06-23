# Système Investisseur Afrique — BRVM

Système personnel d'accompagnement à l'investissement boursier sur la BRVM,
conçu pour un débutant sénégalais. Priorité : apprendre, protéger le capital,
décider en conscience. Aucun achat automatique.

## Architecture

```
Google Sheets  ←→  n8n  ←→  Telegram
                    ↕
              Agents IA (Claude / ChatGPT)
```

## Composants

| Dossier | Contenu |
|---|---|
| `google-sheets/` | Guide de création du fichier Sheets + colonnes |
| `n8n/` | 4 workflows JSON prêts à importer |
| `agents/` | Prompts système des 4 agents IA |
| `docs/` | Guide de déploiement étape par étape |

## Principes non-négociables

- Pas d'achat automatique
- Pas de promesse de rendement
- Le système propose, l'humain décide
- Toujours garder du cash de sécurité
- Sources citées dans chaque rapport

## Démarrage rapide

Voir [`docs/GUIDE_DEPLOIEMENT.md`](docs/GUIDE_DEPLOIEMENT.md).
