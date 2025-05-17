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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter, MoreHorizontal, Plus, Search, Handshake, Check, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const partenaires = [
  {
    id: "PAR-001",
    nom: "Assurance Générale SA",
    logo: "/placeholder.svg",
    initiales: "AG",
    contact: "contact@assurance-generale.com",
    telephone: "+225 01 23 45 67 89",
    type: "Assureur",
    statut: "actif",
    datePartenariat: "15/01/2023",
  },
  {
    id: "PAR-002",
    nom: "Banque Nationale",
    logo: "/placeholder.svg",
    initiales: "BN",
    contact: "partenariats@banque-nationale.com",
    telephone: "+225 01 98 76 54 32",
    type: "Banque",
    statut: "actif",
    datePartenariat: "22/02/2023",
  },
  {
    id: "PAR-003",
    nom: "Auto Premium Services",
    logo: "/placeholder.svg",
    initiales: "AP",
    contact: "info@autopremium.com",
    telephone: "+225 07 65 43 21 09",
    type: "Automobile",
    statut: "inactif",
    datePartenariat: "05/03/2023",
  },
  {
    id: "PAR-004",
    nom: "Clinique Santé Plus",
    logo: "/placeholder.svg",
    initiales: "CS",
    contact: "partenaires@santeplus.com",
    telephone: "+225 05 43 21 09 87",
    type: "Santé",
    statut: "actif",
    datePartenariat: "18/03/2023",
  },
  {
    id: "PAR-005",
    nom: "Immobilier Confort",
    logo: "/placeholder.svg",
    initiales: "IC",
    contact: "business@immobilier-confort.com",
    telephone: "+225 07 89 01 23 45",
    type: "Immobilier",
    statut: "actif",
    datePartenariat: "02/04/2023",
  },
  {
    id: "PAR-006",
    nom: "Voyage International",
    logo: "/placeholder.svg",
    initiales: "VI",
    contact: "partners@voyage-international.com",
    telephone: "+225 05 67 89 01 23",
    type: "Voyage",
    statut: "actif",
    datePartenariat: "10/04/2023",
  },
]

const demandesPartenariat = [
  {
    id: "DEM-001",
    nom: "Tech Solutions",
    logo: "/placeholder.svg",
    initiales: "TS",
    contact: "partnerships@techsolutions.com",
    telephone: "+225 01 23 45 67 89",
    type: "Technologie",
    dateCreation: "10/05/2025",
  },
  {
    id: "DEM-002",
    nom: "Éducation Plus",
    logo: "/placeholder.svg",
    initiales: "EP",
    contact: "contact@educationplus.com",
    telephone: "+225 07 65 43 21 09",
    type: "Éducation",
    dateCreation: "12/05/2025",
  },
]

