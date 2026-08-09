import { useTheme } from "../context/ThemeContext";

export default function CGV() {
  const { isDark } = useTheme();
  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";

  const sections = [
    {
      titre: "1. FlashMecano, intermediaire de confiance",
      texte: "FlashMecano met en relation les clients avec des mecaniciens independants et des vendeurs de pieces d'occasion ou reconditionnees. FlashMecano n'est pas le vendeur ni le prestataire de service : la plateforme facilite la recherche, la comparaison et le paiement securise.",
    },
    {
      titre: "2. Devis gratuit et sans engagement",
      texte: "Le diagnostic realise par MyLingua et la recherche d'options (mecanicien + piece) sont entierement gratuits et sans engagement. Aucun paiement n'est demande avant validation de votre choix.",
    },
    {
      titre: "3. Prix en FCFA",
      texte: "Tous les prix affiches sur FlashMecano sont exprimes en Francs CFA (FCFA), toutes charges comprises (piece, main d'oeuvre, transport si applicable).",
    },
    {
      titre: "4. Garanties",
      texte: "Chaque piece beneficie de la garantie commerciale de son vendeur partenaire (generalement 3 a 6 mois selon le type de piece et la politique du vendeur). FlashMecano s'assure que chaque vendeur respecte ses obligations de garantie. Les defauts lies a une installation non realisee par un mecanicien FlashMecano agree ne sont pas couverts.",
    },
    {
      titre: "5. Paiement securise",
      texte: "Le paiement est sequestre par FlashMecano jusqu'a confirmation de la livraison de la piece et/ou de l'intervention. Les fonds sont ensuite reverses au vendeur et au mecanicien.",
    },
    {
      titre: "6. Annulation",
      texte: "Toute commande peut etre annulee gratuitement dans les 24 heures suivant le paiement, tant que la piece n'a pas ete livree ni l'intervention commencee. Au-dela, contactez le support via WhatsApp.",
    },
    {
      titre: "7. Mecaniciens independants",
      texte: "Les mecaniciens presents sur FlashMecano sont des professionnels independants, verifies par la plateforme mais non salaries de FlashMecano. Chaque intervention reste sous leur responsabilite professionnelle.",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className={`text-xl font-bold ${sectionTitle}`}>Conditions Generales de Vente</h2>
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
