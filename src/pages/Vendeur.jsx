import { useState, useEffect } from "react";
import { Zap, ShieldCheck, Users, MessageCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ICONS = [Zap, ShieldCheck, Users];

const FALLBACK_CONTENT = {
  title: "Devenez vendeur partenaire FlashMecano",
  subtitle: "Vendez vos pieces ou vos services de mecanique a des clients verifies, partout.",
  cta: "Rejoindre via WhatsApp",
  whatsappLink: "https://wa.me/221789262218?text=Bonjour%20FlashMecano%2C%20je%20souhaite%20devenir%20vendeur%20partenaire",
  advantages: [
    { title: "Visibilite instantanee", desc: "Vos pieces et services sont proposes directement aux clients FlashMecano des votre inscription." },
    { title: "Paiement securise sous 48h", desc: "Chaque commande est payee via sequestre FlashMecano. Vous etes payes des la livraison confirmee." },
    { title: "Clientele verifiee", desc: "Accedez a une clientele qualifiee et verifiee, partout au Senegal et bientot au-dela." },
  ],
};

export default function Vendeur() {
  const { isDark } = useTheme();
  const [content, setContent] = useState(FALLBACK_CONTENT);

  useEffect(() => {
    fetch("/content/vendeur.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setContent(data))
      .catch(() => setContent(FALLBACK_CONTENT));
  }, []);

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";

  return (
    <div className="space-y-6 animate-fade-in">
      <section className={`${isDark ? "bg-gradient-to-b from-green-900 to-gray-950" : "bg-gradient-to-b from-green-600 to-green-800"} text-white -mx-4 -mt-4 px-4 pt-8 pb-10 mb-2`}>
        <h1 className="text-2xl font-bold mb-2 text-center">{content.title}</h1>
        <p className="text-green-100 text-sm text-center">{content.subtitle}</p>
      </section>

      <div className="space-y-3">
        {content.advantages.map((a, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={a.title} className={`${cardBg} border rounded-2xl p-4 flex items-start gap-3`}>
              <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm mb-1 ${sectionTitle}`}>{a.title}</h3>
                <p className={`text-xs leading-relaxed ${mutedText}`}>{a.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <a href={content.whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
        <button className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-900/30">
          <MessageCircle size={20} />
          {content.cta}
        </button>
      </a>
    </div>
  );
}
