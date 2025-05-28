import { NextRequest, NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string; numero: string } }
) {
  const error = validateApiKey(req);
  if (error) return error;

  const paiementId = context.params.id;
  const numero = parseInt(context.params.numero);

  try {
    const updateData = await req.json();
    const db = await mongo.connectToDb();
    const collection = db.collection("paiements");

    const paiement = await collection.findOne({ _id: new ObjectId(paiementId) });
    if (!paiement) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    const echeances = paiement.echeances || [];
    const index = echeances.findIndex((e: any) => e.numero === numero);
    if (index === -1) {
      return NextResponse.json({ error: "Échéance non trouvée" }, { status: 404 });
    }

    // 🧮 Mise à jour de l’échéance
    echeances[index] = {
      ...echeances[index],
      ...updateData,
    };

    // 🧮 Nouveau montant payé total
    const montantAjoute = updateData.montantPaye ?? 0;
    const montantPaye = (paiement.montantPaye ?? 0) + montantAjoute;
    const resteAPayer = paiement.montantInitial - montantPaye;

    // ✅ Statut global : terminé si toutes les échéances sont payées
    const allEcheancesPayees = echeances.every((e: any) => e.statut === "paye");
    const statutGlobal = allEcheancesPayees ? "termine" : "en_cours";

    console.log("montantPaye", montantPaye, "resteAPayer", resteAPayer, "statutGlobal", statutGlobal);

    // 🛠️ Mise à jour complète
    await collection.updateOne(
      { _id: new ObjectId(paiementId) },
      {
        $set: {
          echeances,
          montantPaye,
          resteAPayer,
          statut: statutGlobal,
        },
      }
    );

    return NextResponse.json({
      success: true,
      updatedEcheance: echeances[index],
      newMontantPaye: montantPaye,
      newResteAPayer: resteAPayer,
      statut: statutGlobal,
    });
  } catch (err) {
    console.error("Erreur update échéance :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
