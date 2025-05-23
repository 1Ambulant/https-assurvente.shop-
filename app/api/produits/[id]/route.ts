// /api/produits/[id]/route.ts
import { mongo } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Voir un produit
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await mongo.connectToDb();
  const produit = await db.collection("produits").findOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(produit);
}

// Modifier un produit
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await mongo.connectToDb();
  await db.collection("produits").updateOne({ _id: new ObjectId(params.id) }, { $set: body });
  return NextResponse.json({ message: "Produit modifié" });
}

// Supprimer un produit
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await mongo.connectToDb();
  await db.collection("produits").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ message: "Produit supprimé" });
}
