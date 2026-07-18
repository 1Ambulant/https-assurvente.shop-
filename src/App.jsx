import React, { useState, useEffect, useRef } from "react";
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
  Car,
  Bike,
  Filter,
  MessageCircle,
  AlertTriangle,
  BadgeCheck,
  Menu,
  Loader2,
  Mic,
} from "lucide-react";
import { fetchMockLinguaResponse } from "./mockLinguaAPI";

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
        children: [
          "Filtres",
          "Courroies",
          "Joint moteur",
          "Bougies",
          "Turbo",
          "Moteurs complets",
          "Boîtes de vitesse",
          "Culasse",
        ],
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
        id: "auto-pneumatiques",
        label: "Pneumatiques",
        children: ["Pneus été", "Pneus hiver", "Pneus 4x4"],
      },
      {
        id: "auto-carrosserie",
        label: "Carrosserie & Accessoires",
        children: ["Rétroviseurs", "Phares", "Pare-chocs", "Autoradios/GPS", "Jantes"],
      },
      {
        id: "auto-echappement",
        label: "Échappement",
        children: ["Pot catalytique", "Silencieux"],
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
        id: "moto-moteurs-complets",
        label: "Moteurs moto",
        children: ["Moteur complet", "Culasse", "Carter moteur", "Vilebrequin"],
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
      {
        id: "moto-chaines",
        label: "Chaînes & Couronnes",
        children: ["Chaîne", "Couronne", "Pignon"],
      },
      {
        id: "moto-carenages",
        label: "Carénages",
        children: ["Carénage avant", "Carénage arrière", "Kit carénage complet"],
      },
    ],
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Kit Plaquettes Avant (Hilux)",
    price: 18000,
    badge: "NEUF",
    badgeColor: "bg-emerald-500",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Batterie 70Ah (Polo 6)",
    price: 25000,
    badge: "OCCASION",
    badgeColor: "bg-yellow-500",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Moteur Essence (Mercedes ML)",
    price: 1500000,
    badge: "RECONDITIONNÉ",
    badgeColor: "bg-sky-500",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Kit Chaîne Moto (Yamaha DT)",
    price: 15000,
    badge: "NEUF",
    badgeColor: "bg-emerald-500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
  },
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
    name: "Djiby Faye",
    role: "ADMIN",
    roleColor: "bg-sky-500",
    access: "Limité",
    editable: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    permissions: {
      interventions: true,
      pieces: true,
      settings: false,
      roles: false,
    },
  },
];

/* Comptes d'accès au back-office (démo). En production : auth serveur réelle. */
const ADMIN_CREDENTIALS = [
  { username: "769038712", password: "2222", userId: 1 },
  { username: "778610660", password: "1234", userId: 2 },
];

const LEGAL_CONTENT = {
  cgv: {
    title: "Conditions Générales de Vente",
    body: [
      "FlashMecano met en relation des utilisateurs avec des mécaniciens indépendants et des vendeurs de pièces détachées partenaires au Sénégal.",
      "Les prix affichés lors d'une intervention ou d'une commande de pièce sont fermes dès validation par l'utilisateur et sont bloqués en séquestre jusqu'à confirmation de la prestation.",
      "Toute anomalie constatée pendant l'intervention (panne additionnelle, pièce incompatible) doit faire l'objet d'un nouveau diagnostic via l'application avant toute facturation complémentaire.",
      "FlashMecano perçoit une commission de service sur chaque transaction, prélevée automatiquement lors du déblocage du séquestre.",
      "Tarification et Commission : Les prix affichés sur l'application sont les prix finaux pour l'utilisateur. FlashMecano perçoit une commission de service de 10% sur les pièces détachées et de 15% sur la main d'œuvre de dépannage. Cette répartition est gérée exclusivement entre FlashMecano et les prestataires partenaires (mécaniciens/vendeurs). L'utilisateur final ne sera jamais soumis à des frais cachés ou à des suppléments liés à ces commissions.",
    ],
  },
  mentions: {
    title: "Mentions Légales",
    body: [
      "FlashMecano est une plateforme de mise en relation exploitée depuis Dakar, Sénégal.",
      "Contact : +221 77 861 06 60 — Adresse : Dakar, Sénégal.",
      "Directeur de la publication : Super Admin FlashMecano.",
      "Hébergement : infrastructure cloud tierce, données hébergées conformément à la réglementation sénégalaise sur la protection des données personnelles.",
    ],
  },
  confidentialite: {
    title: "Politique de Confidentialité",
    body: [
      "Les données transmises (localisation, numéro de téléphone, description de panne) sont utilisées exclusivement pour la mise en relation avec un mécanicien ou un vendeur de pièces.",
      "Aucune donnée n'est revendue à des tiers. Les échanges de paiement transitent par nos partenaires Wave, Orange Money et Intouch, qui appliquent leurs propres politiques de sécurité.",
      "Vous pouvez demander la suppression de votre compte et de vos données à tout moment depuis l'application ou via le support.",
    ],
  },
};

