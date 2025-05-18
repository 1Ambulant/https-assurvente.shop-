import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

// 📦 GET tous les utilisateurs
export async function GET(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const db = await mongo.connectToDb();
        const users = await db.collection("users").find().toArray();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement utilisateurs" }, { status: 500 });
    }
}

// ➕ POST nouvel utilisateur
export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;
    
    try {
        const body = await req.json();
        const db = await mongo.connectToDb();
        const result = await db.collection("users").insertOne(body);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur ajout utilisateur" }, { status: 500 });
    }
}
