// /api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongo } from "@/lib/mongodb";
import { validateApiKey } from "@/lib/verifyApiKey";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const error = validateApiKey(req);
  if (error) return error;

  try {
    const { email, motDePasse } = await req.json();
    const db = await mongo.connectToDb();

    const collections = ["users", "clients", "partenaires"];
    let user = null;
    let fromCollection = null;

    for (const collection of collections) {
      const u = await db.collection(collection).findOne({ email });
      if (u) {
        user = u;
        fromCollection = collection;
        break;
      }
    }

    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        collection: fromCollection,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    (await cookies()).set("token", token, {
      httpOnly: false,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      id : user._id,
      message: "Connexion réussie",
      token,
      role: user.role,
      nom: user.nom,
    });
  } catch (err) {
    return NextResponse.json({ error: "Erreur login" }, { status: 500 });
  }
}
