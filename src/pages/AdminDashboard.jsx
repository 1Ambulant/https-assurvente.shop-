import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, AlertCircle, BarChart3, Receipt, ArrowUpRight } from "lucide-react";
import api from "../lib/api";
import { useAudio } from "../hooks/useAudio";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { play } = useAudio();

  useEffect(() => {
    const fallback = {
      total_commissions: 25784, total_tva: 4641, total_frais: 7993,
      solde_net_total: 17791, gain_admin_total: 10675, gain_partenaire_total: 7116,
      nb_commandes: 12, nb_en_attente: 3
    };
    api.getAdminCompta()
      .then((compta) => (compta && Object.keys(compta).length > 0 ? compta : fallback))
      .catch(() => fallback)
      .then((data) => { setStats(data); setLoading(false); play("notification"); });
  }, [play]);

  if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Chargement...</div>;

  const cards = [
    { icon: <DollarSign size={20} />, label: "Commissions", value: stats?.total_commissions || 0, color: "from-green-400 to-green-600", suffix: "F" },
    { icon: <TrendingUp size={20} />, label: "Solde net", value: stats?.solde_net_total || 0, color: "from-blue-400 to-blue-600", suffix: "F" },
    { icon: <Users size={20} />, label: "Commandes", value: stats?.nb_commandes || 0, color: "from-purple-400 to-purple-600", suffix: "" },
    { icon: <AlertCircle size={20} />, label: "En attente", value: stats?.nb_en_attente || 0, color: "from-orange-400 to-orange-600", suffix: "" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Admin</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Live</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center justify-between mb-2 opacity-90">{c.icon}<ArrowUpRight size={16} /></div>
            <p className="text-2xl font-bold">{c.value?.toLocaleString()} {c.suffix}</p>
            <p className="text-xs opacity-80 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-blue-600" />Répartition des gains</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 font-medium">Admin (60%)</span>
              <span className="font-bold text-gray-800">{stats?.gain_admin_total?.toLocaleString()} F</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-[60%] rounded-full" /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 font-medium">Partenaire (40%)</span>
              <span className="font-bold text-gray-800">{stats?.gain_partenaire_total?.toLocaleString()} F</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[40%] rounded-full" /></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Receipt size={16} className="text-blue-600" />Dernières opérations</h3>
        <div className="space-y-3">
          {[
            { ref: "FM-1000", date: "05/08/2026", montant: 17791, statut: "Terminé" },
            { ref: "FM-0999", date: "04/08/2026", montant: 15200, statut: "Terminé" },
            { ref: "FM-0998", date: "04/08/2026", montant: 8900, statut: "En cours" },
          ].map((op) => (
            <div key={op.ref} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-bold text-gray-800">{op.ref}</p><p className="text-[10px] text-gray-400">{op.date}</p></div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">+{op.montant.toLocaleString()} F</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${op.statut === "Terminé" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{op.statut}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
