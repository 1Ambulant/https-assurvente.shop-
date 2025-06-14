"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { produitsAPI } from "@/lib/api"

export default function AjouterProduitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [nom, setNom] = useState("")
  const [prix, setPrix] = useState<number | null>(null)
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!nom || prix == null) {
      setError("Veuillez remplir tous les champs obligatoires")
      setLoading(false)
      return
    }

    try {
      // Récupérer l'ID et le rôle du partenaire depuis localStorage
      const partenaireId = localStorage.getItem("id")
      const role = localStorage.getItem("role")

      // Créer le produit avec les données de base
      const produitData = {
        nom,
        prix,
        description,
        image,
        partenaireIds: role === "partenaire" && partenaireId ? [partenaireId] : undefined
      }

      await produitsAPI.create(produitData)
      router.push("/dashboard/produits")
    } catch (err) {
      setError("Une erreur est survenue lors de la création du produit")
      console.error(err)
    } finally {
      setLoading(false)
    }
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
          <Button variant="outline" onClick={() => router.push("/dashboard/produits")}>Annuler</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
            {loading ? "Création en cours..." : "Créer le produit"}
          </Button>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Entrez les informations de base du produit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Assurance Auto Premium" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix</Label>
              <Input id="prix" type="number" value={prix ?? ''} onChange={(e) => setPrix(Number(e.target.value))} placeholder="Ex: 100000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description détaillée du produit..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Ex: https://example.com/image.jpg" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Création en cours..." : "Créer le produit"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
