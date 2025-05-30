"use client"

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { paiementsAPI } from "@/lib/api";

export default function MesPaiementsPage() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    console.log("Client ID:", id);
    if (id) {
      setClientId(id);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    paiementsAPI.getByClient(clientId)
      .then(res => {
        setPaiements(res.data);
      })
      .catch(err => console.error("Erreur chargement paiements:", err));
  }, [clientId]);

  if (!clientId) return <p className="text-muted-foreground">Chargement de vos paiements...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Mes paiements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paiements.map((p) => {
          // Calculer le nombre d'échéances restantes
          const echeancesRestantes = p.type === "echelonne" 
            ? p.echeances?.filter((e: any) => e.statut === "en_attente").length || 0
            : 0;

          return (
            <div key={p._id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-500">
                  {new Date(p.datePaiement).toLocaleDateString()}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.statut === "termine" ? "bg-green-100 text-green-800" :
                  p.statut === "en_cours" ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {p.statut === "acompte" ? "Acompte" : p.statut === "en_cours" ? "En cours" : "Terminé"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="font-medium">{p.montantInitial.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant payé</span>
                  <span className="font-medium">{p.montantPaye.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Reste à payer</span>
                  <span className="font-medium">{p.resteAPayer.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-medium">{p.type === "echelonne" ? "Échelonné" : "Unique"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Échéances restantes</span>
                  <span className="font-medium">{p.type === "echelonne" ? `${echeancesRestantes} échéance(s)` : "-"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
