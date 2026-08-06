import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Wrench, MapPin, Star, Phone, Package, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { isDark } = useTheme();
  const [pieces, setPieces] = useState([]);
  const [mecanos, setMecanos] = useState([]);

  useEffect(() => {
    setPieces([
      { id: 1, nom: "Demarreur Peugeot 308", prix: 45000 },
      { id: 2, nom: "Alternateur Toyota Corolla", prix: 38000 },
      { id: 3, nom: "Embrayage Renault Clio 4", prix: 62000 },
      { id: 4, nom: "Courroie Distribution", prix: 25000 },
    ]);
    setMecanos([
      { id: 1, nom: "Amadou Garage", note: 4.8, distance: "2.3 km", specialite: "Moteur" },
      { id: 2, nom: "MecaPro Dakar", note: 4.6, distance: "5.1 km", specialite: "Electricite" },
      { id: 3, nom: "AutoFix Medina", note: 4.9, distance: "1.2 km", specialite: "Toutes marques" },
    ]);
  }, []);

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";

  const whatsappInscriptionLink = "https://wa.me/221778610660?text=Bonjour%20FlashMecano%2C%20je%20souhaite%20m'inscrire%20comme%20vendeur%20de%20pieces%20ou%20mecanicien%20partenaire.";

  return (
    <div className="pb-6">
      {/* Hero */}
      <section className={`${isDark ? "bg-gradient-to-b from-blue-900 to-gray-950" : "bg-gradient-to-b from-blue-600 to-blue-800"} text-white px-4 pt-8 pb-10`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Votre mecano en 30 minutes</h1>
          <p className="text-blue-100 mb-6 text-sm">Pieces d'occasion + Main d'oeuvre a domicile</p>
          <div className="flex justify-center gap-2 mb-6">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Rapide</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Garanti</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Transparent</span>
          </div>
          <Link to="/urgence">
            <button className="w-full bg-orange-500 hover:bg-orange-400 text-white p-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all mb-3">
              Intervention d'urgence
            </button>
          </Link>
        </div>
      </section>

      {/* Inscription vendeur — Bien visible */}
      <section className="px-4 py-4">
        <a href={whatsappInscriptionLink} target="_blank" rel="noopener noreferrer" className="block">
          <div className={`${isDark ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200"} border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all`}>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>S'inscrire par WhatsApp</h3>
              <p className={`text-xs ${mutedText} mt-0.5`}>Vendeur de pieces ou mecanicien ? Rejoignez FlashMecano en 2 minutes.</p>
            </div>
            <span className={`text-xs font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>→</span>
          </div>
        </a>
      </section>

      {/* Pieces populaires */}
      <section className="px-4 py-2">
        <h2 className={`text-lg font-bold mb-4 ${sectionTitle}`}>Pieces populaires</h2>
        <div className="grid grid-cols-2 gap-3">
          {pieces.map((p) => (
            <div key={p.id} className={`${cardBg} border rounded-2xl p-3`}>
              <div className={`w-full h-24 ${isDark ? "bg-gray-800" : "bg-gray-100"} rounded-xl mb-2 flex items-center justify-center`}>
                <Package size={28} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1 leading-tight">{p.nom}</h3>
              <p className="text-orange-500 font-bold text-sm">{p.prix.toLocaleString()} FCFA</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mecanos disponibles */}
      <section className="px-4 py-4">
        <h2 className={`text-lg font-bold mb-4 ${sectionTitle}`}>Mecanos disponibles</h2>
        <div className="space-y-3">
          {mecanos.map((m) => (
            <div key={m.id} className={`${cardBg} border rounded-2xl p-4 flex items-center gap-3`}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Wrench size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{m.nom}</h3>
                <p className={`text-xs ${mutedText} mt-0.5`}>{m.specialite}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{m.note}</span>
                  <span className="text-gray-300">|</span>
                  <MapPin size={12} />
                  <span>{m.distance}</span>
                </div>
              </div>
              <button className={`${isDark ? "bg-gray-800" : "bg-gray-100"} p-2.5 rounded-full shrink-0`}>
                <Phone size={16} className="text-green-500" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer page */}
      <footer className={`mt-8 py-6 text-center text-xs ${mutedText}`}>
        <p className="mb-1">FlashMecano — Dakar, Senegal</p>
        <p>+221 77 861 06 60</p>
        <div className="flex justify-center gap-3 mt-3">
          <Link to="/login" className="hover:underline">Espace Vendeur</Link>
          <span>|</span>
          <span className="hover:underline">CGV</span>
          <span>|</span>
          <span className="hover:underline">Mentions legales</span>
        </div>
      </footer>
    </div>
  );
}
