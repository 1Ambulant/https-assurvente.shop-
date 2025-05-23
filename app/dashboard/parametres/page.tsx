"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Lock, User } from "lucide-react"

export default function ParametresPage() {
  const [loading, setLoading] = useState(false)
  const [profil, setProfil] = useState({ prenom: "", nom: "", email: "", telephone: "", bio: "" })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const loadProfil = async () => {
      console.log("Chargement du profil...")
      const role = localStorage.getItem("role")
      const id = localStorage.getItem("id")
      if (!role || !id) return

      const res = await fetch(`/api/profil/${role}/${id}`)
      const data = await res.json()
      console.log("Profil chargé :", data)
      setProfil(data)
    }

    loadProfil()
  }, [])

  const handleProfilUpdate = async () => {
    setLoading(true)
    const role = localStorage.getItem("role")
    const id = localStorage.getItem("id")
    await fetch(`/api/profil/${role}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profil),
    })
    setLoading(false)
    alert("Profil mis à jour")
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) return alert("Les mots de passe ne correspondent pas")
    setLoading(true)
    const role = localStorage.getItem("role")
    const id = localStorage.getItem("id")
    const res = await fetch(`/api/profil/${role}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    setLoading(false)
    if (res.ok) {
      alert("Mot de passe mis à jour")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      alert("Erreur : mot de passe actuel incorrect")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre compte et de l'application.</p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="profil">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="securite">
            <Lock className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-user.jpg" alt="Photo de profil" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Changer la photo</Button>
                  <p className="text-sm text-muted-foreground">JPG, GIF ou PNG. 1MB maximum.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" value={profil.prenom} onChange={(e) => setProfil({ ...profil, prenom: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={profil.nom} onChange={(e) => setProfil({ ...profil, nom: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profil.email} onChange={(e) => setProfil({ ...profil, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" value={profil.telephone} onChange={(e) => setProfil({ ...profil, telephone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={profil.bio} onChange={(e) => setProfil({ ...profil, bio: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleProfilUpdate} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="securite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mot de passe</CardTitle>
              <CardDescription>Changez votre mot de passe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
