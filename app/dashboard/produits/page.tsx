"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const produitsData = [
  {
    id: "PROD-001",
    nom: "Réfrigérateur Samsung Side by Side",
    image: "/placeholder.svg?height=40&width=40",
    prix: "450,000 XOF",
    statut: "en stock",
    categorie: "Réfrigérateurs",
    marque: "Samsung",
    stock: 15,
  },
  {
    id: "PROD-002",
    nom: "Machine à laver LG 8kg",
    image: "/placeholder.svg?height=40&width=40",
    prix: "325,000 XOF",
    statut: "en stock",
    categorie: "Machines à laver",
    marque: "LG",
    stock: 8,
  },
  {
    id: "PROD-003",
    nom: "Climatiseur Daikin Inverter",
    image: "/placeholder.svg?height=40&width=40",
    prix: "275,000 XOF",
    statut: "en stock",
    categorie: "Climatiseurs",
    marque: "Daikin",
    stock: 12,
  },
  {
    id: "PROD-004",
    nom: "Cuisinière à gaz Bosch 4 feux",
    image: "/placeholder.svg?height=40&width=40",
    prix: "185,000 XOF",
    statut: "rupture",
    categorie: "Cuisinières",
    marque: "Bosch",
    stock: 0,
  },
  {
    id: "PROD-005",
    nom: "Micro-ondes Panasonic",
    image: "/placeholder.svg?height=40&width=40",
    prix: "95,000 XOF",
    statut: "en stock",
    categorie: "Micro-ondes",
    marque: "Panasonic",
    stock: 20,
  },
  {
    id: "PROD-006",
    nom: "Lave-vaisselle Whirlpool",
    image: "/placeholder.svg?height=40&width=40",
    prix: "375,000 XOF",
    statut: "en stock",
    categorie: "Lave-vaisselles",
    marque: "Whirlpool",
    stock: 5,
  },
  {
    id: "PROD-007",
    nom: "Congélateur Haier 300L",
    image: "/placeholder.svg?height=40&width=40",
    prix: "295,000 XOF",
    statut: "rupture",
    categorie: "Congélateurs",
    marque: "Haier",
    stock: 0,
  },
  {
    id: "PROD-008",
    nom: "Four électrique Moulinex",
    image: "/placeholder.svg?height=40&width=40",
    prix: "125,000 XOF",
    statut: "en stock",
    categorie: "Fours",
    marque: "Moulinex",
    stock: 10,
  },
]

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  // Filtrer les produits en fonction des critères
  const filteredProducts = produitsData.filter((produit) => {
    const matchesSearch =
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory ? produit.categorie === selectedCategory : true
    const matchesStatus = selectedStatus ? produit.statut === selectedStatus : true
    const matchesBrand = selectedBrand ? produit.marque === selectedBrand : true

    return matchesSearch && matchesCategory && matchesStatus && matchesBrand
  })

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCategory(null)
    setSelectedStatus(null)
    setSelectedBrand(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits électroménagers.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/dashboard/produits/ajouter">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtrer
              {(selectedCategory || selectedStatus || selectedBrand) && (
                <Badge className="ml-2 bg-blue-600" variant="secondary">
                  {[selectedCategory, selectedStatus, selectedBrand].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filtrer les produits</DialogTitle>
              <DialogDescription>Sélectionnez les critères pour filtrer la liste des produits.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={selectedCategory || "all"} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Réfrigérateurs">Réfrigérateurs</SelectItem>
                    <SelectItem value="Machines à laver">Machines à laver</SelectItem>
                    <SelectItem value="Climatiseurs">Climatiseurs</SelectItem>
                    <SelectItem value="Cuisinières">Cuisinières</SelectItem>
                    <SelectItem value="Micro-ondes">Micro-ondes</SelectItem>
                    <SelectItem value="Lave-vaisselles">Lave-vaisselles</SelectItem>
                    <SelectItem value="Congélateurs">Congélateurs</SelectItem>
                    <SelectItem value="Fours">Fours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={selectedStatus || "all"} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en stock">En stock</SelectItem>
                    <SelectItem value="rupture">Rupture de stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Marque</label>
                <Select value={selectedBrand || "all"} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les marques" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les marques</SelectItem>
                    <SelectItem value="Samsung">Samsung</SelectItem>
                    <SelectItem value="LG">LG</SelectItem>
                    <SelectItem value="Daikin">Daikin</SelectItem>
                    <SelectItem value="Bosch">Bosch</SelectItem>
                    <SelectItem value="Panasonic">Panasonic</SelectItem>
                    <SelectItem value="Whirlpool">Whirlpool</SelectItem>
                    <SelectItem value="Haier">Haier</SelectItem>
                    <SelectItem value="Moulinex">Moulinex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setFilterOpen(false)}>
                Appliquer les filtres
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((produit) => (
                <TableRow key={produit.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={produit.image || "/placeholder.svg"}
                        alt={produit.nom}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <div className="font-medium">{produit.nom}</div>
                        <div className="text-sm text-muted-foreground">{produit.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{produit.categorie}</TableCell>
                  <TableCell>{produit.prix}</TableCell>
                  <TableCell>{produit.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={produit.statut === "en stock" ? "default" : "secondary"}
                      className={produit.statut === "en stock" ? "bg-green-500" : "bg-red-500"}
                    >
                      {produit.statut}
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
                        <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Aucun produit trouvé</h3>
                    <p className="text-sm text-gray-500">
                      Essayez de modifier vos critères de recherche ou de filtrage.
                    </p>
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
