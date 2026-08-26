import { useState, useEffect } from "react";
import { Zap, ShieldCheck, Users, LogOut, Plus, Phone, Lock, Trash2, Camera } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";
import useSeo from "../lib/useSeo";
import { SEO_PAGES } from "../lib/seoConfig";
import ImageUploader from "../components/ImageUploader";

const ICONS = [Zap, ShieldCheck, Users];

// Vrai backend vendeur (verifie en direct sur le VPS de production le
// 2026-08-26) : OTP WhatsApp reel (Meta WhatsApp Business Cloud API),
// session HMAC signee, CRUD pieces et upload photo Supabase Storage --
// tout ceci existe deja et tourne, independamment de ce depot frontend.
// On rebranche Vendeur.jsx dessus au lieu de continuer a interroger
// Supabase directement depuis le navigateur pour l'authentification.
const VENDOR_API_BASE = "/api/vendor";

async function vendorApiFetch(path, opts = {}) {
  const token = localStorage.getItem("flashmecano_vendor_token");
  const res = await fetch(`${VENDOR_API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

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

const EMPTY_NEW_PIECE = { piece_name: "", brand: "", vehicle_model: "", condition: "", category: "", price: "" };

// Formulaire structure envoye par WhatsApp pour l'inscription d'un nouveau
// vendeur/mecanicien -- pas d'onboarding automatise (aucune API d'inscription
// reelle n'existe cote backend), mais un message clair et structure plutot
// qu'un texte libre a completer par l'utilisateur lui-meme dans WhatsApp.
const ROLES_NOUVEAU_VENDEUR = [
  { value: "mecanicien", label: "🔧 Mecanicien / Garage" },
  { value: "vendeur", label: "📦 Vendeur de pieces" },
];

function buildNouveauVendeurMessage(form) {
  const roleLabel = ROLES_NOUVEAU_VENDEUR.find((r) => r.value === form.role)?.label.replace(/^\S+\s/, "") || "";
  const lignes = [
    "Bonjour FlashMecano,",
    "",
    `Je souhaite rejoindre FlashMecano comme : ${roleLabel}`,
    "",
    `Nom : ${form.nom.trim()}`,
  ];
  if (form.boutique.trim()) lignes.push(`Nom du garage / boutique : ${form.boutique.trim()}`);
  lignes.push(`Telephone : ${form.telephone.trim()}`);
  lignes.push(`Ville / zone : ${form.ville.trim()}`);
  return lignes.join("\n");
}

function VendorDashboard({ vendor, onLogout, isDark, cardBg, mutedText, sectionTitle }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPiece, setNewPiece] = useState(EMPTY_NEW_PIECE);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [photoTargetId, setPhotoTargetId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    const { ok, data } = await vendorApiFetch(`/${vendor.id}/pieces`);
    setLoading(false);
    if (ok && data.success) setProducts(data.pieces);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor.id]);

  // Pas d'equivalent cote endpoint reel (PATCH /api/vendor/piece/:id ne
  // supporte pas le champ "actif") : conserve sur Supabase direct comme
  // avant, plutot que d'inventer une capacite backend qui n'existe pas.
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
    const { ok, data } = await vendorApiFetch("/piece", {
      method: "POST",
      body: JSON.stringify({
        piece_name: newPiece.piece_name.trim(),
        brand: newPiece.brand.trim() || undefined,
        vehicle_model: newPiece.vehicle_model.trim() || undefined,
        condition: newPiece.condition.trim() || undefined,
        category: newPiece.category.trim() || undefined,
        price: Number(newPiece.price),
      }),
    });
    setSaving(false);
    if (!ok || !data.success) {
      setFormError(data.message || "Impossible d'ajouter la piece. Reessayez.");
      return;
    }
    setNewPiece(EMPTY_NEW_PIECE);
    setShowAddForm(false);
    loadProducts();
  };

  const handleDeletePiece = async (pieceId) => {
    setProducts((prev) => prev.filter((p) => p.id !== pieceId));
    const { ok, data } = await vendorApiFetch(`/piece/${pieceId}`, { method: "DELETE" });
    if (!ok || !data.success) loadProducts();
  };

  const handlePhotoUploaded = async (pieceId, url) => {
    setPhotoTargetId(null);
    await vendorApiFetch(`/piece/${pieceId}`, { method: "PATCH", body: JSON.stringify({ image_url: url }) });
    loadProducts();
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
            <div key={p.id} className={`${cardBg} border rounded-xl p-3 space-y-2`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPhotoTargetId(photoTargetId === p.id ? null : p.id)}
                  className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                  title="Modifier la photo"
                >
                  {p.image_url ? <img src={p.image_url} alt={p.piece_name} className="w-full h-full object-cover" /> : <Camera size={16} className={mutedText} />}
                </button>
                <div className="min-w-0 flex-1">
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
                <button onClick={() => handleDeletePiece(p.id)} className="shrink-0 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all" title="Supprimer">
                  <Trash2 size={15} />
                </button>
              </div>
              {photoTargetId === p.id && (
                <ImageUploader className="h-28" onUpload={(url) => handlePhotoUploaded(p.id, url)} />
              )}
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
            type="text"
            placeholder="Etat (ex: occasion, reconditionne, neuf)"
            value={newPiece.condition}
            onChange={(e) => setNewPiece((f) => ({ ...f, condition: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="text"
            placeholder="Categorie (optionnel)"
            value={newPiece.category}
            onChange={(e) => setNewPiece((f) => ({ ...f, category: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <input
            type="number"
            placeholder="Prix (FCFA) *"
            value={newPiece.price}
            onChange={(e) => setNewPiece((f) => ({ ...f, price: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
          />
          <p className={`text-xs ${mutedText}`}>Vous pourrez ajouter une photo juste apres avoir enregistre la piece.</p>
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
  useSeo({ path: "/espace-vendeur", ...SEO_PAGES["/espace-vendeur"] });
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [tab, setTab] = useState("nouveau");
  const [vendor, setVendor] = useState(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loginStep, setLoginStep] = useState("phone"); // "phone" | "code"
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [newVendorForm, setNewVendorForm] = useState({ role: "mecanicien", nom: "", boutique: "", telephone: "", ville: "" });

  useEffect(() => {
    fetch("/content/vendeur.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setContent(data))
      .catch(() => setContent(FALLBACK_CONTENT));

    const stored = localStorage.getItem("flashmecano_vendor");
    const token = localStorage.getItem("flashmecano_vendor_token");
    if (stored && token) {
      try {
        setVendor(JSON.parse(stored));
        setTab("connexion");
      } catch {
        localStorage.removeItem("flashmecano_vendor");
        localStorage.removeItem("flashmecano_vendor_token");
      }
    } else if (stored && !token) {
      // Ancienne session (avant le passage a l'authentification reelle par
      // OTP WhatsApp) : aucun token signe disponible, on ne peut pas la
      // faire confiance -- on force une reconnexion propre.
      localStorage.removeItem("flashmecano_vendor");
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const sectionTitle = isDark ? "text-white" : "text-gray-900";

  // Etape 1 : demande d'un code -- vraie verification cote serveur que le
  // numero correspond a un vendeur inscrit, vrai code temporaire genere
  // cote serveur, vrai envoi automatique via l'API WhatsApp Business (Meta)
  // deja configuree sur le backend reel. Aucun lien wa.me ici.
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!phone.trim()) {
      setLoginError("Renseignez votre numero de telephone.");
      return;
    }
    setLoginLoading(true);
    const { ok, data } = await vendorApiFetch("/login-request", {
      method: "POST",
      body: JSON.stringify({ phone: phone.trim() }),
    });
    setLoginLoading(false);
    if (!ok || !data.success) {
      setLoginError(data.message || "Impossible d'envoyer le code. Reessayez.");
      return;
    }
    setLoginStep("code");
    setResendCooldown(30);
  };

  // Etape 2 : verification du code cote serveur (tentatives limitees, code
  // a usage unique, invalide apres verification -- gere entierement par le
  // backend). Cree une vraie session (token HMAC signe, pas un PIN permanent).
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!code.trim()) {
      setLoginError("Saisissez le code recu par WhatsApp.");
      return;
    }
    setLoginLoading(true);
    const { ok, data } = await vendorApiFetch("/login-verify", {
      method: "POST",
      body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
    });
    setLoginLoading(false);
    if (!ok || !data.success) {
      setLoginError(data.message || "Code incorrect.");
      return;
    }
    localStorage.setItem("flashmecano_vendor", JSON.stringify(data.vendor));
    localStorage.setItem("flashmecano_vendor_token", data.token);
    setVendor(data.vendor);
  };

  const handleLogout = () => {
    localStorage.removeItem("flashmecano_vendor");
    localStorage.removeItem("flashmecano_vendor_token");
    setVendor(null);
    setPhone("");
    setCode("");
    setLoginStep("phone");
  };

  // Fallback humain explicite si l'envoi automatique echoue (numero non
  // reconnu, message WhatsApp non recu...) -- pas un contournement d'une
  // fonctionnalite manquante, l'automatisation reelle existe desormais
  // (voir handleRequestCode). Reste une simple escalade support.
  const supportCodeLink = `https://wa.me/221789262218?text=${encodeURIComponent(
    `Bonjour FlashMecano, je n'arrive pas a recevoir mon code d'acces vendeur. Mon telephone : ${phone.trim()}`
  )}`;

  const handleNouveauVendeurSubmit = (e) => {
    e.preventDefault();
    if (!newVendorForm.nom.trim() || !newVendorForm.telephone.trim() || !newVendorForm.ville.trim()) return;
    const url = `https://wa.me/221789262218?text=${encodeURIComponent(buildNouveauVendeurMessage(newVendorForm))}`;
    window.open(url, "_blank", "noopener,noreferrer");
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

          <form onSubmit={handleNouveauVendeurSubmit} className={`${cardBg} border rounded-2xl p-4 space-y-3`}>
            <h2 className={`text-sm font-bold ${sectionTitle}`}>Je suis :</h2>
            <div className="flex gap-2">
              {ROLES_NOUVEAU_VENDEUR.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setNewVendorForm((f) => ({ ...f, role: r.value }))}
                  className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-all ${
                    newVendorForm.role === r.value ? "bg-green-600 text-white" : isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Votre nom *"
              value={newVendorForm.nom}
              onChange={(e) => setNewVendorForm((f) => ({ ...f, nom: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Nom du garage ou de la boutique (optionnel)"
              value={newVendorForm.boutique}
              onChange={(e) => setNewVendorForm((f) => ({ ...f, boutique: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
            />
            <input
              type="tel"
              inputMode="tel"
              placeholder="Telephone *"
              value={newVendorForm.telephone}
              onChange={(e) => setNewVendorForm((f) => ({ ...f, telephone: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Ville / zone *"
              value={newVendorForm.ville}
              onChange={(e) => setNewVendorForm((f) => ({ ...f, ville: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
            />
            <p className={`text-xs ${mutedText}`}>
              Ces informations seront transmises par WhatsApp a notre equipe, qui vous recontactera pour finaliser votre inscription.
            </p>
            <button
              type="submit"
              disabled={!newVendorForm.nom.trim() || !newVendorForm.telephone.trim() || !newVendorForm.ville.trim()}
              className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-900/30 disabled:opacity-50"
            >
              📱 Continuer sur WhatsApp
            </button>
          </form>
        </div>
      )}

      {tab === "connexion" && (
        vendor ? (
          <VendorDashboard vendor={vendor} onLogout={handleLogout} isDark={isDark} cardBg={cardBg} mutedText={mutedText} sectionTitle={sectionTitle} />
        ) : loginStep === "phone" ? (
          <form onSubmit={handleRequestCode} className={`${cardBg} border rounded-2xl p-4 space-y-3`}>
            <h2 className={`text-base font-bold mb-1 ${sectionTitle}`}>Bienvenue dans votre espace vendeur</h2>
            <div className="relative">
              <Phone size={16} className={`absolute left-3 top-3.5 ${mutedText}`} />
              <input
                type="tel"
                inputMode="tel"
                placeholder="Votre numero de telephone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            {loginError && <p className="text-xs text-red-500">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold disabled:opacity-50 transition-all">
              {loginLoading ? "Nous vous envoyons votre code d'acces..." : "Recevoir mon code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className={`${cardBg} border rounded-2xl p-4 space-y-3`}>
            <h2 className={`text-base font-bold mb-1 ${sectionTitle}`}>🔐 Entrez le code recu</h2>
            <p className={`text-xs ${mutedText}`}>Un code vient d'etre envoye par WhatsApp au {phone.trim()}.</p>
            <div className="relative">
              <Lock size={16} className={`absolute left-3 top-3.5 ${mutedText}`} />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                placeholder="Code recu par WhatsApp"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none tracking-widest ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            {loginError && <p className="text-xs text-red-500">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold disabled:opacity-50 transition-all">
              {loginLoading ? "Verification..." : "Accéder à mon espace"}
            </button>
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setLoginStep("phone"); setCode(""); setLoginError(""); }}
                className={`underline ${mutedText}`}
              >
                Changer de numero
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || loginLoading}
                onClick={handleRequestCode}
                className={`underline disabled:no-underline disabled:opacity-50 ${mutedText}`}
              >
                {resendCooldown > 0 ? `Renvoyer le code (${resendCooldown}s)` : "Renvoyer le code"}
              </button>
            </div>
            <a href={supportCodeLink} target="_blank" rel="noopener noreferrer" className={`block text-center text-xs underline ${mutedText}`}>
              Je ne recois pas mon code — contacter le support
            </a>
          </form>
        )
      )}
    </div>
  );
}
