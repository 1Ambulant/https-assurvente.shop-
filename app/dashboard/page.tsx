"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight, Bell, DollarSign, ShoppingBag, Users, MapPin, Handshake
} from "lucide-react"
import { VentesRecentes } from "@/components/dashboard/ventes-recentes"
import { CommandesRecentes } from "@/components/dashboard/commandes-recentes"
import { GraphiqueVentes } from "@/components/dashboard/graphique-ventes"
import { GraphiqueCategories } from "@/components/dashboard/graphique-categories"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    ventesTotal: 0,
    clients: 0,
    commandes: 0,
    conversion: 0,
    partenaires: 0,
    demandes: 0,
  })

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Erreur chargement stats dashboard", error)
      }
    }

    fetchDashboardStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre tableau de bord AssurVente.</p>
        </div>
      </div>

      <Tabs defaultValue="apercu" className="space-y-4">
        <TabsContent value="apercu" className="space-y-4">
          {/* Statistiques principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ventesTotal.toLocaleString()} XOF</div>
                <p className="text-xs text-muted-foreground">+18% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clients}</div>
                <p className="text-xs text-muted-foreground">+201 depuis la dernière semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.commandes}</div>
                <p className="text-xs text-muted-foreground">12 en attente de livraison</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversion}%</div>
                <p className="text-xs text-muted-foreground">+5.1% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Aperçu des ventes</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <GraphiqueVentes />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Ventes par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <GraphiqueCategories />
              </CardContent>
            </Card>
          </div>

          {/* Accès rapide */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Géolocalisation</CardTitle>
                <CardDescription>Suivez vos produits, clients et livreurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/geolocalisation">Accéder à la géolocalisation</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contrôle à distance</CardTitle>
                <CardDescription>Gérez vos appareils connectés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-sm">Interface de contrôle</p>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/controle">Accéder au contrôle</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Partenaires</CardTitle>
                <CardDescription>Gérez vos partenaires commerciaux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Handshake className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-sm font-medium">{stats.partenaires} partenaires actifs</p>
                    <p className="text-xs text-gray-500">{stats.demandes} demandes en attente</p>
                  </div>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/partenaires">Gérer les partenaires</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historique */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ventes récentes</CardTitle>
                <CardDescription>Historique des dernières ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <VentesRecentes />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Commandes en cours de traitement</CardDescription>
              </CardHeader>
              <CardContent>
                <CommandesRecentes />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
