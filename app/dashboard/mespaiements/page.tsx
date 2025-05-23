"use client"

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paiementsAPI } from "@/lib/api";

export default function MesPaiementsPage() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setClientId(id);
      console.log("Client ID:", id);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    paiementsAPI.getByClient(clientId)
      .then(res => {
        setPaiements(res.data);
        console.log("Paiements:", res.data);
      })
      .catch(err => console.error("Erreur chargement paiements:", err));
  }, [clientId]);

  if (!clientId) return <p className="text-muted-foreground">Chargement de vos paiements...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Mes paiements</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Commande</TableHead>
            <TableHead>Moyen</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paiements.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{new Date(p.datePaiement).toLocaleDateString()}</TableCell>
              <TableCell>{p.montant.toLocaleString()} XOF</TableCell>
              <TableCell>{p.commande}</TableCell>
              <TableCell>{p.moyenPaiement}</TableCell>
              <TableCell>{p.statut}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
