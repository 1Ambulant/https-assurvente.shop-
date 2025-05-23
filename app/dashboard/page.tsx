"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag, Users
} from "lucide-react"
import { VentesRecentes } from "@/components/dashboard/ventes-recentes"
import { CommandesRecentes } from "@/components/dashboard/commandes-recentes"
import { produitsAPI, clientsAPI, ventesAPI, partenariatsAPI } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    ventesTotal: 0,
    clients: 0,
    commandes: 0,
    partenaires: 0,
  })

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [produitsRes, clientsRes, commandesRes, partenairesRes] = await Promise.all([
          produitsAPI.getAll(),
          clientsAPI.getAll(),
          ventesAPI.getAll(),
          partenariatsAPI.getAll(),
        ])

        const ventesTotal = produitsRes.data.reduce((total: number, produit: any) => {
          return total + (produit.prix || 0)
        }, 0)

        setStats({
          ventesTotal,
          clients: clientsRes.data.length,
          commandes: commandesRes.data.length,
          partenaires: partenairesRes.data.length,
        })
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ventesTotal.toLocaleString()} XOF</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.commandes}</div>
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
