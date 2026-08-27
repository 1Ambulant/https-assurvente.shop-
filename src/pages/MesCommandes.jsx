import { useState } from "react";
import { Search, Phone, CheckCircle2, Circle, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

const STEP_LABELS = [
  "Demande enregistree",
  "Offre selectionnee",
  "Paiement confirme",
  "Prise en charge",
  "En cours",
  "Terminee",
];

// Determine la progression reelle a partir des seuls champs poses par le
// pipeline P5->P9 (diagnostic_complete, p7_locked, payment_status) et par
// le cycle operationnel BLOC 4 (mission_status, ecrit uniquement par
// mission_status.py apres paiement confirme). Les etapes 4/5/6 ne sont
// cochees que si un partenaire reel a effectivement agi -- jamais
// inventees.
function getStepIndex(h) {
  if (h.mission_status === "completed") return 6;
  if (h.mission_status === "in_progress") return 5;
  if (h.mission_status === "accepted") return 4;
  if (h.payment_status === "paye") return 3;
  if (h.p7_locked) return 2;
  return 1;
}

function getStatutBadge(h) {
  if (h.mission_status === "completed") return { label: "Terminee", cls: "bg-green-100 text-green-700" };
  if (h.mission_status === "in_progress") return { label: "Intervention en cours", cls: "bg-blue-100 text-blue-700" };
  if (h.mission_status === "accepted") return { label: "Prise en charge", cls: "bg-blue-100 text-blue-700" };
  if (h.payment_status === "paye") return { label: "Paye — en attente de prise en charge", cls: "bg-green-100 text-green-700" };
  if (h.payment_status === "pending") return { label: "Paiement en attente", cls: "bg-blue-100 text-blue-700" };
  if (h.payment_status === "echec") return { label: "Paiement echoue", cls: "bg-red-100 text-red-700" };
  if (h.payment_status === "annule") return { label: "Paiement annule", cls: "bg-gray-100 text-gray-600" };
  if (h.type === "intervention" && h.partner_confirmation_status === "pending") return { label: "En attente de confirmation du mecanicien", cls: "bg-blue-100 text-blue-700" };
  if (h.type === "intervention" && h.partner_confirmation_status === "confirmed") return { label: "Mecanicien confirme — paiement a finaliser", cls: "bg-green-100 text-green-700" };
  if (h.type === "intervention" && h.partner_confirmation_status === "declined") return { label: "Le mecanicien contacte n'etait pas disponible", cls: "bg-yellow-100 text-yellow-700" };
  if (h.type === "intervention" && h.partner_confirmation_status === "no_alternative") return { label: "Aucun mecanicien disponible pour le moment", cls: "bg-red-100 text-red-700" };
  if (h.p7_locked) return { label: "Offre choisie", cls: "bg-gray-100 text-gray-600" };
  if (h.diagnostic_complete) return { label: "Diagnostic complete", cls: "bg-gray-100 text-gray-600" };
  return { label: "En cours", cls: "bg-gray-100 text-gray-600" };
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

function CommandeCard({ h, isDark, cardBg, mutedText }) {
  const currentStep = getStepIndex(h);
  const badge = getStatutBadge(h);
  const montant = h.montant ?? h.offre_selectionnee?.price ?? null;
  const date = formatDate(h.created_at);

  return (
    <div className={`${cardBg} border rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {h.type === "intervention" ? <Wrench size={14} className="text-blue-500" /> : <Package size={14} className="text-green-500" />}
          <span className={`text-xs font-bold ${mutedText} uppercase`}>{h.reference}</span>
          {date && <span className={`text-[10px] ${mutedText}`}>{date}</span>}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark && badge.cls.includes("gray-100") ? "bg-gray-800 text-gray-300" : badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {h.besoin && <p className={`text-sm mb-1 ${isDark ? "text-white" : "text-gray-800"}`}>{h.besoin}</p>}
      {h.vehicule && (h.vehicule.brand || h.vehicule.model) && (
        <p className={`text-xs mb-2 ${mutedText}`}>{[h.vehicule.brand, h.vehicule.model, h.vehicule.year].filter(Boolean).join(" ")}</p>
      )}

      {montant != null && <p className={`text-sm font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>{montant.toLocaleString()} FCFA</p>}

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

      {h.offre_selectionnee?.title && (
        <div className={`flex items-center gap-2 text-xs ${mutedText} pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          {h.type === "intervention" ? <Wrench size={10} /> : <Package size={10} />}
          {h.offre_selectionnee.title}
        </div>
      )}
    </div>
  );
}

export default function MesCommandes() {
  const { isDark } = useTheme();
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
  const enCours = commandes.filter((h) => getStepIndex(h) < 6);
  const terminees = commandes.filter((h) => getStepIndex(h) >= 6);

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

      {data && data.valid === false && (
        <p className="text-sm text-red-500">Numero invalide. Verifiez le format (ex. 77 XXX XX XX).</p>
      )}

      {data && data.valid !== false && commandes.length === 0 && (
        <div className={`${cardBg} border rounded-2xl p-6 text-center`}>
          <p className={`text-sm ${mutedText} mb-4`}>Aucune commande trouvee pour ce numero. Decrivez votre panne a MyLingua pour commencer.</p>
          <Link to="/urgence" className="inline-block bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
            Parler a MyLingua
          </Link>
        </div>
      )}

      {enCours.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${mutedText} uppercase tracking-wide`}>En cours</h3>
          {enCours.map((h) => (
            <CommandeCard key={h.mission_id} h={h} isDark={isDark} cardBg={cardBg} mutedText={mutedText} />
          ))}
        </div>
      )}

      {terminees.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${mutedText} uppercase tracking-wide`}>Terminees</h3>
          {terminees.map((h) => (
            <CommandeCard key={h.mission_id} h={h} isDark={isDark} cardBg={cardBg} mutedText={mutedText} />
          ))}
        </div>
      )}
    </div>
  );
}
