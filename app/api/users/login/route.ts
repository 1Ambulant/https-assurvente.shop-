import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";

export async function POST(req: Request) {

    const error = validateApiKey(req);
    if (error) return error;

    try {
        const { email, motDePasse } = await req.json();
        const db = await mongo.connectToDb();

        const user = await db.collection("users").findOne({ email });

        if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
            return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ message: "Connexion réussie", token });
    } catch (error) {
        return NextResponse.json({ error: "Erreur login" }, { status: 500 });
    }
}
