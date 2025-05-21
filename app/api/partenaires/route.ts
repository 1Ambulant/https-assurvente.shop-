import { NextResponse } from "next/server"
import { mongo } from "@/lib/mongodb"

export async function POST(req: Request) {
  const body = await req.json()
  const db = await mongo.connectToDb()
  const result = await db.collection("partenaires").insertOne({
    ...body,
    datePartenariat: new Date().toISOString().split("T")[0],
  })

  return NextResponse.json({ insertedId: result.insertedId })
}

export async function GET() {
  const db = await mongo.connectToDb()
  const partenaires = await db.collection("partenaires").find().toArray()
  return NextResponse.json(partenaires)
}
