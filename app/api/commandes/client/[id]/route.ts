import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    const commandes = await db
      .collection("commandes")
      .find({ clientId: params.id })
      .toArray();

    return NextResponse.json(commandes);
  } catch (err) {
    return NextResponse.json({ error: "Erreur chargement commandes" }, { status: 500 });
  }
}
