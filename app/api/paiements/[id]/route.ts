import { NextRequest, NextResponse } from "next/server";
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

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const error = validateApiKey(req);
  if (error) return error;

  const paiementId = context.params.id;

  try {
    const db = await mongo.connectToDb();
    const collection = db.collection("paiements");

    const updateData = await req.json();


    // 🔎 Récupérer l'ancien document
    const paiement = await collection.findOne({ _id: new ObjectId(paiementId) });
    if (!paiement) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    // 💰 Ajouter au paiement déjà effectué
    const montantAjoute = updateData.montantPaye ?? 0;
    const montantTotalPaye = (paiement.montantPaye ?? 0) + montantAjoute;
    const nouveauReste = paiement.montantInitial - montantTotalPaye;

    const nouveauStatut = nouveauReste <= 0 ? "termine" : "en_cours";

    const updateFields = {
      montantPaye: montantTotalPaye,
      resteAPayer: nouveauReste,
      statut: updateData.statut ?? nouveauStatut,
      ...(updateData.datePaiement && { datePaiement: updateData.datePaiement }),
    };

    // ✅ Mise à jour dans MongoDB
    await collection.updateOne(
      { _id: new ObjectId(paiementId) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, updated: updateFields });
  } catch (err) {
    console.error("Erreur update paiement :", err);
    return NextResponse.json({ error: "Erreur mise à jour paiement" }, { status: 500 });
  }
}

