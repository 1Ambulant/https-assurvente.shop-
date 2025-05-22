"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Lock, User } from "lucide-react"

export default function ParametresPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre compte et de l'application.</p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="profil">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="securite">
            <Lock className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          {/* <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger> */}
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
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, GIF ou PNG. 1MB maximum.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" defaultValue="Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" defaultValue="+225 01 23 45 67 89" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de vous..."
                  className="min-h-[100px]"
                  defaultValue="Agent commercial chez AssurVente depuis 2023."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
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
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </CardFooter>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs</CardTitle>
              <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification par SMS</Label>
                  <p className="text-sm text-muted-foreground">Recevez un code par SMS lors de la connexion.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification par application</Label>
                  <p className="text-sm text-muted-foreground">Utilisez une application d'authentification.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevez des notifications par email.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par SMS</Label>
                  <p className="text-sm text-muted-foreground">Recevez des notifications par SMS.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications dans l'application</Label>
                  <p className="text-sm text-muted-foreground">Recevez des notifications dans l'application.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="frequency">Fréquence des notifications</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Sélectionnez une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiate</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
