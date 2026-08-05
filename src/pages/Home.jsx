import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, ShoppingCart, ChevronRight, Star, MapPin, CheckCircle2, Clock, Shield } from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import ImageUploader from "../components/ImageUploader";
import api from "../lib/api";

const POPULAR_PARTS = [
  { name: "Alternateur Corolla", price: "45 000 F", condition: "Occasion", brand: "Toyota" },
  { name: "Démarreur 308", price: "38 000 F", condition: "Neuf", brand: "Peugeot" },
  { name: "Plaquettes Clio", price: "22 000 F", condition: "Occasion", brand: "Renault" },
  { name: "Batterie 60Ah", price: "35 000 F", condition: "Neuf", brand: "Varta" },
];

const MECHANICS = [
  { name: "Amadou Garage", note: 4.8, distance: "2.3 km", tarif: "15 000 F", dispo: true, img: "A" },
  { name: "Garage TATA Plateau", note: 4.5, distance: "3.1 km", tarif: "12 000 F", dispo: true, img: "T" },
  { name: "Medina Auto", note: 4.2, distance: "4.5 km", tarif: "18 000 F", dispo: false, img: "M" },
];

export default function Home() {
  const navigate = useNavigate();
  const { play } = useAudio();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [options, setOptions] = useState([]);
  const [interventionId, setInterventionId] = useState(null);
  const [form, setForm] = useState({
    telephone_client: "", marque: "", modele: "", annee: "",
    symptomes: "", latitude_client: 14.7167, longitude_client: -17.4677, adresse_client: "Dakar, Sénégal",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.creerIntervention(form);
      setInterventionId(data.intervention_id);
      play("success");
      const opts = await api.chercherOptions(data.intervention_id);
      if (opts.options?.length) { setOptions(opts.options); setStep("options"); }
      else { setStep("success"); }
    } catch (err) { play("error"); alert(err.message); }
    finally { setLoading(false); }
  };

  const chooseOption = async (quote_id) => {
    setLoading(true);
    try {
      const res = await api.choisirOption(interventionId, quote_id);
      play("success");
      alert(`Commande ${res.reference} créée ! Total: ${res.total_client} FCFA`);
      setStep("form");
      setForm({ ...form, telephone_client: "", symptomes: "" });
    } catch (err) { play("error"); alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-2 leading-tight">Votre mécano<br/>en 30 minutes</h2>
          <p className="text-blue-100 text-sm mb-4">Pièces d'occasion + Main d'œuvre à domicile</p>
          <div className="flex flex-wrap gap-2">
            {["? Rapide", "? Garanti", "?? Transparent"].map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Clock size={18} />, label: "30 min", sub: "Intervention" },
          { icon: <Shield size={18} />, label: "72h", sub: "Garantie" },
          { icon: <CheckCircle2 size={18} />, label: "4.8/5", sub: "Satisfaction" },
        ].map((b) => (
          <div key={b.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-blue-600 flex justify-center mb-1">{b.icon}</div>
            <p className="font-bold text-sm text-gray-800">{b.label}</p>
            <p className="text-[10px] text-gray-400">{b.sub}</p>
          </div>
        ))}
      </div>

      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
            <ShoppingCart size={16} className="text-blue-600" />Pièces populaires
          </h3>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer">Voir tout ?</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {POPULAR_PARTS.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform">
              <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <Wrench size={36} className="text-gray-300" />
                <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{p.condition}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-500">{p.brand}</p>
                <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                <p className="text-blue-600 font-bold text-sm mt-1">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
            <Wrench size={16} className="text-blue-600" />Mécanos disponibles
          </h3>
        </div>
        <div className="space-y-3">
          {MECHANICS.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-lg">{m.img}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-gray-800 truncate">{m.name}</p>
                  {m.dispo && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-0.5 text-yellow-500 font-bold"><Star size={11} fill="currentColor" /> {m.note}</span>
                  <span className="flex items-center gap-0.5"><MapPin size={11} /> {m.distance}</span>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-sm flex-shrink-0">{m.tarif}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        {step === "form" && (
          <>
            <h3 className="font-bold text-gray-800 mb-1">Demander une intervention</h3>
            <p className="text-xs text-gray-500 mb-4">Remplissez le formulaire, nous trouvons le meilleur prix.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="tel" inputMode="tel" placeholder="Téléphone (77 XXX XX XX)"
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                value={form.telephone_client} onChange={(e) => setForm({ ...form, telephone_client: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Marque" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} required />
                <input type="text" placeholder="Modèle" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} required />
              </div>
              <input type="number" inputMode="numeric" placeholder="Année (ex: 2018)" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                value={form.annee} onChange={(e) => setForm({ ...form, annee: e.target.value })} />
              <textarea placeholder="Décrivez les symptômes..." rows={3} className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                value={form.symptomes} onChange={(e) => setForm({ ...form, symptomes: e.target.value })} required />
              <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all">
                {loading ? "Recherche..." : <>Obtenir un devis <ChevronRight size={18} /></>}
              </button>
            </form>
          </>
        )}
        {step === "options" && (
          <>
            <h3 className="font-bold text-gray-800 mb-1">{options.length} options trouvées</h3>
            <p className="text-xs text-gray-500 mb-4">Choisissez la meilleure offre.</p>
            <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
              {options.map((opt) => (
                <button key={opt.quote_id} onClick={() => chooseOption(opt.quote_id)} disabled={loading}
                  className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl p-4 active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">Option {opt.option_label}</span>
                    <span className="text-blue-600 font-bold text-lg">{opt.total_client?.toLocaleString()} F</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex justify-between"><span>?? {opt.mecano_nom}</span> <span>{opt.mecano_distance_km} km</span></p>
                    <p className="flex justify-between"><span>?? {opt.vendeur_nom}</span> <span>{opt.mode_recuperation === "mecano_recupere" ? "Mécano récupère" : "Livraison"}</span></p>
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between text-gray-500">
                      <span>Pièce: {opt.prix_piece_client?.toLocaleString()} F</span>
                      <span>M.O.: {opt.prix_mecano_client?.toLocaleString()} F</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("form")} className="w-full mt-3 text-gray-500 text-sm py-2">? Retour</button>
          </>
        )}
        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Demande enregistrée !</h3>
            <p className="text-sm text-gray-500 mb-4">Notre équipe vous recontacte sous 2-4h.</p>
            <button onClick={() => setStep("form")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Nouvelle demande</button>
          </div>
        )}
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Uploader une pièce</h3>
        <p className="text-xs text-gray-500 mb-3">Test de compression auto (max 80KB)</p>
        <ImageUploader productId="demo" />
      </section>
    </div>
  );
}
