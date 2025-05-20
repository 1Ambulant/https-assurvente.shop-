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
import { produitsAPI } from "@/lib/api"

export default function AjouterProduitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!nom || prix == null || stock == null) {
        alert("Veuillez remplir tous les champs requis.");
        setLoading(false);
        return;
      }

      await produitsAPI.create({
        nom,
        prix,
        stock,
        description,
        image
      });

      router.push("/dashboard/produits")
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
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
            {loading ? "Enregistrement..." : "Enregistrer le produit"}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Entrez les informations de base du produit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Réfrigérateur Samsung" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (XOF)</Label>
              <Input id="prix" type="number" value={prix ?? ''} onChange={(e) => setPrix(Number(e.target.value))} placeholder="Ex: 450000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Quantité en stock</Label>
              <Input id="stock" type="number" value={stock ?? ''} onChange={(e) => setStock(Number(e.target.value))} placeholder="Ex: 10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez le produit en détail..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Lien de l'image</Label>
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer le produit"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
