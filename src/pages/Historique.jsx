import { useState } from "react";
import { Search, Phone, Star, Wrench, Package } from "lucide-react";
import api from "../lib/api";
import { useAudio } from "../hooks/useAudio";

export default function Historique() {
  const [tel, setTel] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { play } = useAudio();

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.getHistorique(tel);
      setData(res);
      play("success");
    } catch (err) { play("error"); alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800">Historique client</h2>
      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
          <input type="tel" inputMode="tel" placeholder="77 XXX XX XX"
            className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={tel} onChange={(e) => setTel(e.target.value)} required />
        </div>
        <button disabled={loading} className="bg-blue-600 text-white px-4 rounded-xl active:bg-blue-700 disabled:opacity-50"><Search size={18} /></button>
      </form>
      {data && (
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">{data.total_commandes} commande(s)</span>
            <span className="text-xs text-blue-600">{data.telephone}</span>
          </div>
          {data.historique?.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {h.type === "intervention" ? <Wrench size={14} className="text-blue-600" /> : <Package size={14} className="text-green-600" />}
                  <span className="text-xs font-bold text-gray-500 uppercase">{h.reference || h.order_id?.slice(0,8)}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  h.statut === "termine" ? "bg-green-100 text-green-700" : h.statut === "paye" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                }`}>{h.statut}</span>
              </div>
              <p className="text-sm font-bold text-gray-800 mb-1">{h.montant?.toLocaleString()} F</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {h.mecano?.nom && <span className="flex items-center gap-1"><Wrench size={10} /> {h.mecano.nom}</span>}
                {h.vendeur?.nom && <span className="flex items-center gap-1"><Package size={10} /> {h.vendeur.nom}</span>}
              </div>
              {(h.mecano_note || h.vendeur_note) && (
                <div className="flex gap-3 mt-2 pt-2 border-t border-gray-50">
                  {h.mecano_note && <span className="flex items-center gap-0.5 text-xs text-yellow-600"><Star size={10} fill="currentColor" /> {h.mecano_note}</span>}
                  {h.vendeur_note && <span className="flex items-center gap-0.5 text-xs text-yellow-600"><Star size={10} fill="currentColor" /> {h.vendeur_note}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
