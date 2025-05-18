import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const body = await req.json();
        const db = await mongo.connectToDb();

        const existing = await db.collection("users").findOne({ email: body.email });
        if (existing) {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(body.motDePasse, 10);
        const result = await db.collection("users").insertOne({
            ...body,
            motDePasse: hashedPassword,
        });

        return NextResponse.json({ message: "Inscription réussie", insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Erreur inscription" }, { status: 500 });
    }
}
