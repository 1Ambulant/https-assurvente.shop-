// lib/validateApiKey.ts
import { NextResponse } from "next/server";

export function validateApiKey(request: Request): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { error: "⛔ Clé API invalide ou manquante (header requis)" },
      { status: 403 }
    );
  }

  return null;
}
