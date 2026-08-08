import { useTheme } from "../context/ThemeContext";

export default function MentionsLegales() {
  const { isDark } = useTheme();
  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";

  const sections = [
    {
      titre: "Editeur du site",
      texte: "FlashMecano — Plateforme de mise en relation pour pieces automobiles et services de mecanique. Base a Dakar, Senegal.",
    },
    {
      titre: "Contact",
      texte: "Telephone : +221 78 926 22 18\nAdresse : Dakar, Senegal\nSite : flashmecano.com",
    },
    {
      titre: "Hebergement",
      texte: "Le site flashmecano.com est heberge par Hostinger.",
    },
    {
      titre: "Propriete intellectuelle",
      texte: "L'ensemble des contenus presents sur FlashMecano (textes, logo, interface) est la propriete de FlashMecano, sauf mention contraire. Toute reproduction non autorisee est interdite.",
    },
    {
      titre: "Responsabilite",
      texte: "FlashMecano agit en tant qu'intermediaire entre clients, vendeurs de pieces et mecaniciens independants. FlashMecano ne saurait etre tenu responsable des interventions realisees par des tiers, meme verifies sur la plateforme.",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className={`text-xl font-bold ${sectionTitle}`}>Mentions legales</h2>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.titre} className={`${cardBg} border rounded-2xl p-4`}>
            <h3 className={`font-semibold text-sm mb-1.5 ${sectionTitle}`}>{s.titre}</h3>
            <p className={`text-xs leading-relaxed whitespace-pre-line ${mutedText}`}>{s.texte}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
