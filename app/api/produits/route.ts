import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

// ➕ Ajouter un produit
export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const body = await req.json();
        const db = await mongo.connectToDb();
        const result = await db.collection("produits").insertOne(body);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur ajout produit" }, { status: 500 });
    }
}

// 📦 Obtenir la liste des produits
export async function GET() {
    try {
        const db = await mongo.connectToDb();
        const produits = await db.collection("produits").find().toArray();
        return NextResponse.json(produits);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement produits" }, { status: 500 });
    }
}
