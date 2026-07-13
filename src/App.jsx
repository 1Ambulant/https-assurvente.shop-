import React, { useState } from "react";
import {
  Zap,
  ShoppingCart,
  ShieldCheck,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Send,
  Lock,
  CheckCircle2,
  Wallet,
  Navigation,
  Bell,
  Settings,
  Users,
  Wrench,
  Package,
  LayoutDashboard,
  Eye,
  EyeOff,
  Star,
  Clock,
  Car,
  Bike,
  Filter,
  MessageCircle,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";

/* =========================================================================
   FLASHMECANO — Marketplace de dépannage & pièces détachées (Sénégal)
   Fichier unique React + Tailwind. Navigation gérée en interne via useState.
   ========================================================================= */

/* -------------------------------------------------------------------------
   DONNÉES STATIQUES (mock data — à remplacer par des appels API réels)
   ------------------------------------------------------------------------- */

const CATEGORY_TREE = [
  {
    id: "auto",
    label: "Auto",
    icon: Car,
    children: [
      {
        id: "auto-moteur",
        label: "Moteur",
        children: ["Filtres", "Courroies", "Joint moteur", "Bougies", "Turbo"],
      },
      {
        id: "auto-freinage",
        label: "Freinage",
        children: ["Plaquettes", "Disques", "Étriers", "Liquide de frein"],
      },
      {
        id: "auto-electricite",
        label: "Électricité",
        children: ["Batteries", "Alternateurs", "Démarreurs", "Fusibles"],
      },
      {
        id: "auto-suspension",
        label: "Suspension",
        children: ["Amortisseurs", "Rotules", "Silent-blocs", "Ressorts"],
      },
      {
        id: "auto-carrosserie",
        label: "Carrosserie",
        children: ["Pare-chocs", "Rétroviseurs", "Optiques", "Pare-brise"],
      },
    ],
  },
  {
    id: "moto",
    label: "Moto",
    icon: Bike,
    children: [
      {
        id: "moto-moteur",
        label: "Moteur",
        children: ["Carburateur", "Chaîne", "Pignons", "Bougies"],
      },
      {
        id: "moto-freinage",
        label: "Freinage",
        children: ["Plaquettes", "Disques", "Câbles de frein"],
      },
      {
        id: "moto-pneus",
        label: "Pneumatiques",
        children: ["Pneus avant", "Pneus arrière", "Chambres à air"],
      },
      {
        id: "moto-electricite",
        label: "Électricité",
        children: ["Batteries", "Bobines", "Phares"],
      },
    ],
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Kit Plaquettes Avant (Hilux 15-23)",
    price: 18000,
    badge: "NEUF",
    badgeColor: "bg-emerald-500",
    rating: 4.8,
    img: "🛡️",
  },
  {
    id: 2,
    name: "Batterie 70Ah (Polo 6)",
    price: 25000,
    badge: "OCCASION",
    badgeColor: "bg-yellow-500",
    rating: 4.3,
    img: "🔋",
  },
  {
    id: 3,
    name: "Alternateur (Mercedes ML)",
    price: 45000,
    badge: "RECONDITIONNÉ",
    badgeColor: "bg-sky-500",
    rating: 4.6,
    img: "⚙️",
  },
  {
    id: 4,
    name: "Amortisseur AR (Duster)",
    price: 32000,
    badge: "NEUF",
    badgeColor: "bg-emerald-500",
    rating: 4.9,
    img: "🔧",
  },
];

const MECHANICS_OFFERS = [
  { id: 1, name: "Moussa D.", rating: 4.9, eta: "8 min", price: 12000 },
  { id: 2, name: "Ibrahima F.", rating: 4.7, eta: "12 min", price: 10000 },
  { id: 3, name: "Cheikh T.", rating: 4.8, eta: "15 min", price: 9500 },
];

const ADMIN_USERS = [
  {
    id: 1,
    name: "Vous (Super Admin)",
    role: "SUPER ADMIN",
    roleColor: "bg-violet-500",
    access: "Total",
    editable: false,
  },
  {
    id: 2,
    name: "Moussa Diallo",
    role: "ADMIN",
    roleColor: "bg-sky-500",
    access: "Limité",
    editable: true,
    permissions: {
      interventions: true,
      pieces: true,
      settings: false,
      roles: false,
    },
  },
];

const fmtFCFA = (n) => `${n.toLocaleString("fr-FR")} FCFA`;

/* -------------------------------------------------------------------------
   COMPOSANT RACINE
   ------------------------------------------------------------------------- */

export default function FlashMecanoApp() {
  // Navigation principale : "app" (mobile) ou "admin" (dashboard web)
  const [appMode, setAppMode] = useState("app");

  return appMode === "admin" ? (
    <AdminBackOffice onExitAdmin={() => setAppMode("app")} />
  ) : (
    <MobileApp onEnterAdmin={() => setAppMode("admin")} />
  );
}

/* =========================================================================
   BLOC MOBILE — Landing, Urgence, Chat, Séquestre, Suivi GPS
   ========================================================================= */

function MobileApp({ onEnterAdmin }) {
  const [currentView, setCurrentView] = useState("landing");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount] = useState(2);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  const goTo = (view) => {
    setDrawerOpen(false);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-slate-950 text-white relative shadow-2xl shadow-black/50 overflow-hidden">
        {/* Barre urgence flottante persistante (sauf sur la landing où elle est le hero) */}
        {currentView !== "landing" && currentView !== "auth" && (
          <UrgencyFAB onClick={() => goTo("chat")} />
        )}

        <div className="transition-opacity duration-300 ease-in-out">
          {currentView === "landing" && (
            <LandingView
              cartCount={cartCount}
              onOpenDrawer={() => setDrawerOpen(true)}
              onUrgence={() => goTo("auth")}
              onEnterAdmin={onEnterAdmin}
              onGoChat={() => goTo("chat")}
            />
          )}
          {currentView === "auth" && (
            <AuthView onValidated={() => goTo("chat")} onBack={() => goTo("landing")} />
          )}
          {currentView === "chat" && (
            <ChatBiddingView
              onBack={() => goTo("landing")}
              onAccept={(mech) => {
                setSelectedMechanic(mech);
                goTo("escrow");
              }}
            />
          )}
          {currentView === "escrow" && (
            <EscrowView
              mechanic={selectedMechanic}
              onBack={() => goTo("chat")}
              onPaid={() => goTo("tracking")}
            />
          )}
          {currentView === "tracking" && (
            <TrackingView mechanic={selectedMechanic} onBack={() => goTo("landing")} />
          )}
        </div>

        <CategoryDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}

function UrgencyFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 bottom-5 right-5 max-w-[430px] bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-3 flex items-center gap-2 shadow-lg shadow-black/50 transition-colors"
    >
      <AlertTriangle size={18} />
      <span className="text-sm font-semibold">Urgence</span>
    </button>
  );
}

