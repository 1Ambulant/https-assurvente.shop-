import { NextRequest } from "next/server"
import { mongo } from "@/lib/mongodb"


import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;

  try {
    const db = await mongo.connectToDb();

    // Étape 2 : Rechercher les paiements liés aux ObjectId
    const paiements = await db
      .collection("paiements")
      .find({ clientId: clientId }) // match ObjectId
      .sort({ datePaiement: -1 })
      .toArray();

    console.log("Paiements:", paiements);

    return Response.json(paiements);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

