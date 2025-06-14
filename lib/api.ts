import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://assurvente.shop/api";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "super-cle-api-123456";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.headers) {
    config.headers["x-api-key"] = API_KEY;
  }
  return config;
});

// Intercepteur d'erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("⛔ Non autorisé");
    }
    return Promise.reject(err);
  }
);

// 🔐 Authentification
export const authAPI = {
  login: (data: { email: string; motDePasse: string }) => api.post("/users/login", data),
  register: (data: { nom: string; email: string; motDePasse: string; role: string }) =>
    api.post("/users/register", data),
};

// 📦 Produits
export const produitsAPI = {
  getAll: () => api.get("/produits"),
  create: (data: {
    nom: string;
    prix: number;
    description?: string;
    image?: string;
    partenaireIds?: string[];
  }) => api.post("/produits", data),

  update: (id: string, data: {
    nom: string;
    prix: number;
    description?: string;
    image?: string;
    partenaireIds?: string[];
  }) => api.put(`/produits/${id}`, data),
};

// 📑 Ventes
export const ventesAPI = {
  getAll: () => api.get("/ventes"),
  create: (data: {
    _id?: string;
    produitId: string;
    clientId: string;
    quantite: number;
    montantTotal: number;
    paiementEchelonne?: boolean;
    nombreEcheances?: number;
    acompteInitial?: number;
    commande: string;
    statut: "preparation" | "livree" | "annulee";
    paiement: "attente" | "paye" | "rembourse";
    dateCommande: string;
  }) => api.post("/ventes", data),
};

// 💰 Paiements
export const paiementsAPI = {
  getAll: () => api.get("/paiements"),

  getByClient: (clientId: string) =>
    api.get(`/paiements/client/${clientId}`),

  getByCommande: (commandeId: string) =>
    api.get(`/paiements/commande/${commandeId}`),

  create: (data: {
    commandeId: string;
    clientId: string;
    montantInitial: number;
    montantPaye: number;
    resteAPayer: number;
    datePaiement: string;
    statut: "en_cours" | "termine";
    type: "unique" | "echelonne";
    echeances?: {
      numero: number;
      montant: number;
      dateEcheance: string;
      statut: "en_attente" | "paye" | "en_retard";
      montantPaye: number;
    }[];
  }) => api.post("/paiements", data),

  update: (id: string, data: {
    montantPaye?: number;
    resteAPayer?: number;
    statut?: "en_cours" | "termine";
    type?: "unique" | "echelonne";
    echeances?: {
      numero: number;
      montant: number;
      dateEcheance: string;
      statut: "en_attente" | "paye" | "en_retard";
      montantPaye: number;
    }[];
  }) => api.put(`/paiements/${id}`, data),

  remove: (id: string) => api.delete(`/paiements/${id}`),

  updateEcheance: (
    id: string,
    numeroEcheance: number,
    data: {
      montantPaye: number;
      datePaiement: string;
      statut: "en_attente" | "paye" | "en_retard";
    }
  ) => api.put(`/paiements/${id}/echeance/${numeroEcheance}`, data),
};

// 👤 Clients
export const clientsAPI = {
  getAll: () => api.get("/clients"),
  create: (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    type?: "Particulier" | "Entreprise";
    statut?: "actif" | "inactif";
    dateInscription?: string;
    nomEntreprise?: string;
  }) => api.post("/clients", data),
}

// 📡 Partenaires
export const partenariatsAPI = {
  getAll: () => api.get("/partenaires"),
  create: (data: {
    nom: string;
    type: string;
    contact: string;
    telephone: string;
    adresse?: string;
    description?: string;
    acces: {
      geolocalisation: boolean;
      controle: boolean;
      statistiques: boolean;
      clients: boolean;
    };
    statut?: "actif" | "inactif";
  }) => api.post("/partenaires", data),

  update: (id: string, data: any) => api.put("/partenaires", { _id: id, ...data }),
  remove: (id: string) => api.delete("/partenaires", { data: { id } }),
};

// 📦 Commandes
export const commandesAPI = {
  getAll: () => api.get("/commandes"),
  
  getByClient: (clientId: string) => api.get(`/commandes/client/${clientId}`),

  create: (data: {
    clientId: string;
    produitId: string;
    quantite: number;
    montantTotal: number;
    paiementEchelonne?: boolean;
    nombreEcheances?: number;
    acompteInitial?: number;
    commande: string;
    statut: "preparation" | "expediee" | "livree" | "annulee";
    paiement: "attente" | "paye" | "rembourse";
    dateCommande: string;
  }) => api.post("/commandes", data),

  update: (id: string, data: any) => api.put(`/commandes/${id}`, data),

  remove: (id: string) => api.delete(`/commandes/${id}`)
};

export default api;
