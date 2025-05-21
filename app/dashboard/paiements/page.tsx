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
import { Textarea } from "@/components/ui/textarea"
import { paiementsAPI, commandesAPI } from "@/lib/api"

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

  const fetchPaiements = async () => {
    try {
      const res = await paiementsAPI.getAll()
      setPaiements(res.data)
    } catch (err) {
      console.error("Erreur chargement paiements", err)
    }
  }

  const fetchCommandes = async () => {
    try {
      const res = await commandesAPI.getAll()
      setCommandes(res.data)
    } catch (err) {
      console.error("Erreur chargement commandes", err)
    }
  }

  useEffect(() => {
    fetchPaiements()
    fetchCommandes()
  }, [])

  const filteredPaiements = paiements.filter(p =>
    (p?.commandeId ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p?.moyenPaiement ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p?.statut ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPaiement = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const commande = commandes.find((c) => c._id === selectedCommandeId)
    if (!commande) return

    try {
      await paiementsAPI.create({
        commandeId: selectedCommandeId,
        montant: Number(montant),
        datePaiement: date,
        moyenPaiement: methode,
        statut,
        commande: commande.commande
      })

      setSelectedCommandeId("")
      setMontant("")
      setDate("")
      setMethode("")
      setStatut("complete")
      setDialogOpen(false)
      fetchPaiements()
    } catch (err) {
      console.error("Erreur ajout paiement", err)
    } finally {
      setLoading(false)
    }
  }

  if (commandes.length > 0) {
    console.log("Commandes:", commandes)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">Gérez les paiements et les transactions financières.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <CreditCard className="mr-2 h-4 w-4" /> Enregistrer un paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau paiement</DialogTitle>
              <DialogDescription>Remplissez les informations pour enregistrer un nouveau paiement.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPaiement}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="vente">Vente associée</Label>
                  <Select value={selectedCommandeId} onValueChange={setSelectedCommandeId}>
                    <SelectTrigger id="vente">
                      <SelectValue placeholder="Sélectionnez une vente" />
                    </SelectTrigger>
                    <SelectContent>
                      {commandes.map((c) => (
                        <SelectItem key={c._id} value={c._id!}>
                          {c.commande} ({c.montantTotal} XOF)
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (XOF)</Label>
                  <Input id="montant" type="number" value={montant} onChange={(e) => setMontant(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methode">Méthode de paiement</Label>
                  <Select value={methode} onValueChange={setMethode}>
                    <SelectTrigger id="methode">
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carte">Carte bancaire</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="mobile">Orange Money</SelectItem>
                      <SelectItem value="especes">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date du paiement</Label>
                  <Input id="date" type="date" value={date} readOnly />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={statut} onValueChange={setStatut}>
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Complété</SelectItem>
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="annule">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiements.length > 0 ? (
              filteredPaiements.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p._id}</TableCell>
                  <TableCell>{p.commande}</TableCell>
                  <TableCell>{p.montant} XOF</TableCell>
                  <TableCell>{p.datePaiement}</TableCell>
                  <TableCell>{p.moyenPaiement}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.statut === "complete" ? "default" : p.statut === "attente" ? "outline" : "destructive"}
                      className={p.statut === "complete" ? "bg-green-500" : p.statut === "attente" ? "bg-yellow-500 text-yellow-800" : ""}
                    >
                      {p.statut}
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Générer un reçu</DropdownMenuItem>
                        <DropdownMenuItem>Envoyer une confirmation</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Annuler</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun paiement trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
