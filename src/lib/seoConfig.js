// Source unique des metadonnees SEO par route -- consommee a la fois par
// useSeo() (mise a jour du <head> cote client lors de la navigation React)
// et par scripts/prerender-seo.mjs (injection statique dans dist/ apres
// npm run build), pour eviter toute duplication ou incoherence entre les deux.
//
// Seules les routes reellement publiques et indexables figurent ici.
// Les zones/delais annonces restent volontairement limites a ce que le
// produit garantit reellement (Dakar, pas de promesse de delai).

export const SITE_URL = "https://flashmecano.com";

export const SEO_PAGES = {
  "/": {
    title: "FlashMecano Sénégal | Mécanicien et pièces auto",
    description:
      "FlashMecano aide les automobilistes à Dakar à trouver un mécanicien, demander un dépannage automobile et rechercher des pièces auto, avec l'aide de MyLingua.",
  },
  "/urgence": {
    title: "Dépannage automobile au Sénégal | FlashMecano",
    description:
      "Décrivez votre panne à MyLingua : FlashMecano vous aide à trouver un mécanicien disponible à Dakar, ou à rechercher la pièce automobile qu'il vous faut.",
  },
  "/a-propos": {
    title: "Qu'est-ce que FlashMecano ? | FlashMecano",
    description:
      "FlashMecano est une plateforme qui aide les automobilistes à trouver un mécanicien, demander un dépannage automobile et rechercher des pièces auto à Dakar, Sénégal.",
  },
  "/espace-vendeur": {
    title: "Devenir vendeur ou mécanicien partenaire | FlashMecano",
    description:
      "Rejoignez FlashMecano comme mécanicien indépendant ou vendeur de pièces auto partenaire à Dakar.",
  },
  "/cgv": {
    title: "Conditions générales de vente | FlashMecano",
    description: "Conditions générales de vente de la plateforme FlashMecano.",
  },
  "/mentions-legales": {
    title: "Mentions légales | FlashMecano",
    description:
      "Mentions légales de FlashMecano, plateforme de mise en relation pour pièces automobiles et services de mécanique au Sénégal.",
  },
  "/confidentialite": {
    title: "Politique de confidentialité | FlashMecano",
    description: "Politique de confidentialité de FlashMecano.",
  },
};

// Pages volontairement exclues de l'indexation (contenu prive ou reserve a
// un utilisateur/role connecte). Le crawl reste autorise (robots.txt),
// c'est le meta "noindex" par page qui exclut ces routes des resultats --
// c'est la methode recommandee pour une SPA (bloquer via robots.txt
// empecherait Google de voir le noindex lui-meme).
export const NOINDEX_PAGES = {
  "/login": "Connexion | FlashMecano",
  "/mes-commandes": "Mes commandes | FlashMecano",
  "/admin": "Administration | FlashMecano",
  "/partner": "Espace partenaire | FlashMecano",
};
