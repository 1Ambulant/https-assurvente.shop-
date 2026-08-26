// Post-build : injecte des metadonnees (title/description/canonical/OG/
// Twitter) et des blocs JSON-LD propres a chaque route publique dans des
// copies statiques de dist/index.html, servies quand un crawler ou un
// navigateur demande directement l'URL de la page (ex: dist/urgence/index.html
// pour /urgence). N'execute jamais React : le contenu du <body> reste
// identique (SPA hydratee normalement au chargement) -- seul le <head> est
// personnalise. Zero dependance ajoutee, zero risque pour l'application.
//
// Limite assumee : ceci ne remplace pas un vrai rendu serveur du contenu
// (le <body> livre reste <div id="root"></div>). Un crawler qui n'execute
// pas JavaScript verra donc un title/description/JSON-LD corrects, mais pas
// le texte visible de la page. Voir le rapport pour la justification.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const baseHtmlPath = join(distDir, "index.html");

const SITE = "https://flashmecano.com";
const LOCAL_BUSINESS = { "@type": "LocalBusiness", name: "FlashMecano", url: `${SITE}/` };

const SERVICE_DEPANNAGE = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Depannage automobile",
  areaServed: "Dakar",
  provider: LOCAL_BUSINESS,
};

const SERVICE_PIECES = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Recherche de pieces automobiles",
  areaServed: "Dakar",
  provider: LOCAL_BUSINESS,
};

// Doit rester identique, mot pour mot, a la FAQ visible dans src/pages/APropos.jsx.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que FlashMecano ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FlashMecano est une plateforme qui aide les automobilistes a trouver un mecanicien, demander un depannage automobile et rechercher des pieces auto, avec l'aide de MyLingua.",
      },
    },
    {
      "@type": "Question",
      name: "Comment demander un depannage automobile ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depuis la page d'accueil, cliquez sur « J'ai besoin d'un depannage », decrivez votre probleme avec vos propres mots a MyLingua, puis choisissez le mecanicien qui vous convient parmi les propositions recues.",
      },
    },
    {
      "@type": "Question",
      name: "Comment rechercher une piece automobile ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cliquez sur « Je cherche une piece » depuis la page d'accueil, indiquez la piece recherchee a MyLingua, puis consultez les propositions de vendeurs disponibles.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne l'assistant MyLingua ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MyLingua est l'assistant de FlashMecano : decrivez votre probleme avec vos propres mots, a l'ecrit ou a l'oral via le microphone, et il vous aide a trouver la solution adaptee.",
      },
    },
    {
      "@type": "Question",
      name: "FlashMecano est-il disponible au Senegal ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FlashMecano est actuellement disponible a Dakar, avec une extension prevue vers d'autres villes du Senegal.",
      },
    },
  ],
};

const pages = [
  {
    path: "/",
    title: "FlashMecano Sénégal | Mécanicien et pièces auto",
    description:
      "FlashMecano aide les automobilistes à Dakar à trouver un mécanicien, demander un dépannage automobile et rechercher des pièces auto, avec l'aide de MyLingua.",
  },
  {
    path: "/urgence",
    title: "Dépannage automobile au Sénégal | FlashMecano",
    description:
      "Décrivez votre panne à MyLingua : FlashMecano vous aide à trouver un mécanicien disponible à Dakar, ou à rechercher la pièce automobile qu'il vous faut.",
    jsonLd: [SERVICE_DEPANNAGE, SERVICE_PIECES],
  },
  {
    path: "/a-propos",
    title: "Qu'est-ce que FlashMecano ? | FlashMecano",
    description:
      "FlashMecano est une plateforme qui aide les automobilistes à trouver un mécanicien, demander un dépannage automobile et rechercher des pièces auto à Dakar, Sénégal.",
    jsonLd: [SERVICE_DEPANNAGE, SERVICE_PIECES, FAQ_JSON_LD],
  },
  {
    path: "/espace-vendeur",
    title: "Devenir vendeur ou mécanicien partenaire | FlashMecano",
    description: "Rejoignez FlashMecano comme mécanicien indépendant ou vendeur de pièces auto partenaire à Dakar.",
  },
  {
    path: "/cgv",
    title: "Conditions générales de vente | FlashMecano",
    description: "Conditions générales de vente de la plateforme FlashMecano.",
  },
  {
    path: "/mentions-legales",
    title: "Mentions légales | FlashMecano",
    description:
      "Mentions légales de FlashMecano, plateforme de mise en relation pour pièces automobiles et services de mécanique au Sénégal.",
  },
  {
    path: "/confidentialite",
    title: "Politique de confidentialité | FlashMecano",
    description: "Politique de confidentialité de FlashMecano.",
  },
];

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function injectMeta(html, { path, title, description, jsonLd }) {
  const url = `${SITE}${path === "/" ? "/" : path + "/"}`;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  let out = html;
  out = out.replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`);
  out = out.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${safeDesc}" />`);
  out = out.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${url}" />`);
  out = out.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${safeTitle}" />`);
  out = out.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${safeDesc}" />`);
  out = out.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${url}" />`);
  out = out.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${safeTitle}" />`);
  out = out.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${safeDesc}" />`);

  if (jsonLd && jsonLd.length) {
    const scripts = jsonLd
      .map((obj) => `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`)
      .join("\n");
    out = out.replace("</head>", `${scripts}\n  </head>`);
  }
  return out;
}

if (!existsSync(baseHtmlPath)) {
  console.error("[prerender-seo] dist/index.html introuvable -- lancer npm run build d'abord.");
  process.exit(1);
}

const baseHtml = readFileSync(baseHtmlPath, "utf8");

for (const page of pages) {
  const html = injectMeta(baseHtml, page);
  if (page.path === "/") {
    writeFileSync(baseHtmlPath, html);
    continue;
  }
  const dir = join(distDir, page.path.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

console.log(`[prerender-seo] ${pages.length} pages : meta + JSON-LD injectes dans dist/.`);
