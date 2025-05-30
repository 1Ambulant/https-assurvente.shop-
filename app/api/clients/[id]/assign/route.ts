import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    const { partenaireId } = await req.json();

    // Vérifier si le client existe
    const client = await db.collection("clients").findOne({ _id: new ObjectId(params.id) });
    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    // Vérifier si le partenaire existe
    const partenaire = await db.collection("partenaires").findOne({ _id: new ObjectId(partenaireId) });
    if (!partenaire) {
      return NextResponse.json({ error: "Partenaire non trouvé" }, { status: 404 });
    }

    // Mettre à jour le client avec l'ID du partenaire
    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { partenaireId: partenaireId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client assigné avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'assignation du client:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 