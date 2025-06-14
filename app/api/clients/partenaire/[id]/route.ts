import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    
    // Récupérer les clients qui ont ce partenaire dans leur tableau partenaireIds
    const clients = await db
      .collection("clients")
      .find({ partenaireIds: params.id })
      .toArray();

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 