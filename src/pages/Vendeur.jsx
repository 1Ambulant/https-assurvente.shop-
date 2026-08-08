import { Zap, ShieldCheck, Gift, MessageCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AVANTAGES = [
  { icon: Zap, titre: "Visibilite instantanee", desc: "Vos pieces et services sont proposes directement aux clients FlashMecano des votre inscription." },
  { icon: ShieldCheck, titre: "Paiement securise", desc: "Chaque commande est payee via sequestre FlashMecano. Vous etes payes des la livraison confirmee." },
  { icon: Gift, titre: "Zero commission 3 mois", desc: "Aucune commission prelevee sur vos 3 premiers mois de vente sur la plateforme." },
];

const whatsappLink = "https://wa.me/221789262218?text=Bonjour%20FlashMecano%2C%20je%20souhaite%20devenir%20vendeur%20partenaire";

export default function Vendeur() {
  const { isDark } = useTheme();
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";

  return (
    <div className="space-y-6 animate-fade-in">
      <section className={`${isDark ? "bg-gradient-to-b from-green-900 to-gray-950" : "bg-gradient-to-b from-green-600 to-green-800"} text-white -mx-4 -mt-4 px-4 pt-8 pb-10 mb-2`}>
        <h1 className="text-2xl font-bold mb-2 text-center">Devenez vendeur partenaire FlashMecano</h1>
        <p className="text-green-100 text-sm text-center">Vendez vos pieces ou vos services de mecanique a des clients verifies, partout a Dakar.</p>
      </section>

      <div className="space-y-3">
        {AVANTAGES.map(({ icon: Icon, titre, desc }) => (
          <div key={titre} className={`${cardBg} border rounded-2xl p-4 flex items-start gap-3`}>
            <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center shrink-0">
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h3 className={`font-semibold text-sm mb-1 ${sectionTitle}`}>{titre}</h3>
              <p className={`text-xs leading-relaxed ${mutedText}`}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
        <button className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-900/30">
          <MessageCircle size={20} />
          Rejoindre via WhatsApp
        </button>
      </a>
    </div>
  );
}