const fmtFCFA = (n) => `${n.toLocaleString("fr-FR")} FCFA`;

/* -------------------------------------------------------------------------
   IMAGE AVEC REPLI GRACIEUX (photo indisponible → icône + dégradé)
   ------------------------------------------------------------------------- */

function ImgWithFallback({ src, alt, className, fallbackIcon: FallbackIcon }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-700 ${className}`}>
        <FallbackIcon className="text-slate-500" size={28} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

/* -------------------------------------------------------------------------
   COMPOSANT RACINE
   ------------------------------------------------------------------------- */

export default function FlashMecanoApp() {
  // Navigation principale : "app" (mobile) ou "admin" (dashboard web)
  const [appMode, setAppMode] = useState(
    typeof window !== "undefined" && window.location.hash === "#admin" ? "admin" : "app"
  );
  const [adminUser, setAdminUser] = useState(null);

  const enterAdmin = () => {
    if (typeof window !== "undefined") window.location.hash = "admin";
    setAppMode("admin");
  };

  const exitAdmin = () => {
    if (typeof window !== "undefined") window.location.hash = "";
    setAdminUser(null);
    setAppMode("app");
  };

  if (appMode === "admin") {
    return adminUser ? (
      <AdminBackOffice currentUser={adminUser} onExitAdmin={exitAdmin} />
    ) : (
      <AdminLoginGate onSuccess={setAdminUser} onCancel={exitAdmin} />
    );
  }

  return <MobileApp onEnterAdmin={enterAdmin} />;
}

/* -------------------------------------------------------------------------
   PORTE DE CONNEXION ADMIN (accessible via le bouton "Admin" ou l'URL #admin)
   ------------------------------------------------------------------------- */

function AdminLoginGate({ onSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = ADMIN_CREDENTIALS.find(
      (c) => c.username === username.trim() && c.password === password
    );
    if (!match) {
      setError("Identifiants incorrects.");
      return;
    }
    const user = ADMIN_USERS.find((u) => u.id === match.userId);
    setError("");
    onSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/50">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="text-orange-500 fill-orange-500" size={22} />
          <span className="font-bold text-lg">FlashMecano Admin</span>
        </div>
        <p className="text-xs text-slate-400 mb-6">Connexion au back-office</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Identifiant
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Numéro de téléphone"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500"
            />
          </div>

          {error && <p className="text-xs text-orange-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-xs text-slate-500 hover:text-slate-300 py-1 transition-colors"
          >
            ← Retour à l'application mobile
          </button>
        </form>
      </div>
    </div>
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
      <div className="w-full max-w-[430px] min-h-screen bg-slate-950 text-white relative shadow-2xl shadow-black/50 overflow-hidden transform">
        {/* `transform` établit un nouveau bloc de positionnement pour que les descendants
            en `fixed` (FAB, drawer) restent confinés à la carte mobile 430px, même sur
            un écran desktop large, au lieu de se coller aux bords de la fenêtre. */}
        {/* Barre urgence flottante persistante (sauf sur la landing où elle est le hero, et
            sur le chat où elle chevaucherait le bouton micro de la barre de saisie) */}
        {currentView !== "landing" && currentView !== "auth" && currentView !== "chat" && (
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 hover:border-slate-700 transition-colors">
      <div className="relative h-40">
        <ImgWithFallback
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded-t-xl"
          fallbackIcon={Package}
        />
        <span
          className={`absolute top-2 left-2 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-black/50`}
        >
          {product.badge}
        </span>
      </div>
      <div className="p-3">
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
    </div>
  );
}

function Footer() {
  const [legalDoc, setLegalDoc] = useState(null);

  return (
    <div className="px-4 mt-8 pt-6 border-t border-slate-900">
      <div className="flex items-center gap-1.5 text-base font-bold mb-2">
        <span>FlashMecano</span>
        <Zap className="text-orange-500 fill-orange-500" size={16} />
      </div>
      <p className="text-xs text-slate-500">© 2026 FlashMecano</p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <MapPin size={12} /> Dakar, Sénégal
      </p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <Phone size={12} /> +221 77 861 06 60
      </p>
      <div className="flex gap-4 mt-3 text-[11px] text-sky-500">
        <button onClick={() => setLegalDoc("cgv")} className="hover:underline">
          CGV
        </button>
        <button onClick={() => setLegalDoc("mentions")} className="hover:underline">
          Mentions légales
        </button>
        <button onClick={() => setLegalDoc("confidentialite")} className="hover:underline">
          Confidentialité
        </button>
      </div>

      {legalDoc && (
        <LegalModal doc={LEGAL_CONTENT[legalDoc]} onClose={() => setLegalDoc(null)} />
      )}
    </div>
  );
}

function LegalModal({ doc, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 shadow-lg shadow-black/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">{doc.title}</h3>
          <button onClick={onClose}>
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="space-y-3">
          {doc.body.map((paragraph, i) => (
            <p key={i} className="text-xs text-slate-400 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
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
  const [step, setStep] = useState("choice"); // choice | connecting
  const [channel, setChannel] = useState(null);

  const handleChannelSelect = (ch) => {
    setChannel(ch);
    setStep("connecting");
    setTimeout(onValidated, 500);
  };

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

        {step === "connecting" && (
          <div className="w-full flex flex-col items-center py-6">
            <Loader2 size={28} className="text-sky-500 animate-spin mb-4" />
            <p className="text-sm text-slate-300">Connexion…</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------- VUE 3 : CHAT LINGUA — COMPARATEUR D'URGENCE -------------- */

/* Endpoint du cerveau MyLingua. Le frontend n'a plus aucune donnée en dur :
   tout le contenu du chat (diagnostic, offres, montant à payer) provient
   de cette API. */
const LINGUA_API_URL = "/api/lingua/chat";

/* Bascule démo : tant que le vrai backend MyLingua n'est pas prêt, on sert
   les réponses depuis mockLinguaAPI.js (même contrat JSON) pour pouvoir
   tester le parcours complet (chat → paiement) sans dépendance externe. */
const USE_MOCK = false;

async function callLinguaAPI({ conversationId, message }) {
  if (USE_MOCK) {
    return fetchMockLinguaResponse({ conversationId, message });
  }

  const res = await fetch(LINGUA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });
  if (!res.ok) {
    throw new Error(`Lingua API error: ${res.status}`);
  }
  return res.json();
}

function OfferMiniCard({ title, meta, price, tag, rating }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Lock size={11} className="text-slate-500 shrink-0" />
          <p className="text-sm font-semibold truncate">{title}</p>
          {tag && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500 text-slate-950 shrink-0">
              {tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {meta}
          </span>
          {rating && (
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-yellow-500 text-yellow-500" /> {rating}
            </span>
          )}
        </div>
      </div>
      <p className="text-lg font-bold text-orange-500 shrink-0">{fmtFCFA(price)}</p>
    </div>
  );
}

function IaMessage({ children, label }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
        FM
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {label && <p className="text-xs text-slate-300 leading-relaxed">{label}</p>}
        {children}
      </div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div className="flex justify-end">
      <div className="bg-orange-500/15 border border-orange-500/30 text-slate-100 text-xs rounded-xl px-3 py-2 max-w-[85%]">
        {children}
      </div>
    </div>
  );
}

/* Traduit un message structuré renvoyé par MyLingua en composants existants.
   Un type inconnu (futur) est ignoré silencieusement plutôt que de casser le chat. */
function LinguaMessage({ message, onLockMission }) {
  switch (message.type) {
    case "text":
      return <IaMessage label={message.text} />;

    case "diagnostic":
      return (
        <IaMessage>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide mb-1">
              {message.title}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">{message.text}</p>
            {typeof message.confidence === "number" && (
              <p className="text-[11px] text-emerald-500 font-semibold mt-2">
                Diagnostic fiable à {message.confidence}%
              </p>
            )}
          </div>
        </IaMessage>
      );

    case "offer_list":
      return (
        <IaMessage label={message.label}>
          <div className="space-y-2">
            {message.offers.map((o) => (
              <OfferMiniCard
                key={o.id}
                title={o.title}
                meta={`À ${o.distance_km} km - ${o.zone}`}
                price={o.price}
                tag={o.tag}
                rating={o.rating}
              />
            ))}
          </div>
        </IaMessage>
      );

    case "payment_cta":
      return (
        <IaMessage label={message.text}>
          <button
            onClick={() => onLockMission(message)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-black/50 transition-colors"
          >
            ✅ Payer {fmtFCFA(message.total_amount)} et verrouiller la mission
          </button>
        </IaMessage>
      );

    case "contact_unlocked":
      // Débloqué uniquement après confirmation du webhook de paiement — étape suivante.
      return null;

    default:
      return null;
  }
}

function ChatBiddingView({ onBack, onAccept }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offersById, setOffersById] = useState({});
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  const registerOffers = (linguaMessages) => {
    setOffersById((prev) => {
      const next = { ...prev };
      linguaMessages.forEach((m) => {
        if (m.type === "offer_list") {
          m.offers.forEach((o) => {
            next[o.id] = { ...o, category: m.category };
          });
        }
      });
      return next;
    });
  };

  const sendToLingua = async (userMessage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callLinguaAPI({ conversationId, message: userMessage });
      const linguaMessages = data.messages || [];
      setConversationId(data.conversation_id || conversationId);
      registerOffers(linguaMessages);
      setMessages((prev) => [
        ...prev,
        ...linguaMessages.map((m) => ({ ...m, from: "lingua" })),
      ]);
    } catch (e) {
      setError("Connexion au cerveau MyLingua impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    sendToLingua({ type: "init" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendText = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, from: "user", kind: "text", text }]);
    setDraft("");
    sendToLingua({ type: "text", content: text });
  };

  const sendVoice = () => {
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, from: "user", kind: "voice" }]);
    sendToLingua({ type: "voice", content: "voice_note" });
  };

  const handleLockMission = (message) => {
    const breakdown = message.breakdown || [];
    const breakdownStr = breakdown
      .map((b) => `${b.label} (${fmtFCFA(b.amount)})`)
      .join(" + ");

    const linkedOffers = breakdown.map((b) => offersById[b.ref_offer_id]);
    const mechanicOffer = linkedOffers.find((o) => o?.category === "mechanics");
    const vendorOffer = linkedOffers.find((o) => o?.category === "parts");

    onAccept({
      missionId: message.mission_id,
      name: mechanicOffer?.title || "Mécanicien",
      vendorName: vendorOffer?.title || "Vendeur",
      eta: mechanicOffer?.eta || "À confirmer",
      price: message.total_amount,
      breakdown: breakdownStr,
    });
  };

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-900 sticky top-0 bg-slate-950 z-10">
        <button onClick={onBack} className="text-slate-400">
          ←
        </button>
        <div>
          <p className="font-semibold text-sm">Chat Lingua</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Comparateur d'urgence
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {messages.map((m) =>
          m.from === "user" ? (
            <UserMessage key={m.id}>
              {m.kind === "voice" ? (
                <span className="flex items-center gap-2">
                  <span className="text-base">🎙️</span> Message vocal (0:03)
                </span>
              ) : (
                m.text
              )}
            </UserMessage>
          ) : (
            <LinguaMessage key={m.id} message={m} onLockMission={handleLockMission} />
          )
        )}

        {loading && (
          <IaMessage>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Loader2 size={14} className="animate-spin" /> MyLingua analyse…
            </div>
          </IaMessage>
        )}

        {error && (
          <IaMessage>
            <p className="text-xs text-orange-400">{error}</p>
          </IaMessage>
        )}
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendText();
            }}
            placeholder="Écrivez ou parlez..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 text-xs outline-none focus:border-orange-500 placeholder:text-slate-500"
          />
          <button
            onClick={sendVoice}
            aria-label="Message vocal"
            className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shrink-0 transition-colors"
          >
            <Mic size={17} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- VUE 4 : SÉQUESTRE PAIEMENT --------------------- */

function EscrowView({ mechanic, onBack, onPaid }) {
  const [method, setMethod] = useState("wave");
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const methods = [
    { id: "wave", label: "Wave", color: "border-sky-500" },
    { id: "om", label: "Orange Money", color: "border-orange-500" },
    { id: "intouch", label: "Intouch", color: "border-emerald-500" },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowConfirmation(true);
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
        {mechanic?.breakdown && (
          <p className="text-[11px] text-slate-500 pb-2 border-b border-slate-800 mb-2">
            {mechanic.breakdown}
          </p>
        )}
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

      {showConfirmation && (
        <PaymentConfirmationModal mechanic={mechanic} onContinue={onPaid} />
      )}
    </div>
  );
}

function PaymentConfirmationModal({ mechanic, onContinue }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-lg shadow-black/50">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <ShieldCheck className="text-emerald-500" size={24} />
        </div>

        <p className="text-sm font-semibold mb-3">
          💰 Paiement de {fmtFCFA(mechanic?.price || 0)} reçu et bloqué.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          📞 Votre numéro est en train d'être transmis au mécano{" "}
          <span className="font-semibold text-white">{mechanic?.name}</span> et au vendeur{" "}
          <span className="font-semibold text-white">{mechanic?.vendorName}</span>…
        </p>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-start gap-2 mb-5">
          <span className="text-sm shrink-0">⚠️</span>
          <p className="text-[11px] text-orange-300 leading-relaxed">
            Rappel : toute transaction en dehors de l'application annule votre garantie et
            votre remboursement.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Compris, j'attends le mécano
        </button>
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

      <div className="space-y-2 mb-4">
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-orange-300">
            🧑‍🔧 {mechanic?.name} - En route
          </p>
          <span className="text-xs font-bold text-orange-400 shrink-0">2 min</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-emerald-300">
            📦 {mechanic?.vendorName} - Pièce en livraison vers votre position
          </p>
          <span className="text-xs font-bold text-emerald-400 shrink-0">4 min</span>
        </div>
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

function AdminBackOffice({ currentUser, onExitAdmin }) {
  const isSuperAdmin = currentUser.id === 1;
  const canAccess = (id) => {
    if (isSuperAdmin) return true;
    if (id === "settings") return !!currentUser.permissions?.settings;
    if (id === "roles") return !!currentUser.permissions?.roles;
    return true;
  };

  const allMenuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "interventions", label: "Interventions", icon: Wrench },
    { id: "pieces", label: "Pièces", icon: Package },
    { id: "settings", label: "Paramètres du site", icon: Settings },
    { id: "roles", label: "Rôles & Permissions", icon: Users },
  ];
  const menuItems = allMenuItems.filter((m) => canAccess(m.id));

  const [adminView, setAdminView] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const selectView = (id) => {
    setAdminView(id);
    setMobileNavOpen(false);
  };

  const currentLabel = menuItems.find((m) => m.id === adminView)?.label;

  const SidebarContent = () => (
    <>
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
              onClick={() => selectView(item.id)}
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
    </>
  );

  return (
    <div className="w-full h-screen bg-slate-950 text-white flex overflow-hidden transform">
      {/* Sidebar statique (desktop, lg+) */}
      <div className="hidden lg:flex w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex-col">
        <SidebarContent />
      </div>

      {/* Sidebar mobile/tablette : panneau glissant + overlay (sous lg) */}
      <div
        onClick={() => setMobileNavOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 max-w-[80%] bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Contenu */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden shrink-0 text-slate-400 hover:text-white transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <p className="text-sm text-slate-400 hidden sm:block">Bienvenue,</p>
              <p className="font-semibold text-sm truncate">
                <span className="sm:hidden">{currentLabel}</span>
                <span className="hidden sm:inline">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={19} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            {currentUser.avatar ? (
              <ImgWithFallback
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                fallbackIcon={Users}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.split(" ")[0][0]}
              </div>
            )}
          </div>
        </div>

        {/* Vue dynamique */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="overflow-x-auto">
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
    </div>
  );
}

function AdminPieces() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Pièces</h1>
      <p className="text-sm text-slate-400 mb-6">Catalogue des pièces détachées en vente</p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      <ImgWithFallback
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover"
                        fallbackIcon={Package}
                      />
                    </div>
                    {p.name}
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
    </div>
  );
}

/* --------------------------- A. Paramètres du site ------------------------ */

function AdminSettings() {
  const [showKeys, setShowKeys] = useState({ wave: false, om: false, intouch: false });
  const [form, setForm] = useState({
    platformName: "FlashMecano",
    phone: "+221 77 861 06 60",
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
        <div className="overflow-x-auto">
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
                <td className="px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap">
                  {u.avatar ? (
                    <ImgWithFallback
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      fallbackIcon={Users}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {u.name.split(" ")[0][0]}
                    </div>
                  )}
                  {u.name}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full whitespace-nowrap ${u.roleColor}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{u.access}</td>
                <td className="px-4 py-3 text-right">
                  {u.editable ? (
                    <button
                      onClick={() => setModalUser(u)}
                      className="text-xs text-sky-500 hover:underline font-medium whitespace-nowrap"
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
