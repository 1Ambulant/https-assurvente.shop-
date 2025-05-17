"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function AjouterProduitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'un produit
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard/produits")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/produits">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un produit</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/produits")}>
            Annuler
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer le produit"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="prix">Prix et stock</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="specifications">Spécifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Entrez les informations de base du produit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du produit</Label>
                <Input id="nom" placeholder="Ex: Réfrigérateur Samsung Side by Side" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input id="reference" placeholder="Ex: REF-SAMSUNG-001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select>
                  <SelectTrigger id="categorie">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refrigerateurs">Réfrigérateurs</SelectItem>
                    <SelectItem value="machines-a-laver">Machines à laver</SelectItem>
                    <SelectItem value="climatiseurs">Climatiseurs</SelectItem>
                    <SelectItem value="cuisinieres">Cuisinières</SelectItem>
                    <SelectItem value="micro-ondes">Micro-ondes</SelectItem>
                    <SelectItem value="lave-vaisselles">Lave-vaisselles</SelectItem>
                    <SelectItem value="congelateurs">Congélateurs</SelectItem>
                    <SelectItem value="fours">Fours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marque">Marque</Label>
                <Select>
                  <SelectTrigger id="marque">
                    <SelectValue placeholder="Sélectionnez une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="lg">LG</SelectItem>
                    <SelectItem value="whirlpool">Whirlpool</SelectItem>
                    <SelectItem value="bosch">Bosch</SelectItem>
                    <SelectItem value="daikin">Daikin</SelectItem>
                    <SelectItem value="panasonic">Panasonic</SelectItem>
                    <SelectItem value="haier">Haier</SelectItem>
                    <SelectItem value="moulinex">Moulinex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez le produit en détail..." className="min-h-[150px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prix et stock</CardTitle>
              <CardDescription>Définissez les informations de prix et de stock.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix (XOF)</Label>
                  <Input id="prix" type="number" placeholder="Ex: 450000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prix-promo">Prix promotionnel (XOF)</Label>
                  <Input id="prix-promo" type="number" placeholder="Ex: 425000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantité en stock</Label>
                  <Input id="stock" type="number" placeholder="Ex: 15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select>
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-stock">En stock</SelectItem>
                      <SelectItem value="rupture">Rupture de stock</SelectItem>
                      <SelectItem value="precommande">Précommande</SelectItem>
                      <SelectItem value="discontinue">Discontinué</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Unité de gestion des stocks)</Label>
                <Input id="sku" placeholder="Ex: REFRIG-SS-001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garantie">Garantie (mois)</Label>
                <Input id="garantie" type="number" placeholder="Ex: 24" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images du produit</CardTitle>
              <CardDescription>Ajoutez des images pour présenter le produit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="mx-auto flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <h3 className="text-lg font-semibold">Déposez vos images ici</h3>
                  <p className="text-sm text-gray-500">Glissez-déposez des fichiers ou cliquez pour parcourir</p>
                  <Button variant="outline" className="mt-2">
                    Parcourir les fichiers
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">Image 1</span>
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">Image 2</span>
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">Image 3</span>
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">Image 4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spécifications techniques</CardTitle>
              <CardDescription>Ajoutez les caractéristiques techniques du produit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (cm)</Label>
                <Input id="dimensions" placeholder="Ex: 178 x 90 x 74" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poids">Poids (kg)</Label>
                <Input id="poids" type="number" placeholder="Ex: 85" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="couleur">Couleur</Label>
                <Select>
                  <SelectTrigger id="couleur">
                    <SelectValue placeholder="Sélectionnez une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blanc">Blanc</SelectItem>
                    <SelectItem value="noir">Noir</SelectItem>
                    <SelectItem value="gris">Gris</SelectItem>
                    <SelectItem value="inox">Inox</SelectItem>
                    <SelectItem value="argent">Argent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="energie">Classe énergétique</Label>
                <Select>
                  <SelectTrigger id="energie">
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-plus-plus-plus">A+++</SelectItem>
                    <SelectItem value="a-plus-plus">A++</SelectItem>
                    <SelectItem value="a-plus">A+</SelectItem>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caracteristiques">Caractéristiques supplémentaires</Label>
                <Textarea
                  id="caracteristiques"
                  placeholder="Listez les caractéristiques supplémentaires..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer le produit"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
