// /api/commandes/[id]/route.ts
import { NextResponse } from "next/server"
import { mongo } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { validateApiKey } from "@/lib/verifyApiKey"

export async function PUT(req: Request, { params }: { params: { id: string } }) {

  const error = validateApiKey(req)
  if (error) return error

  try {
    const body = await req.json()
    const db = await mongo.connectToDb()

    const result = await db.collection("commandes").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Aucune modification effectuée." }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const error = validateApiKey(req)
  if (error) return error

  try {
    const db = await mongo.connectToDb()
    const result = await db.collection("commandes").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ message: "Commande supprimée" })
  } catch (error) {
    console.error("Erreur suppression commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
