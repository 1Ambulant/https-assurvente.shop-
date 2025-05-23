import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongo from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const db = await mongo.connectToDb();
    const result = await db.collection("paiements").deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Paiement supprimé" });
  } catch (err) {
    console.error("Erreur suppression paiement :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
