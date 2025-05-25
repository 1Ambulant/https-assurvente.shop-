"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, MapPin, Search, Truck, User, Store, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GeolocalisationPage() {
  const [activeTab, setActiveTab] = useState("clients")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const clientsData = [
    {
      id: 1,
      nom: "Martin Dubois",
      initiales: "MD",
      adresse: "123 Rue Principale, Abidjan",
      distance: 2.5,
      status: "actif",
    },
    {
      id: 2,
      nom: "Sophie Lefebvre",
      initiales: "SL",
      adresse: "78 Boulevard Central, Abidjan",
      distance: 3.8,
      status: "actif",
    },
    {
      id: 3,
      nom: "Thomas Moreau",
      initiales: "TM",
      adresse: "45 Avenue des Fleurs, Abidjan",
      distance: 5.2,
      status: "actif",
    },
    {
      id: 4,
      nom: "Camille Petit",
      initiales: "CP",
      adresse: "56 Rue du Commerce, Abidjan",
      distance: 7.1,
      status: "inactif",
    },
    {
      id: 5,
      nom: "Entreprise Alpha",
      initiales: "EA",
      adresse: "12 Zone Industrielle, Abidjan",
      distance: 8.4,
      status: "actif",
    },
  ]

  const livreursData = [
    { id: 1, nom: "Jean Kouassi", initiales: "JK", vehicule: "Camionnette #1", status: "en livraison", commandes: 3 },
    { id: 2, nom: "Marie Konan", initiales: "MK", vehicule: "Moto #2", status: "disponible", commandes: 0 },
    { id: 3, nom: "Amina Diallo", initiales: "AD", vehicule: "Camionnette #3", status: "en livraison", commandes: 2 },
    { id: 4, nom: "Paul Ouattara", initiales: "PO", vehicule: "Moto #4", status: "en pause", commandes: 0 },
  ]

  const magasinsData = [
    { id: 1, nom: "Magasin Central", adresse: "10 Avenue du Commerce, Abidjan", status: "ouvert", stock: 125 },
    { id: 2, nom: "Dépôt Nord", adresse: "45 Zone Industrielle, Abidjan", status: "ouvert", stock: 87 },
    { id: 3, nom: "Showroom Plateau", adresse: "22 Rue des Banques, Abidjan", status: "ouvert", stock: 43 },
  ]

  const produitsData = [
    {
      id: "PROD-001",
      nom: "Réfrigérateur Samsung Side by Side",
      client: "Martin Dubois",
      adresse: "123 Rue Principale, Abidjan",
      dateVente: "15/05/2025",
      status: "actif",
      batterie: 85,
    },
    {
      id: "PROD-002",
      nom: "Machine à laver LG 8kg",
      client: "Sophie Lefebvre",
      adresse: "78 Boulevard Central, Abidjan",
      dateVente: "12/05/2025",
      status: "actif",
      batterie: 92,
    },
    {
      id: "PROD-003",
      nom: "Climatiseur Daikin Inverter",
      client: "Entreprise Alpha",
      adresse: "12 Zone Industrielle, Abidjan",
      dateVente: "14/05/2025",
      status: "inactif",
      batterie: 23,
    },
    {
      id: "PROD-004",
      nom: "Smart TV LG",
      client: "Thomas Moreau",
      adresse: "45 Avenue des Fleurs, Abidjan",
      dateVente: "08/05/2025",
      status: "actif",
      batterie: 78,
    },
    {
      id: "PROD-005",
      nom: "Micro-ondes Panasonic",
      client: "Camille Petit",
      adresse: "56 Rue du Commerce, Abidjan",
      dateVente: "03/05/2025",
      status: "actif",
      batterie: 65,
    },
  ]

  // Filtrer les données en fonction de la recherche et de la catégorie
  const filteredClients = clientsData.filter(
    (client) =>
      (client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.adresse.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" ||
        (filterCategory === "actif" ? client.status === "actif" : client.status === "inactif")),
  )

  const filteredLivreurs = livreursData.filter(
    (livreur) =>
      (livreur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livreur.vehicule.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" ||
        (filterCategory === "en livraison"
          ? livreur.status === "en livraison"
          : filterCategory === "disponible"
            ? livreur.status === "disponible"
            : livreur.status === "en pause")),
  )

  const filteredMagasins = magasinsData.filter(
    (magasin) =>
      (magasin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        magasin.adresse.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" || filterCategory === magasin.status),
  )

  const filteredProduits = produitsData.filter(
    (produit) =>
      (produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.adresse.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" || filterCategory === produit.status),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Géolocalisation</h1>
        <p className="text-muted-foreground">
          Visualisez la localisation de vos clients, livreurs, magasins et produits.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une adresse..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {activeTab === "clients" && (
                <>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </>
              )}
              {activeTab === "livreurs" && (
                <>
                  <SelectItem value="en livraison">En livraison</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en pause">En pause</SelectItem>
                </>
              )}
              {activeTab === "magasins" && (
                <>
                  <SelectItem value="ouvert">Ouvert</SelectItem>
                  <SelectItem value="fermé">Fermé</SelectItem>
                </>
              )}
              {activeTab === "produits" && (
                <>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setFilterCategory("all")}>
            <Filter className="mr-2 h-4 w-4" /> Réinitialiser
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="clients"
        onValueChange={(value) => {
          setActiveTab(value)
          setFilterCategory("all")
        }}
      >
        <TabsList>
          <TabsTrigger value="produits">
            <Package className="mr-2 h-4 w-4" />
            Produits
          </TabsTrigger>
          <TabsTrigger value="livreurs">
            <Truck className="mr-2 h-4 w-4" />
            Livreurs
          </TabsTrigger>
          <TabsTrigger value="magasins">
            <Store className="mr-2 h-4 w-4" />
            Magasins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="livreurs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="h-[500px] relative">
                <CardHeader>
                  <CardTitle>Carte des livreurs</CardTitle>
                  <CardDescription>Suivez vos livreurs en temps réel.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] bg-gray-100 flex items-center justify-center relative">
                    {/* Carte simulée avec des points représentant les livreurs */}
                    <div className="absolute inset-0">
                      <div className="absolute top-[35%] left-[45%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-ping"></div>
                      </div>
                      <div className="absolute top-[50%] left-[30%]">
                        <div className="h-4 w-4 bg-yellow-500 rounded-full animate-ping"></div>
                      </div>
                      <div className="absolute top-[25%] left-[60%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-ping"></div>
                      </div>
                      <div className="absolute top-[65%] left-[55%]">
                        <div className="h-4 w-4 bg-gray-400 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="text-center z-10 bg-white/80 p-4 rounded-lg">
                      <Truck className="h-12 w-12 mx-auto text-blue-600" />
                      <p className="mt-2 text-gray-500">Carte interactive</p>
                      <p className="text-sm text-gray-400">Affichage des {activeTab}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>Liste des livreurs</CardTitle>
                  <CardDescription>Livreurs en service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-auto max-h-[380px]">
                  {filteredLivreurs.length > 0 ? (
                    filteredLivreurs.map((livreur) => (
                      <div key={livreur.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-600">{livreur.initiales}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{livreur.nom}</h3>
                          <p className="text-sm text-gray-500">{livreur.vehicule}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-400">
                              {livreur.commandes > 0
                                ? `${livreur.commandes} commande${livreur.commandes > 1 ? "s" : ""} en cours`
                                : "Aucune commande"}
                            </p>
                            <Badge
                              className={
                                livreur.status === "en livraison"
                                  ? "bg-green-500"
                                  : livreur.status === "disponible"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500 text-yellow-800"
                              }
                            >
                              {livreur.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">Aucun livreur trouvé</h3>
                      <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="magasins" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="h-[500px] relative">
                <CardHeader>
                  <CardTitle>Carte des magasins</CardTitle>
                  <CardDescription>Visualisez l'emplacement de vos magasins et dépôts.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] bg-gray-100 flex items-center justify-center relative">
                    {/* Carte simulée avec des points représentant les magasins */}
                    <div className="absolute inset-0">
                      <div className="absolute top-[40%] left-[50%]">
                        <div className="h-6 w-6 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="absolute top-[30%] left-[30%]">
                        <div className="h-5 w-5 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="absolute top-[60%] left-[45%]">
                        <div className="h-5 w-5 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center z-10 bg-white/80 p-4 rounded-lg">
                      <Store className="h-12 w-12 mx-auto text-blue-600" />
                      <p className="mt-2 text-gray-500">Carte interactive</p>
                      <p className="text-sm text-gray-400">Affichage des {activeTab}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>Liste des magasins</CardTitle>
                  <CardDescription>Points de vente et dépôts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-auto max-h-[380px]">
                  {filteredMagasins.length > 0 ? (
                    filteredMagasins.map((magasin) => (
                      <div key={magasin.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <Store className="h-9 w-9 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-medium">{magasin.nom}</h3>
                          <p className="text-sm text-gray-500">{magasin.adresse}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-400">{magasin.stock} produits en stock</p>
                            <Badge
                              variant={magasin.status === "ouvert" ? "default" : "secondary"}
                              className={magasin.status === "ouvert" ? "bg-green-500" : "bg-red-500"}
                            >
                              {magasin.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">Aucun magasin trouvé</h3>
                      <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="produits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="h-[500px] relative">
                <CardHeader>
                  <CardTitle>Carte des produits</CardTitle>
                  <CardDescription>Localisez vos produits équipés de puces de géolocalisation.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] bg-gray-100 flex items-center justify-center relative">
                    {/* Carte simulée avec des points représentant les produits */}
                    <div className="absolute inset-0">
                      <div className="absolute top-[30%] left-[40%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-[45%] left-[60%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-[55%] left-[35%]">
                        <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-[25%] left-[55%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-[60%] left-[50%]">
                        <div className="h-4 w-4 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-center z-10 bg-white/80 p-4 rounded-lg">
                      <Package className="h-12 w-12 mx-auto text-blue-600" />
                      <p className="mt-2 text-gray-500">Carte interactive</p>
                      <p className="text-sm text-gray-400">Affichage des {activeTab}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>Liste des produits</CardTitle>
                  <CardDescription>Produits équipés de puces de géolocalisation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-auto max-h-[380px]">
                  {filteredProduits.length > 0 ? (
                    filteredProduits.map((produit) => (
                      <div key={produit.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <Package className="h-9 w-9 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-medium">{produit.nom}</h3>
                          <p className="text-sm text-gray-500">
                            {produit.client} - {produit.adresse}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1">
                              <div
                                className={`h-2 w-2 rounded-full ${produit.batterie > 50 ? "bg-green-500" : produit.batterie > 20 ? "bg-yellow-500" : "bg-red-500"}`}
                              ></div>
                              <p className="text-xs text-gray-400">Batterie: {produit.batterie}%</p>
                            </div>
                            <Badge
                              variant={produit.status === "actif" ? "default" : "secondary"}
                              className={produit.status === "actif" ? "bg-green-500" : "bg-red-500"}
                            >
                              {produit.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">Aucun produit trouvé</h3>
                      <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
