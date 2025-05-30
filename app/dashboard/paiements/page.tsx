"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { CreditCard, Filter, MoreHorizontal, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { paiementsAPI, commandesAPI, clientsAPI } from "@/lib/api"

export default function PaiementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [paiements, setPaiements] = useState<any[]>([])
  const [commandes, setCommandes] = useState<any[]>([])

  const [selectedCommandeId, setSelectedCommandeId] = useState("")
  const [montant, setMontant] = useState("")
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  )
  const [methode, setMethode] = useState("")
  const [statut, setStatut] = useState("complete")

  const [selectedPaiement, setSelectedPaiement] = useState<any | null>(null)
  const [editMontant, setEditMontant] = useState("")
  const [editStatut, setEditStatut] = useState<"en_cours" | "termine">("en_cours")

  const [selectedEcheance, setSelectedEcheance] = useState<number | "acompte" | null>(null);
  const [montantEcheance, setMontantEcheance] = useState("")

  const fetchPaiements = async () => {
    try {
      const [paiementsRes, clientsRes] = await Promise.all([
        paiementsAPI.getAll(),
        clientsAPI.getAll()
      ]);

      // Récupérer l'ID et le rôle du partenaire depuis localStorage
      const partenaireId = localStorage.getItem("id");
      const role = localStorage.getItem("role");

      let paiementsData = paiementsRes.data;
      
      // Si l'utilisateur est un partenaire, ne montrer que les paiements de ses clients
      if (role === "partenaire" && partenaireId) {
        paiementsData = paiementsData.filter((paiement: any) => {
          const client = clientsRes.data.find((c: any) => c._id === paiement.clientId);
          return client && client.partenaireId === partenaireId;
        });
      }

      setPaiements(paiementsData);
    } catch (err) {
      console.error("Erreur chargement paiements", err);
    }
  }

  const fetchCommandes = async () => {
    try {
      const [commandesRes, clientsRes] = await Promise.all([
        commandesAPI.getAll(),
        clientsAPI.getAll()
      ]);

      // Récupérer l'ID et le rôle du partenaire depuis localStorage
      const partenaireId = localStorage.getItem("id");
      const role = localStorage.getItem("role");

      let commandesData = commandesRes.data;
      
      // Si l'utilisateur est un partenaire, ne montrer que les commandes de ses clients
      if (role === "partenaire" && partenaireId) {
        commandesData = commandesData.filter((commande: any) => {
          const client = clientsRes.data.find((c: any) => c._id === commande.clientId);
          return client && client.partenaireId === partenaireId;
        });
      }

      setCommandes(commandesData);
    } catch (err) {
      console.error("Erreur chargement commandes", err);
    }
  }

  useEffect(() => {
    fetchPaiements()
    fetchCommandes()
  }, [])

  const filteredPaiements = paiements.filter(p =>
    (p?._id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p?.commande ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p?.statut ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">Gérez les paiements et les transactions financières.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un paiement..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiements.length > 0 ? (
              filteredPaiements.map((p) => {

                return (
                  <TableRow key={p._id}>
                    <TableCell>{p._id}</TableCell>
                    <TableCell>{p.commande}</TableCell>
                    <TableCell>
                      <div>Total : {p.montantInitial.toLocaleString()} XOF</div>
                      <div className="text-sm text-muted-foreground">Payé : {p.montantPaye.toLocaleString()} XOF</div>
                      <div className="text-sm text-muted-foreground">Reste : {p.resteAPayer.toLocaleString()} XOF</div>
                    </TableCell>
                    <TableCell>{new Date(p.datePaiement).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.statut === "termine" ? "default"
                            : p.statut === "en_cours" ? "secondary"
                              : "outline"
                        }
                        className={
                          p.statut === "termine" ? "bg-green-500"
                            : p.statut === "en_cours" ? "bg-yellow-500 text-yellow-900"
                              : "bg-gray-200 text-gray-800"
                        }
                      >
                        {p.statut === "acompte"
                          ? "Acompte"
                          : p.statut === "en_cours"
                            ? "En cours"
                            : "Terminé"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setDialogOpen(true)
                              setSelectedPaiement(p)
                            }}
                          >
                            Modifier
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={async () => {
                              const confirmed = confirm("Voulez-vous vraiment supprimer ce paiement ?");
                              if (!confirmed || !p._id) return;

                              try {
                                await paiementsAPI.remove(p._id);
                                alert("Paiement supprimé avec succès.");
                                fetchPaiements();
                              } catch (error) {
                                console.error("Erreur suppression :", error);
                                alert("Erreur lors de la suppression.");
                              }
                            }}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun paiement trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le paiement</DialogTitle>
              <DialogDescription>
                Mettez à jour le montant payé et le statut de ce paiement.
              </DialogDescription>
            </DialogHeader>

            {selectedPaiement?.type === "echelonne" && (
              <>
                <div>
                  <Label>Échéance à payer</Label>
                  <Select
                    value={selectedEcheance?.toString() ?? ""}
                    onValueChange={(val) => {
                      if (val === "acompte") {
                        setSelectedEcheance("acompte")
                      } else {
                        setSelectedEcheance(Number(val))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une échéance" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* 👉 Échéances en attente ensuite */}
                      {selectedPaiement.echeances
                        ?.filter((e: any) => e.statut === "en_attente")
                        .map((e: any) => (
                          <SelectItem key={e.numero} value={e.numero.toString()}>
                            {e.type === "acompte" ? "Acompte" : `Échéance ${e.numero}`} – {e.montant} XOF – {new Date(e.dateEcheance).toLocaleDateString()}
                          </SelectItem>
                        ))}
                    </SelectContent>

                  </Select>
                </div>
              </>
            )}

            <div className="space-y-4">
              <div>
                <Label>Statut</Label>
                <Select value={editStatut} onValueChange={(val) => setEditStatut(val as "en_cours" | "termine")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            <DialogFooter>
              <Button
                onClick={async () => {
                  if (!selectedPaiement?._id) return;

                  try {
                    let montantAuto = 0;

                    if (selectedEcheance === "acompte") {
                      montantAuto = selectedPaiement.montantInitial / 2;
                      await paiementsAPI.update(selectedPaiement._id, {
                        montantPaye: montantAuto,
                        statut: editStatut,
                      });
                    }

                    else if (typeof selectedEcheance === "number") {
                      const echeance = selectedPaiement.echeances.find(
                        (e: any) => e.numero === selectedEcheance
                      );
                      if (!echeance) throw new Error("Échéance introuvable");

                      montantAuto = echeance.montant;
                      console.log("montantAuto", montantAuto);
                      await paiementsAPI.updateEcheance(
                        selectedPaiement._id,
                        selectedEcheance,
                        {
                          montantPaye: montantAuto,
                          datePaiement: new Date().toISOString(),
                          statut: "paye",
                        }
                      );
                    }

                    else {
                      // Aucun choix, par défaut 0
                      await paiementsAPI.update(selectedPaiement._id, {
                        montantPaye: 0,
                        statut: editStatut,
                      });
                    }

                    alert("Paiement mis à jour !");
                    setDialogOpen(false);
                    fetchPaiements();
                  } catch (err) {
                    console.error("Erreur MAJ :", err);
                    alert("Erreur lors de la mise à jour.");
                  }
                }}
              >
                Enregistrer
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
