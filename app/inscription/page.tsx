"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientsAPI, partenariatsAPI } from "@/lib/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    nomEntreprise: "",
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Inscription</h1>
          <p className="text-gray-500">Créez votre compte pour commencer</p>
        </div>
        <form onSubmit={type === "client" ? handleClientSubmit : handlePartenaireSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type de compte</Label>
            <Select value={type} onValueChange={(value) => setType(value as "client" | "partenaire")}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="partenaire">Partenaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "partenaire" && (
            <div>
              <Label htmlFor="typePartenaire">Type de partenaire</Label>
              <Select value={partenaireData.type} onValueChange={(value) => setPartenaireData({ ...partenaireData, type: value as "revendeur" | "installateur" })}>
                <SelectTrigger id="typePartenaire">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revendeur">Revendeur</SelectItem>
                  <SelectItem value="installateur">Installateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" value={type === "client" ? clientData.nom : partenaireData.nom} onChange={(e) => {
              if (type === "client") {
                setClientData({ ...clientData, nom: e.target.value });
              } else {
                setPartenaireData({ ...partenaireData, nom: e.target.value });
              }
            }} required />
          </div>

          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" value={type === "client" ? clientData.prenom : partenaireData.contact} onChange={(e) => {
              if (type === "client") {
                setClientData({ ...clientData, prenom: e.target.value });
              } else {
                setPartenaireData({ ...partenaireData, contact: e.target.value });
              }
            }} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={type === "client" ? clientData.email : partenaireData.email} onChange={(e) => {
              if (type === "client") {
                setClientData({ ...clientData, email: e.target.value });
              } else {
                setPartenaireData({ ...partenaireData, email: e.target.value });
              }
            }} required />
          </div>

          <div>
            <Label htmlFor="telephone">Téléphone</Label>
            <Input id="telephone" value={type === "client" ? clientData.telephone : partenaireData.telephone} onChange={(e) => {
              if (type === "client") {
                setClientData({ ...clientData, telephone: e.target.value });
              } else {
                setPartenaireData({ ...partenaireData, telephone: e.target.value });
              }
            }} required />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={type === "client" ? clientData.motDePasse : partenaireData.motDePasse} onChange={(e) => {
              if (type === "client") {
                setClientData({ ...clientData, motDePasse: e.target.value });
              } else {
                setPartenaireData({ ...partenaireData, motDePasse: e.target.value });
              }
            }} required />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" type="password" value={type === "client" ? clientConfirmPassword : partenaireConfirmPassword} onChange={(e) => {
              if (type === "client") {
                setClientConfirmPassword(e.target.value);
              } else {
                setPartenaireConfirmPassword(e.target.value);
              }
            }} required />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>
      </div>
    </div>
  );
} 