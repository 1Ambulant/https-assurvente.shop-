"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Facebook, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

export default function ConnexionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const motDePasse = (document.getElementById("password") as HTMLInputElement).value;
  
    try {
      const res = await fetch("/api/users/login?api_key=super-cle-api-123456", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, motDePasse })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      console.log("Connexion réussie", data);
  
      // ✅ Stocker le token dans localStorage
      localStorage.setItem("token", data.token);
  
      // ✅ Rediriger
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M12 11V3" />
                <path d="M12 3H8" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">assurvente.shop</h1>
          <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
        </div>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="exemple@email.com" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="#" className="text-sm text-blue-600 hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Se souvenir de moi
                </Label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
