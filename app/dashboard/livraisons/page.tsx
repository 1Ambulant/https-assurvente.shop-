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
import { Filter, MoreHorizontal, Search, Truck } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const livraisons = [
  {
    id: "LIV-001",
    commande: "CMD-001",
    client: "Martin Dubois",
    adresse: "123 Rue Principale, Abidjan",
    date: "17/05/2025",
    statut: "en préparation",
    livreur: "Express Delivery",
    tracking: "EXP123456789",
  },
  {
    id: "LIV-002",
    commande: "CMD-002",
    client: "Entreprise Alpha",
    adresse: "45 Avenue des Affaires, Abidjan",
    date: "16/05/2025",
    statut: "en transit",
    livreur: "Rapid Transport",
    tracking: "RT987654321",
  },
  {
    id: "LIV-003",
    commande: "CMD-003",
    client: "Sophie Lefebvre",
    adresse: "78 Boulevard Central, Abidjan",
    date: "14/05/2025",
    statut: "livrée",
    livreur: "Express Delivery",
    tracking: "EXP567891234",
  },
  {
    id: "LIV-004",
    commande: "CMD-004",
    client: "Groupe Gamma",
    adresse: "12 Zone Industrielle, Abidjan",
    date: "12/05/2025",
    statut: "en préparation",
    livreur: "Rapid Transport",
    tracking: "RT456789123",
  },
  {
    id: "LIV-005",
    commande: "CMD-006",
    client: "Société Beta",
    adresse: "34 Rue du Commerce, Abidjan",
    date: "07/05/2025",
    statut: "livrée",
    livreur: "Express Delivery",
    tracking: "EXP789123456",
  },
  {
    id: "LIV-006",
    commande: "CMD-007",
    client: "Camille Petit",
    adresse: "56 Avenue Résidentielle, Abidjan",
    date: "05/05/2025",
    statut: "en transit",
    livreur: "Rapid Transport",
    tracking: "RT321654987",
  },
]

export default function LivraisonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrer les livraisons en fonction de la recherche
  const filteredLivraisons = livraisons.filter(
    (livraison) =>
      livraison.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.tracking.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddLivraison = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'une livraison
    setTimeout(() => {
      setLoading(false)
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livraisons</h1>
          <p className="text-muted-foreground">Gérez les livraisons de vos commandes.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Truck className="mr-2 h-4 w-4" /> Ajouter une livraison
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle livraison</DialogTitle>
              <DialogDescription>Remplissez les informations pour créer une nouvelle livraison.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLivraison}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="commande">Commande</Label>
                  <Select>
                    <SelectTrigger id="commande">
                      <SelectValue placeholder="Sélectionnez une commande" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cmd001">CMD-001 - Martin Dubois</SelectItem>
                      <SelectItem value="cmd002">CMD-002 - Entreprise Alpha</SelectItem>
                      <SelectItem value="cmd004">CMD-004 - Groupe Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livreur">Service de livraison</Label>
                  <Select>
                    <SelectTrigger id="livreur">
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="express">Express Delivery</SelectItem>
                      <SelectItem value="rapid">Rapid Transport</SelectItem>
                      <SelectItem value="standard">Standard Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracking">Numéro de suivi</Label>
                  <Input id="tracking" placeholder="Ex: EXP123456789" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date de livraison prévue</Label>
                  <Input id="date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut de la livraison</Label>
                  <Select defaultValue="preparation">
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparation">En préparation</SelectItem>
                      <SelectItem value="transit">En transit</SelectItem>
                      <SelectItem value="livree">Livrée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes de livraison</Label>
                  <Textarea id="notes" placeholder="Instructions spéciales pour la livraison..." />
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
            placeholder="Rechercher une livraison..."
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
              <TableHead>Client</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Livreur</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLivraisons.length > 0 ? (
              filteredLivraisons.map((livraison) => (
                <TableRow key={livraison.id}>
                  <TableCell className="font-medium">{livraison.id}</TableCell>
                  <TableCell>{livraison.commande}</TableCell>
                  <TableCell>{livraison.client}</TableCell>
                  <TableCell>{livraison.adresse}</TableCell>
                  <TableCell>{livraison.date}</TableCell>
                  <TableCell>{livraison.livreur}</TableCell>
                  <TableCell>{livraison.tracking}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        livraison.statut === "livrée"
                          ? "bg-green-500"
                          : livraison.statut === "en transit"
                            ? "bg-blue-500"
                            : "bg-yellow-500 text-yellow-800"
                      }
                    >
                      {livraison.statut}
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
                        <DropdownMenuItem>Modifier le statut</DropdownMenuItem>
                        <DropdownMenuItem>Suivre la livraison</DropdownMenuItem>
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
                    <h3 className="text-lg font-medium">Aucune livraison trouvée</h3>
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
