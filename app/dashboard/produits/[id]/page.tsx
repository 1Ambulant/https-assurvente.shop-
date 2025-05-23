// app/dashboard/produits/[id]/page.tsx
import { notFound } from "next/navigation"
import { mongo } from "@/lib/mongodb"
import Image from "next/image"

export default async function VoirProduitPage({ params }: { params: { id: string } }) {
  const db = await mongo.connectToDb()
  const produit = await db.collection("produits").findOne({ _id: new (await import("mongodb")).ObjectId(params.id) })

  if (!produit) return notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">{produit.nom}</h1>
      <Image src={produit.image || "/placeholder.svg"} alt={produit.nom} width={200} height={200} />
      <p><strong>Prix :</strong> {produit.prix} XOF</p>
      <p><strong>Stock :</strong> {produit.stock}</p>
      <p><strong>Statut :</strong> {produit.statut}</p>
      <p><strong>Catégorie :</strong> {produit.categorie}</p>
      <p><strong>Marque :</strong> {produit.marque}</p>
      <p><strong>Description :</strong> {produit.description || "Aucune"}</p>
    </div>
  )
}
