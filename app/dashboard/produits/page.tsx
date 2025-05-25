"use client"

import { useEffect, useState } from "react"
import { produitsAPI } from "@/lib/api"
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
import { CommandeDialog } from "@/components/commande-dialog"

interface Produit {
  _id: string
  nom: string
  prix: number
  stock: number
  description?: string
  image?: string
  statut: string
  categorie: string
  marque: string
}


export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const [produits, setProduits] = useState<Produit[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null)

  useEffect(() => {
    const loadProduits = async () => {
      try {
        const response = await produitsAPI.getAll()
        setProduits(response.data)
      } catch (error) {
        console.error("Erreur de chargement des produits :", error)
      }
    }

    loadProduits()
  }, [])

  // Filtrer les produits en fonction des critères
  const filteredProducts = produits.filter((produit) => {
    const matchesSearch =
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit._id.toLowerCase().includes(searchTerm.toLowerCase())

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
        {typeof window !== "undefined" && localStorage.getItem("role") == "admin" && (
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/dashboard/produits/ajouter">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
            </Link>
          </Button>
        )}
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

      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((produit) => (
                <TableRow key={produit._id}>
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
                        <div className="text-sm text-muted-foreground">{produit._id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{produit.prix.toLocaleString()} XOF</TableCell>
                  <TableCell>
                    <Badge
                      variant={produit.statut === "en stock" ? "default" : "secondary"}
                      className={produit.statut === "en stock" ? "bg-green-500" : "bg-red-500"}
                    >
                      {produit.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof window !== "undefined" && localStorage.getItem("role") === "client" ? (
                      <CommandeDialog produit={produit} />
                    ) : (
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
                          <Link href={`/dashboard/produits/${produit._id}`}>
                            <DropdownMenuItem>Voir le produit</DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/produits/modifier/${produit._id}`}>
                            <DropdownMenuItem>Modifier le produit</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={async () => {
                              const confirmed = confirm("Voulez-vous vraiment supprimer ce produit ?");
                              if (!confirmed) return;
                              await fetch(`/api/produits/${produit._id}`, { method: "DELETE" });
                              window.location.reload();
                            }}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
