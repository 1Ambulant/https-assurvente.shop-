import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Fonction utilitaire pour mapper le rôle à une collection MongoDB
function getCollectionName(role: string): string {
  if (role === "admin") return "users";
  if (role === "client") return "clients";
  if (role === "partenaire") return "partenaires";
  return role;
}

export async function GET(_: Request, context: { params: { role: string; id: string } }) {
  const { role, id } = context.params;
  const db = await mongo.connectToDb();
  const collection = getCollectionName(role);

  const user = await db.collection(collection).findOne({ _id: new ObjectId(id) });
  if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

  delete user.motDePasse;
  return NextResponse.json(user);
}

export async function PUT(req: Request, context: { params: { role: string; id: string } }) {
  const { role, id } = context.params;
  const data = await req.json();
  const db = await mongo.connectToDb();
  const collection = getCollectionName(role);

  await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: data });
  return NextResponse.json({ message: "Profil mis à jour" });
}

export async function PATCH(req: Request, context: { params: { role: string; id: string } }) {
  const { role, id } = context.params;
  const { currentPassword, newPassword } = await req.json();
  const db = await mongo.connectToDb();
  const collection = getCollectionName(role);

  const user = await db.collection(collection).findOne({ _id: new ObjectId(id) });
  if (!user || !(await bcrypt.compare(currentPassword, user.motDePasse))) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { motDePasse: hashed } });

  return NextResponse.json({ message: "Mot de passe mis à jour" });
}
