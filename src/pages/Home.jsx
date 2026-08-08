import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Wrench, MapPin, Star, Settings, MessageCircle, X, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [mecanos, setMecanos] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("piece");

  useEffect(() => {
    setPieces([
      { id: 1, nom: "Demarreur Peugeot 308", prix: 45000, description: "Demarreur reconditionne, teste et garanti. Compatible Peugeot 308 essence et diesel." },
      { id: 2, nom: "Alternateur Toyota Corolla", prix: 38000, description: "Alternateur d'occasion controle, forte capacite de charge. Compatible Toyota Corolla." },
      { id: 3, nom: "Embrayage Renault Clio 4", prix: 62000, description: "Kit d'embrayage complet (disque, mecanisme, butee) pour Renault Clio 4." },
      { id: 4, nom: "Courroie Distribution", prix: 25000, description: "Kit courroie de distribution + galets, adaptable a la plupart des vehicules courants." },
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

  const handleUrgence = () => navigate("/urgence", { state: { mode: "diagnostic" } });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate("/urgence", { state: { mode: searchMode, query: searchQuery.trim() } });
  };

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
          <button onClick={handleUrgence} className="w-full bg-orange-500 hover:bg-orange-400 text-white p-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all mb-3">
            Intervention d'urgence
          </button>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="px-4 pt-4">
        <form onSubmit={handleSearch} className={`${cardBg} border rounded-2xl p-2 shadow-lg space-y-2`}>
          <div className="flex items-center gap-2 px-2">
            <Search size={16} className={mutedText} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une piece ou un mecanicien..."
              className={`flex-1 bg-transparent text-sm outline-none py-2 ${isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
            />
          </div>
          <div className="flex items-center gap-2 px-1">
            <button
              type="button"
              onClick={() => setSearchMode("piece")}
              className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all ${
                searchMode === "piece" ? "bg-orange-500 text-white" : isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
              }`}
            >
              🔧 Piece
            </button>
            <button
              type="button"
              onClick={() => setSearchMode("mecano")}
              className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all ${
                searchMode === "mecano" ? "bg-blue-600 text-white" : isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
              }`}
            >
              🛠️ Mecano
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all"
            >
              Chercher
            </button>
          </div>
        </form>
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
            <button
              key={p.id}
              onClick={() => setSelectedPiece(p)}
              className={`${cardBg} border rounded-2xl p-3 text-left cursor-pointer hover:border-orange-400 hover:shadow-md active:scale-[0.97] transition-all`}
            >
              <div className={`w-full h-24 ${isDark ? "bg-orange-950/40" : "bg-orange-50"} rounded-xl mb-2 flex items-center justify-center`}>
                <Settings size={28} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-sm mb-1 leading-tight">{p.nom}</h3>
              <p className="text-orange-500 font-bold text-sm">{p.prix.toLocaleString()} FCFA</p>
            </button>
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
            </div>
          ))}
        </div>
      </section>

      {/* Modal detail piece */}
      {selectedPiece && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => setSelectedPiece(null)}
        >
          <div
            className={`w-full max-w-md ${isDark ? "bg-gray-900" : "bg-white"} rounded-t-3xl p-5 pb-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-orange-950/40" : "bg-orange-50"}`}>
                <Settings size={26} className="text-orange-500" />
              </div>
              <button onClick={() => setSelectedPiece(null)} className={`p-2 rounded-full ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X size={20} />
              </button>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${sectionTitle}`}>{selectedPiece.nom}</h3>
            <p className="text-orange-500 font-bold text-xl mb-3">{selectedPiece.prix.toLocaleString()} FCFA</p>
            <p className={`text-sm leading-relaxed mb-5 ${mutedText}`}>{selectedPiece.description}</p>
            <button
              onClick={() => {
                const piece = selectedPiece;
                setSelectedPiece(null);
                navigate("/urgence", { state: { mode: "piece", query: piece.nom } });
              }}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white p-3.5 rounded-2xl font-bold active:scale-95 transition-all"
            >
              Commander maintenant — {selectedPiece.prix.toLocaleString()} FCFA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
