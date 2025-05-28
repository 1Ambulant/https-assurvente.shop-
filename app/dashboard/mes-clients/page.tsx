"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Client {
  _id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  type: "Particulier" | "Entreprise"
  adresse?: string
  ville?: string
  pays?: string
}

export default function MesClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const router = useRouter()

  // États pour le formulaire d'édition
  const [editForm, setEditForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    type: "Particulier" as "Particulier" | "Entreprise",
    adresse: "",
    ville: "",
    pays: "",
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const partenaireId = localStorage.getItem("id")
        if (!partenaireId) {
          router.push("/connexion")
          return
        }

        const response = await fetch(`/api/clients/partenaire/${partenaireId}`)
        if (!response.ok) throw new Error("Erreur lors de la récupération des clients")
        
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [router])

  const handleEditClick = (client: Client) => {
    setEditingClient(client)
    setEditForm({
      prenom: client.prenom,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      type: client.type,
      adresse: client.adresse || "",
      ville: client.ville || "",
      pays: client.pays || "",
    })
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return

    try {
      const response = await fetch(`/api/clients/${editingClient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) throw new Error("Erreur lors de la modification")

      // Mettre à jour la liste des clients
      setClients(clients.map(client => 
        client._id === editingClient._id 
          ? { ...client, ...editForm }
          : client
      ))

      setEditDialogOpen(false)
      setEditingClient(null)
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Une erreur est survenue lors de la modification du client")
    }
  }

  const filteredClients = clients.filter((client) =>
    `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Clients</h1>
          <p className="text-muted-foreground">Liste de vos clients et leurs informations.</p>
        </div>
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
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client._id}>
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
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(client)}>
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client. Cliquez sur enregistrer une fois terminé.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={editForm.prenom}
                  onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={editForm.nom}
                  onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={editForm.telephone}
                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as "Particulier" | "Entreprise" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Entreprise">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={editForm.adresse}
                onChange={(e) => setEditForm({ ...editForm, adresse: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={editForm.ville}
                  onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  value={editForm.pays}
                  onChange={(e) => setEditForm({ ...editForm, pays: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 