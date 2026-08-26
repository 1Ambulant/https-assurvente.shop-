import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useSeo from "../lib/useSeo";
import { SEO_PAGES } from "../lib/seoConfig";

// Contenu reel, verifie par rapport au produit (P5->P9, ChatLingua, Home) :
// aucune promesse de delai ("30 minutes"), aucune couverture nationale
// affirmee comme deja active -- uniquement Dakar, zone reellement confirmee.
const FAQ = [
  {
    q: "Qu'est-ce que FlashMecano ?",
    a: "FlashMecano est une plateforme qui aide les automobilistes a trouver un mecanicien, demander un depannage automobile et rechercher des pieces auto, avec l'aide de MyLingua.",
  },
  {
    q: "Comment demander un depannage automobile ?",
    a: "Depuis la page d'accueil, cliquez sur « J'ai besoin d'un depannage », decrivez votre probleme avec vos propres mots a MyLingua, puis choisissez le mecanicien qui vous convient parmi les propositions recues.",
  },
  {
    q: "Comment rechercher une piece automobile ?",
    a: "Cliquez sur « Je cherche une piece » depuis la page d'accueil, indiquez la piece recherchee a MyLingua, puis consultez les propositions de vendeurs disponibles.",
  },
  {
    q: "Comment fonctionne l'assistant MyLingua ?",
    a: "MyLingua est l'assistant de FlashMecano : decrivez votre probleme avec vos propres mots, a l'ecrit ou a l'oral via le microphone, et il vous aide a trouver la solution adaptee.",
  },
  {
    q: "FlashMecano est-il disponible au Senegal ?",
    a: "FlashMecano est actuellement disponible a Dakar, avec une extension prevue vers d'autres villes du Senegal.",
  },
];

export default function APropos() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  useSeo({ path: "/a-propos", ...SEO_PAGES["/a-propos"] });

  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";

  const services = [
    {
      titre: "Depannage automobile",
      texte: "Decrivez votre panne a MyLingua : FlashMecano vous met en relation avec un mecanicien disponible a Dakar pour intervenir.",
    },
    {
      titre: "Trouver un mecanicien",
      texte: "FlashMecano recense des mecaniciens independants verifies. Selon votre besoin, MyLingua vous propose les options adaptees.",
    },
    {
      titre: "Recherche de pieces auto",
      texte: "Indiquez la piece qu'il vous faut : FlashMecano vous met en relation avec des vendeurs de pieces auto disponibles.",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className={`text-xl font-bold ${sectionTitle}`}>Qu'est-ce que FlashMecano ?</h2>
      <div className={`${cardBg} border rounded-2xl p-4`}>
        <p className={`text-sm leading-relaxed ${mutedText}`}>
          FlashMecano est une plateforme qui aide les automobilistes a Dakar a trouver un mecanicien,
          demander un depannage automobile et rechercher des pieces auto, avec l'aide de MyLingua,
          l'assistant de FlashMecano.
        </p>
      </div>

      <h3 className={`text-sm font-bold mt-6 ${sectionTitle}`}>Nos services</h3>
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.titre} className={`${cardBg} border rounded-2xl p-4`}>
            <h3 className={`font-semibold text-sm mb-1.5 ${sectionTitle}`}>{s.titre}</h3>
            <p className={`text-xs leading-relaxed ${mutedText}`}>{s.texte}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => navigate("/urgence", { state: { mode: "diagnostic" } })}
          className="bg-orange-500 hover:bg-orange-400 text-white p-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
        >
          🚨 J'ai besoin d'un depannage
        </button>
        <button
          onClick={() => navigate("/urgence", { state: { mode: "piece" } })}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
        >
          🔧 Je cherche une piece
        </button>
      </div>

      <h3 className={`text-sm font-bold mt-6 ${sectionTitle}`}>Questions frequentes</h3>
      <div className="space-y-2">
        {FAQ.map((item) => (
          <details key={item.q} className={`${cardBg} border rounded-2xl p-4 group`}>
            <summary className={`font-semibold text-sm cursor-pointer ${sectionTitle}`}>{item.q}</summary>
            <p className={`text-xs leading-relaxed mt-2 ${mutedText}`}>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
