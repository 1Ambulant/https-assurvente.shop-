"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { clientsAPI } from "@/lib/api"

export interface Client {
  _id: string
  prenom: string
  nom: string
  initiales: string
  email: string
  telephone: string
  type: "Particulier" | "Entreprise"
  adresse?: string
  ville?: string
  pays?: string
  statut?: "actif" | "inactif"
}

function getInitials(nom: string, prenom: string): string {
  const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : ""
  const lastInitial = nom ? nom.charAt(0).toUpperCase() : ""
  return `${firstInitial}${lastInitial}`
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [adresse, setAdresse] = useState("")
  const [ville, setVille] = useState("")
  const [pays, setPays] = useState("sn")
  const [type, setType] = useState<"Particulier" | "Entreprise">("Particulier")
  const [statut, setStatut] = useState<"actif" | "inactif">("actif")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll()
      console.log("Clients récupérés :", response.data)
      setClients(response.data)
    } catch (error) {
      console.error("Erreur lors du chargement des clients :", error)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await clientsAPI.create({
        nom,
        prenom,
        email,
        telephone,
        adresse,
        ville,
        pays,
        type,
        statut,
      })

      setDialogOpen(false)
      fetchClients()
      // Réinitialiser le formulaire
      setNom("")
      setPrenom("")
      setEmail("")
      setTelephone("")
      setAdresse("")
      setVille("")
      setPays("sn")
      setType("Particulier")
      setStatut("actif")
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (client: Client) => {
    setEditingClient(client)
    setNom(client.nom)
    setPrenom(client.prenom)
    setEmail(client.email)
    setTelephone(client.telephone)
    setAdresse(client.adresse || "")
    setVille(client.ville || "")
    setPays(client.pays || "sn")
    setType(client.type)
    setStatut(client.statut || "actif")
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return

    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${editingClient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          adresse,
          ville,
          pays,
          type,
          statut,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de la modification")

      setEditDialogOpen(false)
      fetchClients()
      setEditingClient(null)
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Une erreur est survenue lors de la modification du client")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Confirmer la suppression de ce client ?")) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });

      if (res.ok) {
        setClients(clients.filter((c) => c._id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur serveur");
    }
  };

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
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau client</DialogTitle>
              <DialogDescription>Remplissez les informations pour créer un nouveau client.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de client</Label>
                    <Select value={type} onValueChange={(value) => setType(value as "Particulier" | "Entreprise")}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Particulier">Particulier</SelectItem>
                        <SelectItem value="Entreprise">Entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={statut} onValueChange={(value) => setStatut(value as "actif" | "inactif")}>
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
                    <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select value={pays} onValueChange={setPays}>
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
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client, index) => (
                <TableRow key={client._id || `${client.nom}-${client.email}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(client.nom, client.prenom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.prenom} {client.nom}</div>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(client)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClient(client._id)}
                          className="text-red-500"
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
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

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client. Cliquez sur enregistrer une fois terminé.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type de client</Label>
                  <Select value={type} onValueChange={(value) => setType(value as "Particulier" | "Entreprise")}>
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Particulier">Particulier</SelectItem>
                      <SelectItem value="Entreprise">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-statut">Statut</Label>
                  <Select value={statut} onValueChange={(value) => setStatut(value as "actif" | "inactif")}>
                    <SelectTrigger id="edit-statut">
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
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input id="edit-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input id="edit-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telephone">Téléphone</Label>
                <Input id="edit-telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-adresse">Adresse</Label>
                <Input id="edit-adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ville">Ville</Label>
                  <Input id="edit-ville" value={ville} onChange={(e) => setVille(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pays">Pays</Label>
                  <Select value={pays} onValueChange={setPays}>
                    <SelectTrigger id="edit-pays">
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
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
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
  )
}
