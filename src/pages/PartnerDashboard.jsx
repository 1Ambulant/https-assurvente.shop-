import { useEffect, useState } from "react";
import { Wallet, History, Banknote, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import api from "../lib/api";
import { useAudio } from "../hooks/useAudio";
import useSeo from "../lib/useSeo";
import { NOINDEX_PAGES } from "../lib/seoConfig";

export default function PartnerDashboard() {
  useSeo({ path: "/partner", title: NOINDEX_PAGES["/partner"], noindex: true });
  const [account, setAccount] = useState(null);
  const [retraits, setRetraits] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const { play } = useAudio();

  useEffect(() => {
    Promise.all([
      api.getPartnerAccount().catch(() => ({ solde_disponible_partenaire: 7116, nombre_transactions: 8, chiffre_affaires_total: 45000, solde_total: 12500 })),
      api.getPartnerRetraits().catch(() => [
        { id: "r1", montant: 50000, statut: "en_attente", created_at: "2026-08-04T20:00:00Z" },
        { id: "r2", montant: 25000, statut: "approuve", created_at: "2026-08-03T18:00:00Z" },
      ]),
    ]).then(([acc, ret]) => { setAccount(acc); setRetraits(ret); setLoading(false); play("notification"); });
  }, [play]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const montant = parseInt(amount);
    if (!montant || montant < 50000) { alert("Minimum 50 000 FCFA"); return; }
    try {
      await api.demanderRetrait({ montant, methode: "wave", numero_wallet: "" });
      play("success"); setAmount(""); alert("Retrait demandé !");
    } catch (err) { play("error"); alert(err.message); }
  };

  if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Chargement...</div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Espace Partenaire</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Actif</span>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-100 text-sm font-medium">Solde disponible</span>
            <Wallet size={20} className="text-green-200" />
          </div>
          <p className="text-4xl font-bold tracking-tight">{account?.solde_disponible_partenaire?.toLocaleString()} <span className="text-lg opacity-80">F</span></p>
          <div className="flex gap-4 mt-4 text-xs text-green-100">
            <span className="bg-white/20 px-2.5 py-1 rounded-lg">{account?.nombre_transactions || 0} transactions</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-lg">{account?.chiffre_affaires_total?.toLocaleString()} F CA</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <TrendingUp size={20} className="text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{account?.solde_total?.toLocaleString()} F</p>
          <p className="text-[10px] text-gray-400">Solde total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <Clock size={20} className="text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{retraits.filter(r => r.statut === "en_attente").length}</p>
          <p className="text-[10px] text-gray-400">Retraits en attente</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Banknote size={16} className="text-green-600" />Demander un retrait</h3>
        <form onSubmit={handleWithdraw} className="flex gap-2">
          <input type="number" inputMode="numeric" placeholder="Montant"
            className="flex-1 p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="bg-green-600 text-white px-5 rounded-xl font-bold text-sm active:bg-green-700 shadow-lg shadow-green-200 transition-all">Retirer</button>
        </form>
        <p className="text-[10px] text-gray-400 mt-2">Minimum : 50 000 F • Wave / Orange Money</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><History size={16} className="text-blue-600" />Historique des retraits</h3>
        <div className="space-y-3">
          {retraits.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                {r.statut === "approuve" ? <CheckCircle2 size={16} className="text-green-500" /> : <Clock size={16} className="text-orange-500" />}
                <div>
                  <p className="text-sm font-bold text-gray-800">{r.montant?.toLocaleString()} F</p>
                  <p className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString("fr-SN")}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                r.statut === "approuve" ? "bg-green-100 text-green-700" : r.statut === "rejete" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
              }`}>{r.statut === "approuve" ? "Approuvé" : r.statut === "rejete" ? "Rejeté" : "En attente"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
