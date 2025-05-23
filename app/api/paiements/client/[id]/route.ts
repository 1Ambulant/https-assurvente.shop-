// /app/api/paiements/client/[id]/route.ts
import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await mongo.connectToDb();
    const paiements = await db
      .collection("paiements")
      .find({ clientId: params.id })
      .toArray();

    return NextResponse.json(paiements);
  } catch (err) {
    return NextResponse.json({ error: "Erreur chargement paiements" }, { status: 500 });
  }
}