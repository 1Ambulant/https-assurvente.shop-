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
import { Filter, MoreHorizontal, Search, ShoppingBag } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const commandes = [
  {
    id: "CMD-001",
    client: "Martin Dubois",
    produits: "Réfrigérateur Samsung Side by Side",
    montant: "450,000 XOF",
    date: "15/05/2025",
    statut: "en préparation",
    paiement: "payé",
  },
  {
    id: "CMD-002",
    client: "Entreprise Alpha",
    produits: "Climatiseur Daikin Inverter (x2)",
    montant: "550,000 XOF",
    date: "14/05/2025",
    statut: "expédiée",
    paiement: "payé",
  },
  {
    id: "CMD-003",
    client: "Sophie Lefebvre",
    produits: "Machine à laver LG 8kg",
    montant: "325,000 XOF",
    date: "12/05/2025",
    statut: "livrée",
    paiement: "payé",
  },
  {
    id: "CMD-004",
    client: "Groupe Gamma",
    produits: "Lave-vaisselle Whirlpool, Micro-ondes Panasonic",
    montant: "470,000 XOF",
    date: "10/05/2025",
    statut: "en préparation",
    paiement: "en attente",
  },
  {
    id: "CMD-005",
    client: "Thomas Moreau",
    produits: "Cuisinière à gaz Bosch 4 feux",
    montant: "185,000 XOF",
    date: "08/05/2025",
    statut: "annulée",
    paiement: "remboursé",
  },
  {
    id: "CMD-006",
    client: "Société Beta",
    produits: "Four électrique Moulinex (x3)",
    montant: "375,000 XOF",
    date: "05/05/2025",
    statut: "livrée",
    paiement: "payé",
  },
  {
    id: "CMD-007",
    client: "Camille Petit",
    produits: "Micro-ondes Panasonic",
    montant: "95,000 XOF",
    date: "03/05/2025",
    statut: "expédiée",
    paiement: "payé",
  },
]

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrer les commandes en fonction de la recherche
  const filteredCommandes = commandes.filter(
    (commande) =>
      commande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.produits.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.statut.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCommande = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'une commande
    setTimeout(() => {
      setLoading(false)
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">Gérez les commandes de vos clients.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ShoppingBag className="mr-2 h-4 w-4" /> Ajouter une commande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle commande</DialogTitle>
              <DialogDescription>Remplissez les informations pour créer une nouvelle commande.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCommande}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sélectionnez un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="martin">Martin Dubois</SelectItem>
                      <SelectItem value="sophie">Sophie Lefebvre</SelectItem>
                      <SelectItem value="thomas">Thomas Moreau</SelectItem>
                      <SelectItem value="camille">Camille Petit</SelectItem>
                      <SelectItem value="alpha">Entreprise Alpha</SelectItem>
                      <SelectItem value="beta">Société Beta</SelectItem>
                      <SelectItem value="gamma">Groupe Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="produits">Produits</Label>
                  <Select>
                    <SelectTrigger id="produits">
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refrigerateur">Réfrigérateur Samsung Side by Side</SelectItem>
                      <SelectItem value="machine">Machine à laver LG 8kg</SelectItem>
                      <SelectItem value="climatiseur">Climatiseur Daikin Inverter</SelectItem>
                      <SelectItem value="cuisiniere">Cuisinière à gaz Bosch 4 feux</SelectItem>
                      <SelectItem value="micro-ondes">Micro-ondes Panasonic</SelectItem>
                      <SelectItem value="lave-vaisselle">Lave-vaisselle Whirlpool</SelectItem>
                      <SelectItem value="four">Four électrique Moulinex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input id="quantite" type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix unitaire (XOF)</Label>
                    <Input id="prix" type="number" placeholder="Ex: 450000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut de la commande</Label>
                  <Select defaultValue="preparation">
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparation">En préparation</SelectItem>
                      <SelectItem value="expedie">Expédiée</SelectItem>
                      <SelectItem value="livree">Livrée</SelectItem>
                      <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paiement">Statut du paiement</Label>
                  <Select defaultValue="attente">
                    <SelectTrigger id="paiement">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="paye">Payé</SelectItem>
                      <SelectItem value="rembourse">Remboursé</SelectItem>
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
            placeholder="Rechercher une commande..."
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
              <TableHead>Client</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommandes.length > 0 ? (
              filteredCommandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell className="font-medium">{commande.id}</TableCell>
                  <TableCell>{commande.client}</TableCell>
                  <TableCell>{commande.produits}</TableCell>
                  <TableCell>{commande.montant}</TableCell>
                  <TableCell>{commande.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        commande.statut === "livrée"
                          ? "bg-green-500"
                          : commande.statut === "expédiée"
                            ? "bg-blue-500"
                            : commande.statut === "en préparation"
                              ? "bg-yellow-500 text-yellow-800"
                              : "bg-red-500"
                      }
                    >
                      {commande.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        commande.paiement === "payé"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : commande.paiement === "en attente"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                            : "border-red-500 text-red-600 bg-red-50"
                      }
                    >
                      {commande.paiement}
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
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Générer une facture</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Annuler</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Aucune commande trouvée</h3>
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
