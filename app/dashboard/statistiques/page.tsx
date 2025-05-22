"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

export default function StatistiquesPage() {
  const formatMontant = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M XOF`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">Analysez les performances de vos ventes et clients.</p>
        </div>
        <Select defaultValue="2025">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez une année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="ventes">
        <TabsList>
          <TabsTrigger value="ventes">Ventes</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="ventes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345,678 XOF</div>
                <p className="text-xs text-muted-foreground">+18% par rapport à l'année précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nombre de ventes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+24% par rapport à l'année précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valeur moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245,000 XOF</div>
                <p className="text-xs text-muted-foreground">+5% par rapport à l'année précédente</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventes mensuelles</CardTitle>
                <CardDescription>Évolution des ventes sur l'année</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={[
                      { name: "Jan", total: 1500000 },
                      { name: "Fév", total: 1800000 },
                      { name: "Mar", total: 2200000 },
                      { name: "Avr", total: 2500000 },
                      { name: "Mai", total: 3100000 },
                      { name: "Juin", total: 3500000 },
                      { name: "Juil", total: 3200000 },
                      { name: "Août", total: 3800000 },
                      { name: "Sep", total: 4000000 },
                      { name: "Oct", total: 4500000 },
                      { name: "Nov", total: 4300000 },
                      { name: "Déc", total: 4800000 },
                    ]}
                  >
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatMontant}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      activeDot={{
                        r: 6,
                        style: { fill: "#0ea5e9", opacity: 0.25 },
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">+15% par rapport à l'année précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+28% par rapport à l'année précédente</p>
              </CardContent>
            </Card>

          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Acquisition de clients</CardTitle>
                <CardDescription>Nouveaux clients par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={[
                      { name: "Jan", total: 45 },
                      { name: "Fév", total: 38 },
                      { name: "Mar", total: 52 },
                      { name: "Avr", total: 48 },
                      { name: "Mai", total: 61 },
                      { name: "Juin", total: 55 },
                      { name: "Juil", total: 42 },
                      { name: "Août", total: 38 },
                      { name: "Sep", total: 48 },
                      { name: "Oct", total: 55 },
                      { name: "Nov", total: 43 },
                      { name: "Déc", total: 48 },
                    ]}
                  >
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="produits" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 5 des produits par volume de ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Assurance Auto Premium", total: 450 },
                      { name: "Assurance Habitation Standard", total: 380 },
                      { name: "Assurance Santé Famille", total: 320 },
                      { name: "Assurance Vie Complète", total: 280 },
                      { name: "Assurance Professionnelle PME", total: 250 },
                    ]}
                  >
                    <XAxis type="number" stroke="#888888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} width={150} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenus par produit</CardTitle>
                <CardDescription>Top 5 des produits par chiffre d'affaires</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Assurance Professionnelle PME", total: 3800000 },
                      { name: "Assurance Vie Complète", total: 3200000 },
                      { name: "Assurance Auto Premium", total: 2800000 },
                      { name: "Assurance Santé Famille", total: 2500000 },
                      { name: "Assurance Habitation Standard", total: 1800000 },
                    ]}
                  >
                    <XAxis type="number" stroke="#888888" fontSize={12} tickFormatter={formatMontant} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} width={150} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
