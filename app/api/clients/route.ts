import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

// 📦 GET tous les clients
export async function GET(req: Request) {
    const error = validateApiKey(req);
    if (error) return error;

    try {
        const db = await mongo.connectToDb();
        const clients = await db.collection("clients").find().toArray();
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: "Erreur chargement clients" }, { status: 500 });
    }
}

// ➕ POST un client
export async function POST(req: Request) {
    const error = validateApiKey(req);
    if (error) return error;

    try {
        const body = await req.json();
        const db = await mongo.connectToDb();
        const result = await db.collection("clients").insertOne(body);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur ajout client" }, { status: 500 });
    }
}
