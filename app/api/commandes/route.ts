import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

// ➕ Ajouter une commande
export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const body = await req.json();
        const db = await mongo.connectToDb();
        const result = await db.collection("commandes").insertOne(body);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur ajout commande" }, { status: 500 });
    }
}

// 📦 Obtenir les commandes
export async function GET(req: Request) {
    const error = validateApiKey(req);
    if (error) return error;

    try {
        const db = await mongo.connectToDb();
        const commandes = await db.collection("commandes").find().toArray();
        return NextResponse.json(commandes);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement commandes" }, { status: 500 });
    }
}
