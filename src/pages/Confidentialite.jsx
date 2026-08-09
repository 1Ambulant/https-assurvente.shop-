import { useTheme } from "../context/ThemeContext";

export default function Confidentialite() {
  const { isDark } = useTheme();
  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";

  const sections = [
    {
      titre: "Donnees collectees",
      texte: "FlashMecano collecte uniquement les donnees necessaires au service : nom, numero de telephone, et informations sur votre vehicule (marque, modele, annee).",
    },
    {
      titre: "Finalite",
      texte: "Ces donnees servent exclusivement au diagnostic de votre panne via MyLingua et a la mise en relation avec un mecanicien et/ou un vendeur de pieces adapte.",
    },
    {
      titre: "Duree de conservation",
      texte: "Vos donnees sont conservees pendant 1 an maximum, sauf demande de suppression anticipee de votre part.",
    },
    {
      titre: "Vos droits",
      texte: "Vous pouvez a tout moment demander l'acces, la modification ou la suppression de vos donnees en nous contactant directement via WhatsApp au +221 78 926 22 18.",
    },
    {
      titre: "Cookies",
      texte: "FlashMecano utilise actuellement uniquement des cookies techniques necessaires au fonctionnement du site (preferences utilisateur, mode jour/nuit). A l'avenir, des cookies de mesure d'audience ou de personnalisation publicitaire pourront etre utilises dans le respect de votre consentement prealable et de la reglementation en vigueur.",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className={`text-xl font-bold ${sectionTitle}`}>Politique de confidentialite</h2>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.titre} className={`${cardBg} border rounded-2xl p-4`}>
            <h3 className={`font-semibold text-sm mb-1.5 ${sectionTitle}`}>{s.titre}</h3>
            <p className={`text-xs leading-relaxed ${mutedText}`}>{s.texte}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
