// /api/partenaires/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const body = await req.json();
    const db = await mongo.connectToDb();

    const existing = await db.collection("partenaires").findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    const result = await db.collection("partenaires").insertOne({
      ...body,
      motDePasse: hashedPassword,
      datePartenariat: new Date().toISOString().split("T")[0],
      role: "partenaire",
    });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Erreur ajout partenaire" }, { status: 500 });
  }
}

export async function GET() {
  const db = await mongo.connectToDb();
  const partenaires = await db.collection("partenaires").find().toArray();
  return NextResponse.json(partenaires);
}

export async function PUT(req: Request) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const { _id, ...data } = await req.json();
    const db = await mongo.connectToDb();

    await db.collection("partenaires").updateOne(
      { _id: new ObjectId(_id) },
      { $set: data }
    );

    return NextResponse.json({ message: "Partenaire mis à jour" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur mise à jour partenaire" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const { id } = await req.json();
    const db = await mongo.connectToDb();

    await db.collection("partenaires").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Partenaire supprimé" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur suppression partenaire" }, { status: 500 });
  }
}