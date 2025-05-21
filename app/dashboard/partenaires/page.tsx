"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"

import { Filter, MoreHorizontal, Plus, Search, Handshake, Check, X } from "lucide-react"
import { partenariatsAPI } from "@/lib/api"


export default function PartenairesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [partenaires, setPartenaires] = useState<any[]>([])

  const fetchPartenaires = async () => {
    try {
      const res = await partenariatsAPI.getAll()
      setPartenaires(res.data)
    } catch (error) {
      console.error("Erreur chargement partenaires :", error)
    }
  }

  useEffect(() => {
    fetchPartenaires()
  }, [])

  const filteredPartenaires = partenaires.filter(
    (p) =>
      p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPartenaire = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      const partenaire = {
        nom: formData.get("nom") as string,
        type: formData.get("type") as string,
        contact: formData.get("contact") as string,
        telephone: formData.get("telephone") as string,
        adresse: (formData.get("adresse") || "") as string,
        description: (formData.get("description") || "") as string,
        acces: {
          geolocalisation: formData.get("geolocalisation") === "on",
          controle: formData.get("controle") === "on",
          statistiques: formData.get("statistiques") === "on",
          clients: formData.get("clients") === "on",
        },
        statut: "actif" as const,
      }
      

      await partenariatsAPI.create(partenaire)
      fetchPartenaires()
      setAddDialogOpen(false)
      form.reset()
    } catch (err) {
      console.error("Erreur ajout partenaire :", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partenaires</h1>
          <p className="text-muted-foreground">Gérez vos partenaires commerciaux.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
              <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPartenaire}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" required />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type">
                      <SelectTrigger>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Email</Label>
                    <Input id="contact" name="contact" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" name="telephone" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" name="adresse" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Accès</Label>
                  <div className="flex flex-col space-y-2">
                    <div>
                      <Checkbox id="geolocalisation" name="geolocalisation" />
                      <Label htmlFor="geolocalisation" className="ml-2">Géolocalisation</Label>
                    </div>
                    <div>
                      <Checkbox id="controle" name="controle" />
                      <Label htmlFor="controle" className="ml-2">Contrôle</Label>
                    </div>
                    <div>
                      <Checkbox id="statistiques" name="statistiques" />
                      <Label htmlFor="statistiques" className="ml-2">Statistiques</Label>
                    </div>
                    <div>
                      <Checkbox id="clients" name="clients" />
                      <Label htmlFor="clients" className="ml-2">Clients</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartenaires.length > 0 ? (
              filteredPartenaires.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{p.nom.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>{p.nom}</div>
                    </div>
                  </TableCell>
                  <TableCell>{p.type}</TableCell>
                  <TableCell>{p.contact}</TableCell>
                  <TableCell>
                    <Badge className={p.statut === "actif" ? "bg-green-500" : "bg-gray-500"}>
                      {p.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Voir</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                  Aucun partenaire trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