/* ---------------------------- VUE 1 : LANDING --------------------------- */

function LandingView({ cartCount, onOpenDrawer, onUrgence, onEnterAdmin, onGoChat }) {
  const [search, setSearch] = useState("");

  return (
    <div className="pb-10">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-slate-950/95 backdrop-blur z-20 border-b border-slate-900">
        <div className="flex items-center gap-1.5 text-lg font-bold">
          <span>FlashMecano</span>
          <Zap className="text-orange-500 fill-orange-500" size={20} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEnterAdmin}
            className="text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            Admin
          </button>
          <button className="relative">
            <ShoppingCart size={22} className="text-slate-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-8 pb-6">
        <h1 className="text-3xl font-extrabold leading-tight">
          En panne ?
        </h1>
        <p className="text-slate-400 mt-1 text-base">
          Dépanné en <span className="text-orange-500 font-semibold">15 min.</span>
        </p>
        <button
          onClick={onUrgence}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all text-white font-bold py-3.5 rounded-xl shadow-lg shadow-black/50 flex items-center justify-center gap-2"
        >
          🚨 Intervention d'urgence
        </button>
      </div>

      {/* Recherche */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-3">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par pièce ou véhicule (ex: Alternateur Hilux)"
            className="bg-transparent outline-none text-sm placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* Bouton Filtre */}
      <div className="px-4 mb-6">
        <button
          onClick={onOpenDrawer}
          className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Filter size={16} className="text-sky-500" />
            Filtrer par catégorie
          </span>
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Grille produits */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          Pièces populaires
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Bande confiance */}
      <div className="px-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <ShieldCheck size={22} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-slate-400">
            Paiement sécurisé par séquestre. Vous ne payez que si vous êtes satisfait.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg shadow-black/50 hover:border-slate-700 transition-colors">
      <div className="relative bg-slate-800 rounded-lg h-24 flex items-center justify-center text-4xl mb-2">
        {product.img}
        <span
          className={`absolute top-1.5 left-1.5 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}
        >
          {product.badge}
        </span>
      </div>
      <p className="text-xs font-medium leading-snug line-clamp-2 min-h-[2rem]">
        {product.name}
      </p>
      <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
        <Star size={11} className="fill-yellow-500 text-yellow-500" />
        {product.rating}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-orange-500">
          {fmtFCFA(product.price)}
        </span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="px-4 mt-8 pt-6 border-t border-slate-900">
      <div className="flex items-center gap-1.5 text-base font-bold mb-2">
        <span>FlashMecano</span>
        <Zap className="text-orange-500 fill-orange-500" size={16} />
      </div>
      <p className="text-xs text-slate-500">© 2026 FlashMecano</p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <MapPin size={12} /> Dakar, Sénégal (Modifiable via Admin)
      </p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <Phone size={12} /> +221 77 000 00 00 (Modifiable via Admin)
      </p>
      <div className="flex gap-4 mt-3 text-[11px] text-sky-500">
        <button className="hover:underline">CGV</button>
        <button className="hover:underline">Mentions légales</button>
        <button className="hover:underline">Confidentialité</button>
      </div>
    </div>
  );
}

/* ------------------------ DRAWER FILTRE CATÉGORIES ----------------------- */

function CategoryDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Panneau */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-slate-900 z-40 shadow-lg shadow-black/50 transition-transform duration-300 ease-in-out overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 sticky top-0 bg-slate-900">
          <h3 className="font-bold text-sm">Filtrer par catégorie</h3>
          <button onClick={onClose}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-3">
          {CATEGORY_TREE.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} className="mb-2">
                <button
                  onClick={() => toggle(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <Icon size={17} className="text-orange-500" />
                    {cat.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform ${
                      expanded[cat.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded[cat.id] && (
                  <div className="pl-4 mt-1 space-y-1">
                    {cat.children.map((sub) => (
                      <div key={sub.id}>
                        <button
                          onClick={() => toggle(sub.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                            <Wrench size={13} className="text-sky-500" />
                            {sub.label}
                          </span>
                          <ChevronDown
                            size={13}
                            className={`text-slate-600 transition-transform ${
                              expanded[sub.id] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expanded[sub.id] && (
                          <div className="pl-8 py-1 flex flex-wrap gap-1.5">
                            {sub.children.map((item) => (
                              <button
                                key={item}
                                onClick={onClose}
                                className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full hover:bg-slate-700 transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---------------------- VUE 2 : AUTH WHATSAPP/TELEGRAM -------------------- */

function AuthView({ onValidated, onBack }) {
  const [step, setStep] = useState("choice"); // choice | code
  const [code, setCode] = useState(["", "", "", ""]);
  const [channel, setChannel] = useState(null);

  const handleChannelSelect = (ch) => {
    setChannel(ch);
    setStep("code");
  };

  const codeComplete = code.every((c) => c.length === 1);

  return (
    <div className="px-4 pt-6 pb-10 min-h-screen flex flex-col">
      <button onClick={onBack} className="text-slate-400 text-sm mb-6">
        ← Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">
          <AlertTriangle className="text-orange-500" size={30} />
        </div>
        <h2 className="text-xl font-bold mb-2">Confirmez votre urgence</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-[280px]">
          Pour vous mettre en relation instantanément avec un mécanicien, validez votre identité.
        </p>

        {step === "choice" && (
          <div className="w-full space-y-3">
            <button
              onClick={() => handleChannelSelect("whatsapp")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              <MessageCircle size={18} /> Continuer avec WhatsApp
            </button>
            <button
              onClick={() => handleChannelSelect("telegram")}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              <Send size={18} /> Continuer avec Telegram
            </button>
          </div>
        )}

        {step === "code" && (
          <div className="w-full">
            <p className="text-xs text-slate-500 mb-4">
              Code envoyé via {channel === "whatsapp" ? "WhatsApp" : "Telegram"}
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {code.map((c, i) => (
                <input
                  key={i}
                  value={c}
                  onChange={(e) => {
                    const v = e.target.value.slice(-1);
                    const next = [...code];
                    next[i] = v;
                    setCode(next);
                  }}
                  maxLength={1}
                  className="w-12 h-14 text-center text-lg font-bold bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-orange-500"
                />
              ))}
            </div>
            <button
              disabled={!codeComplete}
              onClick={onValidated}
              className="w-full bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Valider et lancer la recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------- VUE 3 : CHAT LINGUA + FLASH-BIDDING ---------------- */

function ChatBiddingView({ onBack, onAccept }) {
  const [messages] = useState([
    { from: "system", text: "Recherche de mécaniciens disponibles autour de vous…" },
    { from: "system", text: "3 mécaniciens ont répondu à votre demande." },
  ]);

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-900 sticky top-0 bg-slate-950 z-10">
        <button onClick={onBack} className="text-slate-400">
          ←
        </button>
        <div>
          <p className="font-semibold text-sm">Chat Lingua</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Traduction auto activée
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className="bg-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 max-w-[85%]"
          >
            {m.text}
          </div>
        ))}

        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap size={13} className="text-orange-500" /> Flash-Bidding — Offres en direct
          </p>
          <div className="space-y-2">
            {MECHANICS_OFFERS.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="fill-yellow-500 text-yellow-500" />
                      {m.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {m.eta}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-500 mb-1">
                    {fmtFCFA(m.price)}
                  </p>
                  <button
                    onClick={() => onAccept(m)}
                    className="text-[11px] bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-full transition-colors"
                  >
                    Accepter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2.5">
          <input
            placeholder="Écrire un message…"
            className="bg-transparent outline-none text-xs placeholder:text-slate-500 flex-1"
          />
          <Send size={16} className="text-sky-500" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------- VUE 4 : SÉQUESTRE PAIEMENT --------------------- */

function EscrowView({ mechanic, onBack, onPaid }) {
  const [method, setMethod] = useState("wave");
  const [processing, setProcessing] = useState(false);

  const methods = [
    { id: "wave", label: "Wave", color: "border-sky-500" },
    { id: "om", label: "Orange Money", color: "border-orange-500" },
    { id: "intouch", label: "Intouch", color: "border-emerald-500" },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaid();
    }, 1200);
  };

  return (
    <div className="px-4 pt-6 pb-10 min-h-screen">
      <button onClick={onBack} className="text-slate-400 text-sm mb-6">
        ← Retour
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Lock size={18} className="text-emerald-500" />
        <h2 className="text-lg font-bold">Paiement sécurisé (séquestre)</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        Vos fonds sont bloqués jusqu'à confirmation de l'intervention par vos soins.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">Mécanicien</span>
          <span className="font-semibold">{mechanic?.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">Délai estimé</span>
          <span className="font-semibold">{mechanic?.eta}</span>
        </div>
        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
          <span className="text-slate-400">Montant total</span>
          <span className="font-bold text-orange-500">
            {fmtFCFA(mechanic?.price || 0)}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-400 mb-2">
        Choisir un moyen de paiement
      </p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`bg-slate-900 border-2 rounded-xl py-3 text-xs font-semibold transition-colors ${
              method === m.id ? m.color : "border-slate-800 text-slate-400"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-black/50 transition-colors"
      >
        {processing ? (
          "Traitement en cours…"
        ) : (
          <>
            <ShieldCheck size={18} /> Payer {fmtFCFA(mechanic?.price || 0)} en séquestre
          </>
        )}
      </button>

      <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500">
        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
        Remboursement automatique si le mécanicien ne se présente pas.
      </div>
    </div>
  );
}

/* ------------------------- VUE 5 : SUIVI GPS & SPLIT ----------------------- */

function TrackingView({ mechanic, onBack }) {
  const total = mechanic?.price || 12000;
  const platformFee = Math.round(total * 0.15);
  const mechanicShare = total - platformFee;

  return (
    <div className="px-4 pt-6 pb-10 min-h-screen">
      <button onClick={onBack} className="text-slate-400 text-sm mb-6">
        ← Accueil
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
        <Navigation className="text-sky-500 animate-pulse" size={32} />
        <span className="absolute bottom-3 left-3 text-[11px] bg-slate-950/80 px-2 py-1 rounded-full text-slate-300">
          Position en direct
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm">{mechanic?.name}</p>
            <p className="text-[11px] text-slate-400">En route vers vous</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-500 font-semibold px-2.5 py-1 rounded-full">
            Arrivée {mechanic?.eta}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 py-2 rounded-lg text-xs font-medium">
            <Phone size={13} /> Appeler
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 py-2 rounded-lg text-xs font-medium">
            <MessageCircle size={13} /> Message
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
          <Wallet size={14} className="text-emerald-500" /> Répartition du paiement (Split Payment)
        </p>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">Mécanicien</span>
          <span className="font-semibold">{fmtFCFA(mechanicShare)}</span>
        </div>
        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
          <span className="text-slate-400">Commission FlashMecano (15%)</span>
          <span className="font-semibold text-slate-300">{fmtFCFA(platformFee)}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VUE 6 — BACK-OFFICE ADMINISTRATION (Dashboard Web)
   ========================================================================= */

function AdminBackOffice({ onExitAdmin }) {
  const [adminView, setAdminView] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "interventions", label: "Interventions", icon: Wrench },
    { id: "pieces", label: "Pièces", icon: Package },
    { id: "settings", label: "Paramètres du site", icon: Settings },
    { id: "roles", label: "Rôles & Permissions", icon: Users },
  ];

  return (
    <div className="w-full h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-2">
          <Zap className="text-orange-500 fill-orange-500" size={22} />
          <span className="font-bold text-sm">FlashMecano Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = adminView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onExitAdmin}
            className="w-full text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors"
          >
            ← Retour à l'application mobile
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-6">
          <div>
            <p className="text-sm text-slate-400">Bienvenue,</p>
            <p className="font-semibold text-sm">Administrateur</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={19} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-xs font-bold">
              SA
            </div>
          </div>
        </div>

        {/* Vue dynamique */}
        <div className="flex-1 overflow-y-auto p-6">
          {adminView === "dashboard" && <AdminDashboardHome />}
          {adminView === "interventions" && <AdminInterventions />}
          {adminView === "pieces" && <AdminPieces />}
          {adminView === "settings" && <AdminSettings />}
          {adminView === "roles" && <AdminRoles />}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- A. Tableau de bord --------------------------- */

function AdminDashboardHome() {
  const stats = [
    { label: "Interventions du jour", value: "24", color: "text-orange-500" },
    { label: "Revenus (aujourd'hui)", value: fmtFCFA(384000), color: "text-emerald-500" },
    { label: "Mécaniciens en ligne", value: "17", color: "text-sky-500" },
    { label: "Commandes pièces", value: "9", color: "text-white" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Tableau de bord</h1>
      <p className="text-sm text-slate-400 mb-6">Vue d'ensemble de l'activité FlashMecano</p>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/50"
          >
            <p className="text-xs text-slate-400 mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminInterventions() {
  const rows = [
    { id: "#FM-1042", client: "Awa Sow", mecano: "Moussa D.", statut: "En cours", montant: 12000 },
    { id: "#FM-1041", client: "Ousmane B.", mecano: "Ibrahima F.", statut: "Terminée", montant: 9500 },
    { id: "#FM-1040", client: "Fatou N.", mecano: "Cheikh T.", statut: "Terminée", montant: 15000 },
  ];
  const statusColor = (s) =>
    s === "En cours" ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500";

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Interventions</h1>
      <p className="text-sm text-slate-400 mb-6">Suivi des dépannages en temps réel</p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Réf.</th>
              <th className="text-left px-4 py-3 font-medium">Client</th>
              <th className="text-left px-4 py-3 font-medium">Mécanicien</th>
              <th className="text-left px-4 py-3 font-medium">Statut</th>
              <th className="text-right px-4 py-3 font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-800">
                <td className="px-4 py-3 font-medium">{r.id}</td>
                <td className="px-4 py-3 text-slate-300">{r.client}</td>
                <td className="px-4 py-3 text-slate-300">{r.mecano}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(r.statut)}`}>
                    {r.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{fmtFCFA(r.montant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPieces() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Pièces</h1>
      <p className="text-sm text-slate-400 mb-6">Catalogue des pièces détachées en vente</p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Pièce</th>
              <th className="text-left px-4 py-3 font-medium">État</th>
              <th className="text-right px-4 py-3 font-medium">Prix</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-t border-slate-800">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="text-xl">{p.img}</span> {p.name}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-orange-500">
                  {fmtFCFA(p.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------- A. Paramètres du site ------------------------ */

function AdminSettings() {
  const [showKeys, setShowKeys] = useState({ wave: false, om: false, intouch: false });
  const [form, setForm] = useState({
    platformName: "FlashMecano",
    phone: "+221 77 000 00 00",
    address: "Dakar, Sénégal",
    waveKey: "wv_live_xxxxxxxxxxxx",
    omKey: "om_live_xxxxxxxxxxxx",
    intouchKey: "in_live_xxxxxxxxxxxx",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleShow = (key) =>
    setShowKeys((s) => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-1">Paramètres Généraux</h1>
      <p className="text-sm text-slate-400 mb-6">
        Ces informations sont affichées publiquement (footer, contact client).
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Nom de la plateforme
          </label>
          <input
            value={form.platformName}
            onChange={handleChange("platformName")}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Numéro de téléphone principal
          </label>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Adresse physique
          </label>
          <input
            value={form.address}
            onChange={handleChange("address")}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-3">
            Clés API — Paiements (confidentiel)
          </p>
          <div className="space-y-3">
            {[
              { key: "waveKey", label: "Clé API Wave" },
              { key: "omKey", label: "Clé API Orange Money" },
              { key: "intouchKey", label: "Clé API Intouch" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    type={showKeys[f.key.replace("Key", "")] ? "text" : "password"}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => toggleShow(f.key.replace("Key", ""))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showKeys[f.key.replace("Key", "")] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Sauvegarder les modifications
          </button>
          {saved && (
            <span className="text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle2 size={14} /> Modifications enregistrées
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- B. Rôles & Permissions ------------------------ */

function AdminRoles() {
  const [modalUser, setModalUser] = useState(null);

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-1">Gestion des accès</h1>
      <p className="text-sm text-slate-400 mb-6">
        Contrôlez qui peut accéder à quoi dans le back-office.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Utilisateur</th>
              <th className="text-left px-4 py-3 font-medium">Rôle</th>
              <th className="text-left px-4 py-3 font-medium">Accès</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((u) => (
              <tr key={u.id} className="border-t border-slate-800">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-[10px] font-bold">
                    {u.name.split(" ")[0][0]}
                  </div>
                  {u.name}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${u.roleColor}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{u.access}</td>
                <td className="px-4 py-3 text-right">
                  {u.editable ? (
                    <button
                      onClick={() => setModalUser(u)}
                      className="text-xs text-sky-500 hover:underline font-medium"
                    >
                      Voir les permissions
                    </button>
                  ) : (
                    <span className="text-xs text-slate-600 italic">Créateur</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalUser && (
        <PermissionsModal user={modalUser} onClose={() => setModalUser(null)} />
      )}
    </div>
  );
}

function PermissionsModal({ user, onClose }) {
  const perms = [
    { key: "interventions", label: "Accès Interventions", icon: Wrench },
    { key: "pieces", label: "Accès Pièces", icon: Package },
    { key: "settings", label: "Modifier les paramètres du site", icon: Settings },
    { key: "roles", label: "Gérer les rôles", icon: Users },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-lg shadow-black/50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base">Permissions — {user.name}</h3>
          <button onClick={onClose}>
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-5 flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${user.roleColor}`} /> Rôle : {user.role}
        </p>

        <div className="space-y-3">
          {perms.map((p) => {
            const Icon = p.icon;
            const granted = user.permissions[p.key];
            const locked = p.key === "settings" || p.key === "roles";
            return (
              <div
                key={p.key}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800 ${
                  locked ? "opacity-50" : ""
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  <Icon size={15} className="text-slate-400" />
                  {p.label}
                </span>
                <input
                  type="checkbox"
                  checked={granted}
                  disabled={locked}
                  readOnly
                  className={`w-4 h-4 accent-emerald-500 ${
                    locked ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
          <BadgeCheck size={13} className="text-sky-500 shrink-0" />
          Seul le Super Admin peut modifier les paramètres du site et la gestion des rôles.
        </p>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
