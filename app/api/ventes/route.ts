// /app/api/ventes/route.ts
import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

export async function GET(req: Request) {
  const db = await mongo.connectToDb()
  const ventes = await db.collection("ventes").find().toArray()
  return NextResponse.json(ventes)
}

export async function POST(req: Request) {
  const error = validateApiKey(req)
  if (error) return error

  try {
    const body = await req.json()
    const db = await mongo.connectToDb()

    const result = await db.collection("ventes").insertOne(body)
    return NextResponse.json({ insertedId: result.insertedId })
  } catch (err) {
    console.error("Erreur POST ventes:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