export default function PartenairesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [accessDialogOpen, setAccessDialogOpen] = useState(false)
  const [selectedPartenaire, setSelectedPartenaire] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("partenaires")

  // Filtrer les partenaires en fonction de la recherche
  const filteredPartenaires = partenaires.filter(
    (partenaire) =>
      partenaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDemandes = demandesPartenariat.filter(
    (demande) =>
      demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPartenaire = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'ajout d'un partenaire
    setTimeout(() => {
      setLoading(false)
      setAddDialogOpen(false)
    }, 1500)
  }

  const handleAccessChange = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler la modification des accès
    setTimeout(() => {
      setLoading(false)
      setAccessDialogOpen(false)
    }, 1500)
  }

  const openAccessDialog = (id: string) => {
    setSelectedPartenaire(id)
    setAccessDialogOpen(true)
  }

  const handleApprove = (id: string) => {
    // Simuler l'approbation d'une demande de partenariat
    console.log(`Approuver la demande ${id}`)
  }

  const handleReject = (id: string) => {
    // Simuler le rejet d'une demande de partenariat
    console.log(`Rejeter la demande ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partenaires</h1>
          <p className="text-muted-foreground">Gérez vos partenaires commerciaux et leurs accès.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
              <DialogDescription>Remplissez les informations pour créer un nouveau partenariat.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPartenaire}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom de l'entreprise</Label>
                    <Input id="nom" placeholder="Nom de l'entreprise" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de partenaire</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assureur">Assureur</SelectItem>
                        <SelectItem value="banque">Banque</SelectItem>
                        <SelectItem value="automobile">Automobile</SelectItem>
                        <SelectItem value="sante">Santé</SelectItem>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="voyage">Voyage</SelectItem>
                        <SelectItem value="technologie">Technologie</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Email de contact</Label>
                    <Input id="contact" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" placeholder="+225 XX XX XX XX XX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" placeholder="Adresse complète" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du partenariat</Label>
                  <Textarea id="description" placeholder="Décrivez le partenariat..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>Accès au système</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-geolocalisation" />
                      <Label htmlFor="access-geolocalisation">Accès à la géolocalisation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-controle" />
                      <Label htmlFor="access-controle">Accès au contrôle à distance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-statistiques" />
                      <Label htmlFor="access-statistiques">Accès aux statistiques</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-clients" />
                      <Label htmlFor="access-clients">Accès aux données clients</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gérer les accès du partenaire</DialogTitle>
              <DialogDescription>
                Modifiez les accès accordés à{" "}
                {selectedPartenaire && partenaires.find((p) => p.id === selectedPartenaire)?.nom}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAccessChange}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Accès au système</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-geolocalisation-edit" defaultChecked />
                      <Label htmlFor="access-geolocalisation-edit">Accès à la géolocalisation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-controle-edit" />
                      <Label htmlFor="access-controle-edit">Accès au contrôle à distance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-statistiques-edit" defaultChecked />
                      <Label htmlFor="access-statistiques-edit">Accès aux statistiques</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="access-clients-edit" />
                      <Label htmlFor="access-clients-edit">Accès aux données clients</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveau-acces">Niveau d'accès</Label>
                  <Select defaultValue="read">
                    <SelectTrigger id="niveau-acces">
                      <SelectValue placeholder="Sélectionnez un niveau d'accès" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="write">Lecture/Écriture</SelectItem>
                      <SelectItem value="read">Lecture seule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-acces">Notes</Label>
                  <Textarea
                    id="notes-acces"
                    placeholder="Notes concernant les accès..."
                    className="min-h-[80px]"
                    defaultValue="Partenaire de confiance avec accès limité aux données."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAccessDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
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
            placeholder="Rechercher un partenaire..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>

      <Tabs defaultValue="partenaires" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="partenaires">
            <Handshake className="mr-2 h-4 w-4" />
            Partenaires actifs
          </TabsTrigger>
          <TabsTrigger value="demandes">
            <Plus className="mr-2 h-4 w-4" />
            Demandes de partenariat
            {demandesPartenariat.length > 0 && <Badge className="ml-2 bg-blue-600">{demandesPartenariat.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partenaires">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date de partenariat</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartenaires.length > 0 ? (
                  filteredPartenaires.map((partenaire) => (
                    <TableRow key={partenaire.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={partenaire.logo || "/placeholder.svg"} alt={partenaire.nom} />
                            <AvatarFallback>{partenaire.initiales}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{partenaire.nom}</div>
                            <div className="text-sm text-muted-foreground">{partenaire.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{partenaire.type}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{partenaire.contact}</div>
                          <div className="text-muted-foreground">{partenaire.telephone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{partenaire.datePartenariat}</TableCell>
                      <TableCell>
                        <Badge
                          variant={partenaire.statut === "actif" ? "default" : "secondary"}
                          className={partenaire.statut === "actif" ? "bg-green-500" : "bg-gray-500"}
                        >
                          {partenaire.statut}
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
                            <DropdownMenuItem onClick={() => openAccessDialog(partenaire.id)}>
                              Gérer les accès
                            </DropdownMenuItem>
                            <DropdownMenuItem>Contacter</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              {partenaire.statut === "actif" ? "Désactiver" : "Activer"}
                            </DropdownMenuItem>
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
                        <h3 className="text-lg font-medium">Aucun partenaire trouvé</h3>
                        <p className="text-sm text-gray-500">
                          Essayez de modifier vos critères de recherche ou ajoutez un nouveau partenaire.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="demandes">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date de demande</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemandes.length > 0 ? (
                  filteredDemandes.map((demande) => (
                    <TableRow key={demande.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={demande.logo || "/placeholder.svg"} alt={demande.nom} />
                            <AvatarFallback>{demande.initiales}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{demande.nom}</div>
                            <div className="text-sm text-muted-foreground">{demande.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{demande.type}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{demande.contact}</div>
                          <div className="text-muted-foreground">{demande.telephone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{demande.dateCreation}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(demande.id)}
                          >
                            <Check className="mr-1 h-4 w-4" /> Approuver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(demande.id)}
                          >
                            <X className="mr-1 h-4 w-4" /> Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <Handshake className="h-8 w-8 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium">Aucune demande de partenariat</h3>
                        <p className="text-sm text-gray-500">
                          Vous n'avez pas de demandes de partenariat en attente pour le moment.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
