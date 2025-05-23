"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { produitsAPI } from "@/lib/api"

export default function ModifierProduitPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [nom, setNom] = useState("")
  const [prix, setPrix] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await fetch(`/api/produits/${id}`)
        const data = await res.json()
        setNom(data.nom)
        setPrix(data.prix)
        setStock(data.stock)
        setDescription(data.description || "")
        setImage(data.image || "")
      } catch (err) {
        console.error("Erreur chargement produit :", err)
      }
    }

    fetchProduit()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await produitsAPI.update(id, {
        nom,
        prix,
        stock,
        description,
        image
      })

      router.push("/dashboard/produits")
    } catch (error) {
      console.error("Erreur lors de la modification :", error)
      alert("Erreur lors de la modification.")
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
          <h1 className="text-3xl font-bold tracking-tight">Modifier le produit</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/produits")}>Annuler</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du produit</CardTitle>
            <CardDescription>Modifiez les informations du produit existant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (XOF)</Label>
              <Input id="prix" type="number" value={prix ?? ''} onChange={(e) => setPrix(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Quantité en stock</Label>
              <Input id="stock" type="number" value={stock ?? ''} onChange={(e) => setStock(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Lien de l'image</Label>
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Modification..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
