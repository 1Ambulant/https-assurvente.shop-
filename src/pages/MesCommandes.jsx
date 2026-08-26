import { useState } from "react";
import { Search, Phone, CheckCircle2, Circle, Star, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import useSeo from "../lib/useSeo";
import { NOINDEX_PAGES } from "../lib/seoConfig";

const STEP_LABELS = [
  "Diagnostic MyLingua effectue",
  "Mecano + Piece choisis",
  "Paiement effectue",
  "Mecano en route / Intervention commencee",
  "Intervention terminee - Notation",
];

function getStepIndex(statut) {
  const s = (statut || "").toLowerCase();
  if (s.includes("termine") || s.includes("note")) return 5;
  if (s.includes("route") || s.includes("demarr") || s.includes("cours") || s.includes("livr")) return 4;
  if (s.includes("paye") || s.includes("paie")) return 3;
  if (s.includes("choisi") || s.includes("option")) return 2;
  return 1;
}

function CommandeCard({ h, isDark, cardBg, mutedText }) {
  const currentStep = getStepIndex(h.statut);
  return (
    <div className={`${cardBg} border rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {h.type === "intervention" ? <Wrench size={14} className="text-blue-500" /> : <Package size={14} className="text-green-500" />}
          <span className={`text-xs font-bold ${mutedText} uppercase`}>{h.reference || h.order_id?.slice(0, 8)}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          h.statut === "termine" ? "bg-green-100 text-green-700" : h.statut === "paye" ? "bg-blue-100 text-blue-700" : isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}>{h.statut}</span>
      </div>

      {h.montant != null && <p className={`text-sm font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>{h.montant?.toLocaleString()} FCFA</p>}

      <div className="space-y-2 mb-2">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const done = stepNum <= currentStep;
          return (
            <div key={label} className="flex items-center gap-2">
              {done ? <CheckCircle2 size={16} className="text-green-500 shrink-0" /> : <Circle size={16} className={`${mutedText} shrink-0`} />}
              <span className={`text-xs ${done ? (isDark ? "text-white" : "text-gray-800") : mutedText}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {(h.mecano?.nom || h.vendeur?.nom) && (
        <div className={`flex items-center gap-3 text-xs ${mutedText} pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          {h.mecano?.nom && <span className="flex items-center gap-1"><Wrench size={10} /> {h.mecano.nom}</span>}
          {h.vendeur?.nom && <span className="flex items-center gap-1"><Package size={10} /> {h.vendeur.nom}</span>}
        </div>
      )}

      {(h.mecano_note || h.vendeur_note) && (
        <div className={`flex gap-3 mt-2 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          {h.mecano_note && <span className="flex items-center gap-0.5 text-xs text-yellow-500"><Star size={10} fill="currentColor" /> {h.mecano_note}</span>}
          {h.vendeur_note && <span className="flex items-center gap-0.5 text-xs text-yellow-500"><Star size={10} fill="currentColor" /> {h.vendeur_note}</span>}
        </div>
      )}
    </div>
  );
}

export default function MesCommandes() {
  const { isDark } = useTheme();
  useSeo({ path: "/mes-commandes", title: NOINDEX_PAGES["/mes-commandes"], noindex: true });
  const [tel, setTel] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900";

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.getHistorique(tel);
      setData(res);
    } catch (err) {
      setError(err.message || "Erreur de recherche");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const commandes = data?.historique || [];
  const enCours = commandes.filter((h) => (h.statut || "").toLowerCase() !== "termine");
  const terminees = commandes.filter((h) => (h.statut || "").toLowerCase() === "termine");

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Mes commandes</h2>

      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Phone size={16} className={`absolute left-3 top-3.5 ${mutedText}`} />
          <input
            type="tel"
            inputMode="tel"
            placeholder="77 XXX XX XX"
            className={`w-full pl-9 pr-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${inputBg}`}
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>
        <button disabled={loading} className="bg-blue-600 text-white px-4 rounded-xl active:bg-blue-700 disabled:opacity-50">
          <Search size={18} />
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && commandes.length === 0 && (
        <div className={`${cardBg} border rounded-2xl p-6 text-center`}>
          <p className={`text-sm ${mutedText} mb-4`}>Aucune commande en cours. Decrivez votre panne a MyLingua pour commencer.</p>
          <Link to="/urgence" className="inline-block bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
            Parler a MyLingua
          </Link>
        </div>
      )}

      {enCours.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${mutedText} uppercase tracking-wide`}>En cours</h3>
          {enCours.map((h, i) => (
            <CommandeCard key={i} h={h} isDark={isDark} cardBg={cardBg} mutedText={mutedText} />
          ))}
        </div>
      )}

      {terminees.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${mutedText} uppercase tracking-wide`}>Terminees</h3>
          {terminees.map((h, i) => (
            <CommandeCard key={i} h={h} isDark={isDark} cardBg={cardBg} mutedText={mutedText} />
          ))}
        </div>
      )}
    </div>
  );
}
