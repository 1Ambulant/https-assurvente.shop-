# FlashMecano

Super-application de dépannage automobile/moto et de vente de pièces détachées au Sénégal (flashmecano.com).

## Stack

- React 18 + Vite
- Tailwind CSS (design system slate-950 / orange-500 / emerald-500 / sky-500)
- lucide-react (icônes)

## Démarrer en local

```bash
npm install
npm run dev
```

## Structure

- `src/App.jsx` — composant racine unique. Contient :
  - **Vue mobile** (max-width 430px) : Landing/Marketplace, Drawer de filtres par catégorie, Authentification WhatsApp/Telegram, Chat Lingua + Flash-Bidding, Séquestre de paiement (Wave / Orange Money / Intouch), Suivi GPS & Split Payment.
  - **Back-office Admin** (dashboard web plein écran) : Tableau de bord, Interventions, Pièces, Paramètres du site, Rôles & Permissions (RBAC).
- La navigation entre les vues se fait via `useState` (`appMode`, `currentView`, `adminView`), sans routeur.

## Backend

Un projet Supabase est prévu pour le back-office (`.env.example`). Copier `.env.example` vers `.env` et renseigner `VITE_SUPABASE_ANON_KEY` avant de brancher les appels API réels (actuellement le composant fonctionne avec des données mock).
