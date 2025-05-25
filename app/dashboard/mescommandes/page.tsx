"use client"

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MesCommandesPage() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const arrondir5 = (val: number) => Math.round(val / 5) * 5;


  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setClientId(id);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/commandes/client/${clientId}`)
      .then(res => res.json())
      .then(data => {
        setCommandes(data);
      })
      .catch(err => console.error("Erreur lors de la récupération des commandes:", err));
  }, [clientId]);

  if (!clientId) return <p className="text-muted-foreground">Chargement de vos commandes...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Mes commandes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Prix Total</TableHead>
            <TableHead>Nombre de mois</TableHead>
            <TableHead>Versement initial (50%)</TableHead>
            <TableHead>Paiement mensuel</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commandes.map((c) => {
            const acompte = arrondir5(c.montantTotal * 0.5);
            const mensualite = c.nombreEcheances && c.nombreEcheances > 1
              ? arrondir5((c.montantTotal - acompte) / c.nombreEcheances)
              : 0;
            return (
              <TableRow key={c._id}>
                <TableCell>{new Date(c.dateCommande).toLocaleDateString()}</TableCell>
                <TableCell>{c.commande}</TableCell>
                <TableCell>{c.quantite}</TableCell>
                <TableCell>{c.montantTotal.toLocaleString()} XOF</TableCell>
                <TableCell>{c.nombreEcheances || 1}</TableCell>
                <TableCell>
                  {c.nombreEcheances >= 1 ? `${acompte.toLocaleString()} XOF` : "-"}
                </TableCell>
                <TableCell>
                  {c.nombreEcheances >= 1 ? `${mensualite.toLocaleString()} XOF` : "-"}
                </TableCell>
                <TableCell>{c.statut}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
