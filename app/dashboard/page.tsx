import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Bell, DollarSign, ShoppingBag, Users, MapPin, Handshake } from "lucide-react"
import { VentesRecentes } from "@/components/dashboard/ventes-recentes"
import { CommandesRecentes } from "@/components/dashboard/commandes-recentes"
import { GraphiqueVentes } from "@/components/dashboard/graphique-ventes"
import { GraphiqueCategories } from "@/components/dashboard/graphique-categories"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre tableau de bord AssurVente.</p>
        </div>
        {/*<div className="flex items-center gap-2">
          <Button variant="outline">Télécharger le rapport</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Ajouter un produit</Button>
        </div>*/}
      </div>

      <Tabs defaultValue="apercu" className="space-y-4">


        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345,678 XOF</div>
                <p className="text-xs text-muted-foreground">+18% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 depuis la dernière semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">12 en attente de livraison</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.3%</div>
                <p className="text-xs text-muted-foreground">+5.1% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>

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

          {/* Accès rapides aux fonctionnalités principales */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Géolocalisation</CardTitle>
                <CardDescription>Suivez vos produits, clients et livreurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center relative">
                  <div className="absolute inset-0">
                    <div className="absolute top-[30%] left-[40%]">
                      <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute top-[45%] left-[60%]">
                      <div className="h-3 w-3 bg-green-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute top-[55%] left-[35%]">
                      <div className="h-3 w-3 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-3 gap-2 w-full px-4">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-green-500 mb-1"></div>
                      <p className="text-xs text-center">Réfrigérateur</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-red-500 mb-1"></div>
                      <p className="text-xs text-center">Climatiseur</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-green-500 mb-1"></div>
                      <p className="text-xs text-center">TV</p>
                    </div>
                  </div>
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
                    <p className="text-sm font-medium">6 partenaires actifs</p>
                    <p className="text-xs text-gray-500">2 demandes en attente</p>
                  </div>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/partenaires">Gérer les partenaires</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ventes récentes</CardTitle>
                <CardDescription>Vous avez effectué 265 ventes ce mois-ci.</CardDescription>
              </CardHeader>
              <CardContent>
                <VentesRecentes />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Vous avez 45 commandes en cours.</CardDescription>
              </CardHeader>
              <CardContent>
                <CommandesRecentes />
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-600">Rappel!</AlertTitle>
            <AlertDescription>
              Vous avez 5 commandes à expédier aujourd'hui, 3 paiements à confirmer et 2 produits à localiser.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
