import { useState, useEffect } from "react";
import { Zap, ShieldCheck, Users, MessageCircle, LogOut, Plus, Phone, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";

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

const EMPTY_NEW_PIECE = { piece_name: "", brand: "", vehicle_model: "", price: "", image_url: "" };

function VendorDashboard({ vendor, onLogout, isDark, cardBg, mutedText, sectionTitle }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPiece, setNewPiece] = useState(EMPTY_NEW_PIECE);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vendor.id)
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        setProducts(data);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor.id]);

  const toggleActif = async (product) => {
    const nextActif = !product.actif;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, actif: nextActif } : p)));
    try {
      await supabase.from("products").update({ actif: nextActif }).eq("id", product.id);
    } catch {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, actif: product.actif } : p)));
    }
  };

  const handleAddPiece = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!newPiece.piece_name.trim() || !newPiece.price) {
      setFormError("Nom de la piece et prix sont obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("products").insert({
        vendor_id: vendor.id,
        piece_name: newPiece.piece_name.trim(),
        brand: newPiece.brand.trim() || null,
        vehicle_model: newPiece.vehicle_model.trim() || null,
        price: Number(newPiece.price),
        image_url: newPiece.image_url.trim() || null,
        actif: true,
      });
      if (error) throw error;
      setNewPiece(EMPTY_NEW_PIECE);
      setShowAddForm(false);
      loadProducts();
    } catch {
      setFormError("Impossible d'ajouter la piece. Reessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${sectionTitle}`}>Bienvenue, {vendor.name}</h2>
        <button onClick={onLogout} className={`p-2 rounded-full ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
          <LogOut size={18} />
        </button>
      </div>

      {loading ? (
        <p className={`text-sm ${mutedText}`}>Chargement de vos pieces...</p>
      ) : products.length === 0 ? (
        <p className={`text-sm ${mutedText}`}>Vous n'avez pas encore de piece en ligne.</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className={`${cardBg} border rounded-xl p-3 flex items-center justify-between gap-2`}>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{p.piece_name}</p>
                <p className={`text-xs ${mutedText}`}>
                  {[p.brand, p.condition].filter(Boolean).join(" — ")}{p.price != null ? ` • ${Number(p.price).toLocaleString("fr-FR")} FCFA` : ""}
                </p>
              </div>
              <button
                onClick={() => toggleActif(p)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  p.actif ? "bg-green-600 text-white" : isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"
                }`}
              >
                {p.actif ? "Actif" : "Inactif"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Ajouter une piece
        </button>
      ) : (
        <form onSubmit={handleAddPiece} className={`${cardBg} border rounded-2xl p-4 space-y-3`}>
          <input
            type="text"
            placeholder="Nom de la piece *"
            value={newPiece.piece_name}
            onChange={(e) => setNewPiece((f) => ({ ...f, piece_name: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="text"
            placeholder="Marque"
            value={newPiece.brand}
            onChange={(e) => setNewPiece((f) => ({ ...f, brand: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="text"
            placeholder="Modele du vehicule"
            value={newPiece.vehicle_model}
            onChange={(e) => setNewPiece((f) => ({ ...f, vehicle_model: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="number"
            placeholder="Prix (FCFA) *"
            value={newPiece.price}
            onChange={(e) => setNewPiece((f) => ({ ...f, price: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="text"
            placeholder="URL de l'image (optionnel)"
            value={newPiece.image_url}
            onChange={(e) => setNewPiece((f) => ({ ...f, image_url: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-xl font-bold disabled:opacity-50 transition-all">
              {saving ? "Ajout..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setFormError(""); }}
              className={`px-4 rounded-xl font-semibold ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Vendeur() {
  const { isDark } = useTheme();
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [tab, setTab] = useState("nouveau");
  const [vendor, setVendor] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    fetch("/content/vendeur.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setContent(data))
      .catch(() => setContent(FALLBACK_CONTENT));

    const stored = localStorage.getItem("flashmecano_vendor");
    if (stored) {
      try {
        setVendor(JSON.parse(stored));
        setTab("connexion");
      } catch {
        localStorage.removeItem("flashmecano_vendor");
      }
    }
  }, []);

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!phone.trim() || !password.trim()) {
      setLoginError("Renseignez votre telephone et votre mot de passe.");
      return;
    }
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.from("vendors").select("*").eq("phone", phone.trim()).single();
      if (error || !data) {
        setLoginError("Numero non reconnu. Verifiez ou inscrivez-vous via WhatsApp.");
        return;
      }
      localStorage.setItem("flashmecano_vendor", JSON.stringify(data));
      setVendor(data);
    } catch {
      setLoginError("Numero non reconnu. Verifiez ou inscrivez-vous via WhatsApp.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("flashmecano_vendor");
    setVendor(null);
    setPhone("");
    setPassword("");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={`flex rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <button
          onClick={() => setTab("nouveau")}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            tab === "nouveau" ? "bg-green-600 text-white" : isDark ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"
          }`}
        >
          Nouveau vendeur
        </button>
        <button
          onClick={() => setTab("connexion")}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            tab === "connexion" ? "bg-blue-600 text-white" : isDark ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"
          }`}
        >
          Deja vendeur ? Connexion
        </button>
      </div>

      {tab === "nouveau" && (
        <div className="space-y-6">
          <section className={`${isDark ? "bg-gradient-to-b from-green-900 to-gray-950" : "bg-gradient-to-b from-green-600 to-green-800"} text-white -mx-4 px-4 pt-8 pb-10 mb-2`}>
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
      )}

      {tab === "connexion" && (
        vendor ? (
          <VendorDashboard vendor={vendor} onLogout={handleLogout} isDark={isDark} cardBg={cardBg} mutedText={mutedText} sectionTitle={sectionTitle} />
        ) : (
          <form onSubmit={handleLogin} className={`${cardBg} border rounded-2xl p-4 space-y-3`}>
            <h2 className={`text-base font-bold mb-1 ${sectionTitle}`}>Connexion vendeur</h2>
            <div className="relative">
              <Phone size={16} className={`absolute left-3 top-3.5 ${mutedText}`} />
              <input
                type="tel"
                inputMode="tel"
                placeholder="77 XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            <div className="relative">
              <Lock size={16} className={`absolute left-3 top-3.5 ${mutedText}`} />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            {loginError && <p className="text-xs text-red-500">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold disabled:opacity-50 transition-all">
              {loginLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )
      )}
    </div>
  );
}
