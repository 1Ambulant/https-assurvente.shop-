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
import { Filter, MoreHorizontal, Search, ShoppingCart } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const ventes = [
  {
    id: "VNT-001",
    client: "Martin Dubois",
    produit: "Réfrigérateur Samsung Side by Side",
    montant: "450,000 XOF",
    date: "15/05/2025",
    statut: "payé",
    agent: "Jean Kouassi",
  },
  {
    id: "VNT-002",
    client: "Entreprise Alpha",
    produit: "Climatiseur Daikin Inverter (x2)",
    montant: "550,000 XOF",
    date: "14/05/2025",
    statut: "en attente",
    agent: "Marie Konan",
  },
  {
    id: "VNT-003",
    client: "Sophie Lefebvre",
    produit: "Machine à laver LG 8kg",
    montant: "325,000 XOF",
    date: "12/05/2025",
    statut: "payé",
    agent: "Jean Kouassi",
  },
  {
    id: "VNT-004",
    client: "Groupe Gamma",
    produit: "Lave-vaisselle Whirlpool, Micro-ondes Panasonic",
    montant: "470,000 XOF",
    date: "10/05/2025",
    statut: "payé",
    agent: "Amina Diallo",
  },
  {
    id: "VNT-005",
    client: "Thomas Moreau",
    produit: "Cuisinière à gaz Bosch 4 feux",
    montant: "185,000 XOF",
    date: "08/05/2025",
    statut: "en attente",
    agent: "Marie Konan",
  },
  {
    id: "VNT-006",
    client: "Société Beta",
    produit: "Four électrique Moulinex (x3)",
    montant: "375,000 XOF",
    date: "05/05/2025",
    statut: "annulé",
    agent: "Jean Kouassi",
  },
  {
    id: "VNT-007",
    client: "Camille Petit",
    produit: "Micro-ondes Panasonic",
    montant: "95,000 XOF",
    date: "03/05/2025",
    statut: "payé",
    agent: "Amina Diallo",
  },
]

export default function VentesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrer les ventes en fonction de la recherche
  const filteredVentes = ventes.filter(
    (vente) =>
      vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vente.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vente.agent.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddVente = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'une vente
    setTimeout(() => {
      setLoading(false)
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
          <p className="text-muted-foreground">Gérez vos ventes et suivez leur statut de paiement.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter une vente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle vente</DialogTitle>
              <DialogDescription>Remplissez les informations pour enregistrer une nouvelle vente.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVente}>
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
                  <Label htmlFor="produit">Produit</Label>
                  <Select>
                    <SelectTrigger id="produit">
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
                  <Label htmlFor="statut">Statut du paiement</Label>
                  <Select defaultValue="attente">
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paye">Payé</SelectItem>
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="annule">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Agent commercial</Label>
                  <Select>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Sélectionnez un agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jean">Jean Kouassi</SelectItem>
                      <SelectItem value="marie">Marie Konan</SelectItem>
                      <SelectItem value="amina">Amina Diallo</SelectItem>
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
            placeholder="Rechercher une vente..."
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
              <TableHead>Produit</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVentes.length > 0 ? (
              filteredVentes.map((vente) => (
                <TableRow key={vente.id}>
                  <TableCell className="font-medium">{vente.id}</TableCell>
                  <TableCell>{vente.client}</TableCell>
                  <TableCell>{vente.produit}</TableCell>
                  <TableCell>{vente.montant}</TableCell>
                  <TableCell>{vente.date}</TableCell>
                  <TableCell>{vente.agent}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vente.statut === "payé" ? "default" : vente.statut === "en attente" ? "outline" : "destructive"
                      }
                      className={
                        vente.statut === "payé"
                          ? "bg-green-500"
                          : vente.statut === "en attente"
                            ? "bg-yellow-500 text-yellow-800"
                            : ""
                      }
                    >
                      {vente.statut}
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
                    <h3 className="text-lg font-medium">Aucune vente trouvée</h3>
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
