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
  Avatar, AvatarFallback
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Plus } from "lucide-react"
import { partenariatsAPI } from "@/lib/api"

export default function PartenairesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [partenaires, setPartenaires] = useState<any[]>([])
  const [editingPartenaire, setEditingPartenaire] = useState<any | null>(null)

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

  const handleSavePartenaire = async (e: React.FormEvent) => {
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
      }

      if (editingPartenaire) {
        await partenariatsAPI.update(editingPartenaire._id, partenaire)
      } else {
        await partenariatsAPI.create(partenaire)
      }

      await fetchPartenaires()
      setDialogOpen(false)
      setEditingPartenaire(null)
      form.reset()
    } catch (err) {
      console.error("Erreur sauvegarde partenaire :", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Voulez-vous vraiment supprimer ce partenaire ?")
    if (!confirmed) return

    try {
      await partenariatsAPI.remove(id)
      await fetchPartenaires()
    } catch (err) {
      console.error("Erreur suppression partenaire :", err)
    }
  }

  const filteredPartenaires = partenaires.filter((p) =>
    p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partenaires</h1>
          <p className="text-muted-foreground">Gérez vos partenaires commerciaux.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingPartenaire(null)
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {editingPartenaire ? "Modifier" : "Ajouter"} un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPartenaire ? "Modifier le partenaire" : "Ajouter un nouveau partenaire"}</DialogTitle>
              <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSavePartenaire}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" required defaultValue={editingPartenaire?.nom || ""} />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue={editingPartenaire?.type || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automobile">Automobile</SelectItem>
                        <SelectItem value="sante">Santé</SelectItem>
                        <SelectItem value="boutique">Boutique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Email</Label>
                    <Input id="contact" name="contact" type="email" required defaultValue={editingPartenaire?.contact || ""} />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" name="telephone" required defaultValue={editingPartenaire?.telephone || ""} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" name="adresse" defaultValue={editingPartenaire?.adresse || ""} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={3} defaultValue={editingPartenaire?.description || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Accès</Label>
                  <div className="flex flex-col space-y-2">
                    {['geolocalisation', 'controle', 'statistiques', 'clients'].map((acces) => (
                      <div key={acces}>
                        <Checkbox
                          id={acces}
                          name={acces}
                          defaultChecked={editingPartenaire?.acces?.[acces] || false}
                        />
                        <Label htmlFor={acces} className="ml-2 capitalize">{acces}</Label>
                      </div>
                    ))}
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setEditingPartenaire(p)
                          setDialogOpen(true)
                        }}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(p._id)}>
                          Supprimer
                        </DropdownMenuItem>
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
