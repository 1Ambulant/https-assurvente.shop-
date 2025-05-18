import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await mongo.connectToDb();
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      status: "✅ Connexion MongoDB réussie",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error);
    return NextResponse.json(
      { status: "❌ Connexion échouée", error: (error as Error).message },
      { status: 500 }
    );
  }
}
