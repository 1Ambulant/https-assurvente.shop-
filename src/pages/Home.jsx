import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Wrench, MapPin, Star, MessageCircle, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getPieceImage } from "../lib/pieceImages";
import { PUBLIC_SUPPORT_PHONE } from "../lib/constants";

function PieceImage({ src, alt, iconSize = 28 }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <Wrench size={iconSize} className="text-orange-500" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function MecanoPhoto({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <Wrench size={20} className="text-blue-600" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function formatPrice(n) {
  if (n === null || n === undefined) return "";
  return `${Number(n).toLocaleString("fr-FR")} FCFA`;
}

function formatReviewDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default function Home() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [mecanos, setMecanos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedMecano, setSelectedMecano] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("piece");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("actif", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error || !data) return;
        setPieces(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    supabase
      .from("mechanics")
      .select("*")
      .eq("actif", true)
      .limit(6)
      .then(({ data, error }) => {
        if (error || !data) return;
        setMecanos(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const [{ data: reviewsData, error: reviewsErr }, { data: mechData }, { data: vendData }] = await Promise.all([
          supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(3),
          supabase.from("mechanics").select("id, name"),
          supabase.from("vendors").select("id, name"),
        ]);
        if (reviewsErr || !reviewsData) return;
        const nameById = new Map();
        (mechData || []).forEach((m) => nameById.set(m.id, m.name));
        (vendData || []).forEach((v) => nameById.set(v.id, v.name));
        setReviews(reviewsData.map((r) => ({ ...r, reviewed_name: nameById.get(r.reviewed_id) || null })));
      } catch {
        // fallback silencieux
      }
    };
    loadReviews();
  }, []);

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";

  const whatsappInscriptionLink = `https://wa.me/${PUBLIC_SUPPORT_PHONE}?text=Bonjour%20FlashMecano%2C%20je%20souhaite%20m'inscrire%20comme%20vendeur%20de%20pieces%20ou%20mecanicien%20partenaire.`;

  const handleUrgence = () => navigate("/urgence", { state: { mode: "diagnostic" } });
  const handlePiece = () => navigate("/urgence", { state: { mode: "piece" } });

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
          <h1 className="text-2xl font-bold mb-3">FlashMecano — Mecaniciens &amp; Pieces auto au Senegal</h1>
          <p className="text-blue-100 mb-6 text-sm">Votre mecano en 30 minutes. Pieces d'occasion + Main d'oeuvre a domicile.</p>
          <div className="flex justify-center gap-2 mb-6">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Rapide</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Garanti</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Transparent</span>
          </div>
          <p className="font-semibold mb-3">De quoi avez-vous besoin ?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleUrgence}
              className="bg-orange-500 hover:bg-orange-400 text-white p-5 rounded-2xl shadow-lg active:scale-95 transition-all flex flex-col items-center gap-1 text-center"
            >
              <span className="text-3xl">🚨</span>
              <span className="font-bold text-lg leading-tight">J'ai besoin d'un dépannage</span>
              <span className="text-sm text-orange-50">Un mécanicien peut venir vers moi</span>
            </button>
            <button
              onClick={handlePiece}
              className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-lg active:scale-95 transition-all flex flex-col items-center gap-1 text-center"
            >
              <span className="text-3xl">🔧</span>
              <span className="font-bold text-lg leading-tight">Je cherche une pièce</span>
              <span className="text-sm text-blue-50">Je trouve la pièce qu'il me faut</span>
            </button>
          </div>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="px-4 pt-4">
        <h2 className="sr-only">Rechercher une piece ou un mecanicien</h2>
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
        <h2 className="sr-only">Devenir vendeur ou mecanicien partenaire</h2>
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
      {pieces.length > 0 && (
        <section className="px-4 py-2">
          <h2 className={`text-lg font-bold mb-4 ${sectionTitle}`}>Pieces populaires</h2>
          <div className="grid grid-cols-2 gap-3">
            {pieces.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPiece(p)}
                className={`${cardBg} border rounded-2xl p-3 text-left cursor-pointer hover:border-orange-400 hover:shadow-md active:scale-[0.97] transition-all relative`}
              >
                {p.discount > 0 && (
                  <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    -{p.discount}%
                  </span>
                )}
                <div className="w-full h-24 rounded-xl mb-2 flex items-center justify-center overflow-hidden bg-orange-50 dark:bg-orange-950/40">
                  <PieceImage src={getPieceImage(p.piece_name, p.image_url)} alt={p.piece_name} iconSize={28} />
                </div>
                <h3 className="font-semibold text-sm mb-1 leading-tight">{p.piece_name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-orange-500 font-bold text-sm">{formatPrice(p.price)}</p>
                  {p.discount > 0 && p.price_original && (
                    <p className={`text-xs line-through ${mutedText}`}>{formatPrice(p.price_original)}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Mecanos disponibles */}
      {mecanos.length > 0 && (
        <section className="px-4 py-4">
          <h2 className={`text-lg font-bold mb-4 ${sectionTitle}`}>Mecanos disponibles</h2>
          <div className="space-y-3">
            {mecanos.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMecano(m)}
                className={`${cardBg} border rounded-2xl p-4 flex items-center gap-3 w-full text-left hover:border-blue-400 hover:shadow-md active:scale-[0.98] transition-all`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                  <MecanoPhoto src={m.photo_url} alt={m.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{m.name}</h3>
                  <p className={`text-xs ${mutedText} mt-0.5`}>{m.specialty}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                    {m.neighborhood && (
                      <span className="flex items-center gap-1"><MapPin size={12} />{m.neighborhood}</span>
                    )}
                    {m.tarif_base != null && <span>{formatPrice(m.tarif_base)}/h</span>}
                    {m.zone_km_max != null && <span>Zone : {m.zone_km_max} km</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Avis clients */}
      {reviews.length > 0 && (
        <section className="px-4 py-4">
          <h2 className={`text-lg font-bold mb-4 ${sectionTitle}`}>Ils nous font confiance</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible no-scrollbar">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`${cardBg} border rounded-2xl p-4 shrink-0 w-64 sm:w-auto shadow-sm`}
              >
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < r.rating ? "text-yellow-400 fill-yellow-400" : isDark ? "text-gray-700" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className={`text-sm italic leading-relaxed mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>"{r.comment}"</p>
                <p className="text-sm text-gray-500">{r.reviewed_name || "FlashMecano"} — {formatReviewDate(r.created_at)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-orange-50 dark:bg-orange-950/40">
                <PieceImage src={getPieceImage(selectedPiece.piece_name, selectedPiece.image_url)} alt={selectedPiece.piece_name} iconSize={26} />
              </div>
              <button onClick={() => setSelectedPiece(null)} className={`p-2 rounded-full ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X size={20} />
              </button>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${sectionTitle}`}>{selectedPiece.piece_name}</h3>
            {(selectedPiece.brand || selectedPiece.vehicle_model) && (
              <p className={`text-xs mb-1 ${mutedText}`}>{[selectedPiece.brand, selectedPiece.vehicle_model].filter(Boolean).join(" — ")}</p>
            )}
            {selectedPiece.ref_oem && (
              <p className={`text-xs mb-2 ${mutedText}`}>Ref. OEM : {selectedPiece.ref_oem}</p>
            )}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-orange-500 font-bold text-xl">{formatPrice(selectedPiece.price)}</p>
              {selectedPiece.discount > 0 && selectedPiece.price_original && (
                <p className={`text-sm line-through ${mutedText}`}>{formatPrice(selectedPiece.price_original)}</p>
              )}
              {selectedPiece.discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{selectedPiece.discount}%</span>
              )}
            </div>
            {selectedPiece.vendor_name && (
              <p className={`text-xs leading-relaxed mb-5 ${mutedText}`}>Vendu par {selectedPiece.vendor_name}</p>
            )}
            <button
              onClick={() => {
                const piece = selectedPiece;
                setSelectedPiece(null);
                navigate("/urgence", { state: { mode: "piece", query: piece.piece_name } });
              }}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white p-3.5 rounded-2xl font-bold active:scale-95 transition-all"
            >
              Commander maintenant — {formatPrice(selectedPiece.price)}
            </button>
          </div>
        </div>
      )}

      {/* Modal detail mecano */}
      {selectedMecano && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => setSelectedMecano(null)}
        >
          <div
            className={`w-full max-w-md ${isDark ? "bg-gray-900" : "bg-white"} rounded-t-3xl p-5 pb-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                <MecanoPhoto src={selectedMecano.photo_url} alt={selectedMecano.name} />
              </div>
              <button onClick={() => setSelectedMecano(null)} className={`p-2 rounded-full ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X size={20} />
              </button>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${sectionTitle}`}>{selectedMecano.name}</h3>
            <p className={`text-xs mb-3 ${mutedText}`}>{selectedMecano.specialty}</p>
            <div className={`text-sm space-y-1 mb-5 ${mutedText}`}>
              {selectedMecano.neighborhood && <p className="flex items-center gap-1"><MapPin size={12} />{selectedMecano.neighborhood}</p>}
              {selectedMecano.tarif_base != null && <p>Tarif de base : {formatPrice(selectedMecano.tarif_base)}/h</p>}
              {selectedMecano.zone_km_max != null && <p>Zone d'intervention : {selectedMecano.zone_km_max} km</p>}
            </div>
            <button
              onClick={() => {
                const mecano = selectedMecano;
                setSelectedMecano(null);
                navigate("/urgence", { state: { mode: "mecano", query: mecano.name } });
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-2xl font-bold active:scale-95 transition-all"
            >
              Demander ce mecanicien via MyLingua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
