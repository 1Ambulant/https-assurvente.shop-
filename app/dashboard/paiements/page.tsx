"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Filter, MoreHorizontal, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const paiements = [
  {
    id: "PAY-001",
    vente: "VNT-001",
    client: "Martin Dubois",
    montant: "450,000 XOF",
    date: "15/05/2025",
    methode: "Carte bancaire",
    statut: "complété",
    reference: "CB-123456",
  },
  {
    id: "PAY-002",
    vente: "VNT-003",
    client: "Sophie Lefebvre",
    montant: "325,000 XOF",
    date: "12/05/2025",
    methode: "Virement bancaire",
    statut: "complété",
    reference: "VB-789012",
  },
  {
    id: "PAY-003",
    vente: "VNT-004",
    client: "Groupe Gamma",
    montant: "470,000 XOF",
    date: "10/05/2025",
    methode: "Chèque",
    statut: "complété",
    reference: "CH-345678",
  },
  {
    id: "PAY-004",
    vente: "VNT-002",
    client: "Entreprise Alpha",
    montant: "550,000 XOF",
    date: "14/05/2025",
    methode: "Virement bancaire",
    statut: "en attente",
    reference: "VB-901234",
  },
  {
    id: "PAY-005",
    vente: "VNT-005",
    client: "Thomas Moreau",
    montant: "185,000 XOF",
    date: "08/05/2025",
    methode: "Mobile Money",
    statut: "en attente",
    reference: "MM-567890",
  },
  {
    id: "PAY-006",
    vente: "VNT-007",
    client: "Camille Petit",
    montant: "95,000 XOF",
    date: "03/05/2025",
    methode: "Carte bancaire",
    statut: "complété",
    reference: "CB-234567",
  },
  {
    id: "PAY-007",
    vente: "VNT-006",
    client: "Société Beta",
    montant: "375,000 XOF",
    date: "05/05/2025",
    methode: "Virement bancaire",
    statut: "annulé",
    reference: "VB-890123",
  },
]

export default function PaiementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrer les paiements en fonction de la recherche
  const filteredPaiements = paiements.filter(
    (paiement) =>
      paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.vente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.reference.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPaiement = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'un paiement
    setTimeout(() => {
      setLoading(false)
      setDialogOpen(false)
    }, 1500)
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
                  <Select>
                    <SelectTrigger id="vente">
                      <SelectValue placeholder="Sélectionnez une vente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnt002">VNT-002 - Entreprise Alpha (550,000 XOF)</SelectItem>
                      <SelectItem value="vnt005">VNT-005 - Thomas Moreau (185,000 XOF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (XOF)</Label>
                  <Input id="montant" type="number" placeholder="Ex: 450000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methode">Méthode de paiement</Label>
                  <Select>
                    <SelectTrigger id="methode">
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carte">Carte bancaire</SelectItem>
                      <SelectItem value="virement">Virement bancaire</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="especes">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Référence du paiement</Label>
                  <Input id="reference" placeholder="Ex: CB-123456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date du paiement</Label>
                  <Input id="date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut du paiement</Label>
                  <Select defaultValue="complete">
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Notes supplémentaires..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
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
              <TableHead>Vente</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiements.length > 0 ? (
              filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell className="font-medium">{paiement.id}</TableCell>
                  <TableCell>{paiement.vente}</TableCell>
                  <TableCell>{paiement.client}</TableCell>
                  <TableCell>{paiement.montant}</TableCell>
                  <TableCell>{paiement.date}</TableCell>
                  <TableCell>{paiement.methode}</TableCell>
                  <TableCell>{paiement.reference}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        paiement.statut === "complété"
                          ? "default"
                          : paiement.statut === "en attente"
                            ? "outline"
                            : "destructive"
                      }
                      className={
                        paiement.statut === "complété"
                          ? "bg-green-500"
                          : paiement.statut === "en attente"
                            ? "bg-yellow-500 text-yellow-800"
                            : ""
                      }
                    >
                      {paiement.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
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
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Aucun paiement trouvé</h3>
                    <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
