import { NextRequest, NextResponse } from "next/server"
import { mongo } from "@/lib/mongodb"

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const clientId = context.params.id;

  try {
    const db = await mongo.connectToDb();

    // Étape 1 : Trouver les commandes du client
    const commandes = await db
      .collection("commandes")
      .find({ clientId })
      .project({ _id: 1 })
      .toArray();

    const commandeIds = commandes.map(c => c._id?.toString());

    if (commandeIds.length === 0) {
      return NextResponse.json([]);
    }

    // Étape 2 : Chercher les paiements liés à ces commandes
    const paiements = await db
      .collection("paiements")
      .find({ commandeId: { $in: commandeIds } })
      .sort({ datePaiement: -1 })
      .toArray();

    return NextResponse.json(paiements);
  } catch (err) {
    console.error("Erreur chargement paiements client :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
