"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientsAPI, partenariatsAPI } from "@/lib/api";

export default function Inscription() {
  const router = useRouter();
  const [type, setType] = useState<"client" | "partenaire">("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [clientData, setClientData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    adresse: "",
    ville: "",
    pays: "",
    type: "Particulier" as "Particulier" | "Entreprise",
  });

  const [clientConfirmPassword, setClientConfirmPassword] = useState("");

  const [partenaireData, setPartenaireData] = useState({
    nom: "",
    type: "",
    contact: "",
    telephone: "",
    adresse: "",
    description: "",
    email: "",
    motDePasse: "",
    acces: {
      geolocalisation: false,
      controle: false,
      statistiques: false,
      clients: false,
    },
  });

  const [partenaireConfirmPassword, setPartenaireConfirmPassword] = useState("");

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    if (clientData.motDePasse !== clientConfirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await clientsAPI.create(clientData);
      router.push("/connexion");
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePartenaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (partenaireData.motDePasse !== partenaireConfirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await partenariatsAPI.create(partenaireData);
      router.push("/connexion");
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Inscription</h2>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded ${
              type === "client"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setType("client")}
          >
            Client
          </button>
          <button
            className={`px-4 py-2 rounded ${
              type === "partenaire"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setType("partenaire")}
          >
            Partenaire
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {type === "client" ? (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.nom}
                onChange={(e) => setClientData({ ...clientData, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.prenom}
                onChange={(e) => setClientData({ ...clientData, prenom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.telephone}
                onChange={(e) => setClientData({ ...clientData, telephone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.adresse}
                onChange={(e) => setClientData({ ...clientData, adresse: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.ville}
                onChange={(e) => setClientData({ ...clientData, ville: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pays</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.pays}
                onChange={(e) => setClientData({ ...clientData, pays: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.type}
                onChange={(e) => setClientData({ ...clientData, type: e.target.value as "Particulier" | "Entreprise" })}
              >
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientData.motDePasse}
                onChange={(e) => setClientData({ ...clientData, motDePasse: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={clientConfirmPassword}
                onChange={(e) => setClientConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePartenaireSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.nom}
                onChange={(e) => setPartenaireData({ ...partenaireData, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type d'entreprise</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.type}
                onChange={(e) => setPartenaireData({ ...partenaireData, type: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Personne à contacter</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.contact}
                onChange={(e) => setPartenaireData({ ...partenaireData, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.telephone}
                onChange={(e) => setPartenaireData({ ...partenaireData, telephone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.adresse}
                onChange={(e) => setPartenaireData({ ...partenaireData, adresse: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.description}
                onChange={(e) => setPartenaireData({ ...partenaireData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.email}
                onChange={(e) => setPartenaireData({ ...partenaireData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireData.motDePasse}
                onChange={(e) => setPartenaireData({ ...partenaireData, motDePasse: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={partenaireConfirmPassword}
                onChange={(e) => setPartenaireConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 