"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const clients = [
  {
    id: "CLI-001",
    nom: "Martin Dubois",
    initiales: "MD",
    email: "martin.dubois@example.com",
    telephone: "+225 01 23 45 67 89",
    statut: "actif",
    type: "Particulier",
    dateInscription: "15/01/2025",
  },
  {
    id: "CLI-002",
    nom: "Entreprise Alpha",
    initiales: "EA",
    email: "contact@alpha.com",
    telephone: "+225 01 98 76 54 32",
    statut: "actif",
    type: "Entreprise",
    dateInscription: "22/02/2025",
  },
  {
    id: "CLI-003",
    nom: "Sophie Lefebvre",
    initiales: "SL",
    email: "sophie.lefebvre@example.com",
    telephone: "+225 07 65 43 21 09",
    statut: "inactif",
    type: "Particulier",
    dateInscription: "05/03/2025",
  },
  {
    id: "CLI-004",
    nom: "Groupe Gamma",
    initiales: "GG",
    email: "info@gamma-group.com",
    telephone: "+225 05 43 21 09 87",
    statut: "actif",
    type: "Entreprise",
    dateInscription: "18/03/2025",
  },
  {
    id: "CLI-005",
    nom: "Thomas Moreau",
    initiales: "TM",
    email: "thomas.moreau@example.com",
    telephone: "+225 07 89 01 23 45",
    statut: "actif",
    type: "Particulier",
    dateInscription: "02/04/2025",
  },
  {
    id: "CLI-006",
    nom: "Société Beta",
    initiales: "SB",
    email: "contact@beta-societe.com",
    telephone: "+225 05 67 89 01 23",
    statut: "actif",
    type: "Entreprise",
    dateInscription: "10/04/2025",
  },
  {
    id: "CLI-007",
    nom: "Camille Petit",
    initiales: "CP",
    email: "camille.petit@example.com",
    telephone: "+225 01 45 67 89 01",
    statut: "inactif",
    type: "Particulier",
    dateInscription: "25/04/2025",
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrer les clients en fonction de la recherche
  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone.includes(searchTerm) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'un client
    setTimeout(() => {
      setLoading(false)
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau client</DialogTitle>
              <DialogDescription>Remplissez les informations pour créer un nouveau client.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de client</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="particulier">Particulier</SelectItem>
                        <SelectItem value="entreprise">Entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select defaultValue="actif">
                      <SelectTrigger id="statut">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="inactif">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" placeholder="Prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" placeholder="Nom" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="exemple@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" placeholder="+225 XX XX XX XX XX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" placeholder="Adresse complète" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input id="ville" placeholder="Ville" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select defaultValue="ci">
                      <SelectTrigger id="pays">
                        <SelectValue placeholder="Sélectionnez un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                        <SelectItem value="sn">Sénégal</SelectItem>
                        <SelectItem value="cm">Cameroun</SelectItem>
                        <SelectItem value="bf">Burkina Faso</SelectItem>
                        <SelectItem value="ml">Mali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">{client.initiales}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.nom}</div>
                        <div className="text-sm text-muted-foreground">{client.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.email}</div>
                      <div className="text-muted-foreground">{client.telephone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{client.dateInscription}</TableCell>
                  <TableCell>
                    <Badge
                      variant={client.statut === "actif" ? "default" : "secondary"}
                      className={client.statut === "actif" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {client.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Contacter</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Désactiver</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Aucun client trouvé</h3>
                    <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
