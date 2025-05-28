// app/api/clients/[id]/route.ts
import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    const updates = await req.json();

    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    const result = await db.collection("clients").deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Client supprimé" });
    } else {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
