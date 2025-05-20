// lib/validateApiKey.ts
import { NextResponse } from "next/server";

export function validateApiKey(request: Request): NextResponse | null {
  const url = new URL(request.url);
  const apiKey = url.searchParams.get("api_key");
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { error: "⛔ Clé API invalide ou manquante" },
      { status: 403 }
    );
  }

  return null;
}
