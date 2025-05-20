import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "super-cle-api-123456";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
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
      // window.location.href = "/connexion"; // optionnel
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
    stock: number;
    description?: string;
    image?: string;
  }) => api.post("/produits", data),
};

// 📑 Commandes
export const commandesAPI = {
  getAll: () => api.get("/commandes"),
  create: (data: {
    produitId: string;
    clientId: string;
    quantite: number;
    montantTotal: number;
    paiementEchelonne: boolean;
    nombreEcheances: number;
    acompteInitial: number;
    statut: string;
    dateCommande: string;
  }) => api.post("/commandes", data),
};

// 💰 Paiements
export const paiementsAPI = {
  getAll: () => api.get("/paiements"),
  create: (data: {
    commandeId: string;
    montant: number;
    datePaiement: string;
    moyenPaiement: string;
    statut: string;
  }) => api.post("/paiements", data),
};

// 👤 Clients
export const clientsAPI = {
  getAll: () => api.get("/clients"),
  create: (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  }) => api.post("/clients", data),
};

export default api;
