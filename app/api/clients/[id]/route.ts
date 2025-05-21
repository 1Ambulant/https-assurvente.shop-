// app/api/clients/[id]/route.ts
import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
