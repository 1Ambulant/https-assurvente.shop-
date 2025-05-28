import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    
    // Récupérer les commandes du partenaire
    const commandes = await db
      .collection("commandes")
      .find({ partenaireId: params.id })
      .toArray();

    // Extraire les IDs des clients uniques
    const clientIds = [...new Set(commandes.map(cmd => cmd.clientId))];

    // Récupérer les informations des clients
    const clients = await db
      .collection("clients")
      .find({ _id: { $in: clientIds.map(id => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 