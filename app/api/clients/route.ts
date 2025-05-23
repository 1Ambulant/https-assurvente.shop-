import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { mongo } from "@/lib/mongodb"
import { validateApiKey } from "@/lib/verifyApiKey"

export async function POST(req: Request) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const body = await req.json();
    const db = await mongo.connectToDb();

    const existing = await db.collection("clients").findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("password", 10);
    const result = await db.collection("clients").insertOne({
      ...body,
      motDePasse: hashedPassword,
      role: "client"
    });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Erreur ajout client" }, { status: 500 });
  }
}


// 📦 GET tous les clients
export async function GET(req: Request) {
    const error = validateApiKey(req);
    if (error) return error;

    try {
        const db = await mongo.connectToDb();
        const clients = await db.collection("clients").find().toArray();
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement clients" }, { status: 500 });
    }
}
