import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey"

// ➕ Ajouter un paiement
export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const body = await req.json();
        const db = await mongo.connectToDb();
        const result = await db.collection("paiements").insertOne(body);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur ajout paiement" }, { status: 500 });
    }
}

// 💵 Obtenir les paiements
export async function GET(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;
    
    try {
        const db = await mongo.connectToDb();
        const paiements = await db.collection("paiements").find().toArray();
        return NextResponse.json(paiements);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement paiements" }, { status: 500 });
    }
}
