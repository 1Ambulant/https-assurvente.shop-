"use client"

import { useEffect, useState } from "react"
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
import { Filter, MoreHorizontal, Search, ShoppingBag } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ventesAPI, produitsAPI, clientsAPI, commandesAPI } from "@/lib/api"
import { AxiosResponse } from "axios"

interface Client {
  _id: string
  nom: string
  prenom: string
}

interface Produit {
  _id: string
  nom: string
  prix: number
}

export interface Commande {
  _id?: string
  clientId: string
  produitId: string
  quantite: number
  montantTotal: number
  paiement: "attente" | "paye" | "rembourse"
  statut: "preparation" | "expediee" | "livree" | "annulee"
  dateCommande: string
  paiementEchelonne?: boolean
  nombreEcheances?: number
  acompteInitial?: number
  commande?: string
}

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"add" | "edit">("add")
  const [loading, setLoading] = useState(false)
  const [commande, setCommande] = useState<string>("")

  const [clients, setClients] = useState<Client[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [commandes, setCommandes] = useState<Commande[]>([])

  const [clientId, setClientId] = useState("")
  const [produitId, setProduitId] = useState("")
  const [quantite, setQuantite] = useState(1)
  const [paiement, setPaiement] = useState<Commande["paiement"]>("attente")
  const [statut, setStatut] = useState<Commande["statut"]>("preparation")
  const [paiementEchelonne, setPaiementEchelonne] = useState(false)
  const [nombreEcheances, setNombreEcheances] = useState(1)
  const [commandeAEditer, setCommandeAEditer] = useState<Commande | null>(null)

  const [ventesTotal, setVentesTotal] = useState(0)

  const getTauxEchelonnement = (montant: number) => {
    if (montant <= 150000) return 0.10; // +10%
    if (montant <= 300000) return 0.075; // +7.5%
    if (montant <= 500000) return 0.05; // +5%
    if (montant <= 750000) return 0.035; // +3.5%
    return 0.025; // +2.5%
  }

  const resetForm = () => {
    setClientId("")
    setProduitId("")
    setQuantite(1)
    setPaiement("attente")
    setStatut("preparation")
    setPaiementEchelonne(false)
    setNombreEcheances(1)
    setCommandeAEditer(null)
  }

  const handleOpenDialog = (type: "add" | "edit") => {
    setDialogType(type)
    if (type === "add") {
      resetForm()
    }
    setDialogOpen(true)
  }

  useEffect(() => {
    const fetchAll = async () => {
      const [cmdRes, prodRes, clientRes] = await Promise.all([
        commandesAPI.getAll(),
        produitsAPI.getAll(),
        clientsAPI.getAll(),
      ])
      setCommandes(cmdRes.data)
      setProduits(prodRes.data)
      setClients(clientRes.data)

      // Calculer la somme totale des ventes
      const total = cmdRes.data.reduce((sum: any, commande: { montantTotal: any }) => sum + commande.montantTotal, 0)
      setVentesTotal(total)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (commandeAEditer) {
      setClientId(commandeAEditer.clientId)
      setProduitId(commandeAEditer.produitId)
      setQuantite(commandeAEditer.quantite)
      setPaiement(commandeAEditer.paiement)
      setStatut(commandeAEditer.statut)
      setPaiementEchelonne(commandeAEditer.paiementEchelonne || false)
      setNombreEcheances(commandeAEditer.nombreEcheances || 1)
      handleOpenDialog("edit")
    }
  }, [commandeAEditer])

  const handleAddCommande = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const produit = produits.find(p => p._id === produitId)
    const client = clients.find(c => c._id === clientId)

    if (!produit || !client) {
      alert("Client ou produit introuvable.")
      return
    }

    let montant = produit.prix * quantite;

    if (paiementEchelonne && nombreEcheances > 1) {
      const taux = getTauxEchelonnement(montant);
      montant *= (1 + taux);
    }

    const nouvelleCommande: Omit<Commande, "_id"> & { commande: string } = {
      clientId,
      produitId,
      quantite,
      montantTotal: Math.round(montant),
      paiement,
      statut,
      dateCommande: commandeAEditer?.dateCommande || new Date().toISOString(),
      paiementEchelonne,
      ...(paiementEchelonne ? { nombreEcheances } : {}),
      commande: `${client.prenom} ${client.nom} - ${produit.nom}`,
    }

    try {
      let res: AxiosResponse<any, any>
      if (commandeAEditer?._id) {
        res = await commandesAPI.update(commandeAEditer._id, nouvelleCommande)
        setCommandes(prev =>
          prev.map(c => c._id === commandeAEditer._id ? res.data : c)
        )
      } else {
        res = await commandesAPI.create(nouvelleCommande)
        setCommandes(prev => [...prev, res.data])
      }

      setDialogOpen(false)
      setCommandeAEditer(null)
      // Réinitialiser les champs du formulaire
      setClientId("")
      setProduitId("")
      setQuantite(1)
      setPaiement("attente")
      setStatut("preparation")
      setPaiementEchelonne(false)
      setNombreEcheances(1)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const filteredCommandes = commandes.filter((c) => {
    const client = clients.find(cl => cl._id === c.clientId);
    const produit = produits.find(p => p._id === c.produitId);

    const clientNomComplet = client ? `${client.prenom} ${client.nom}`.toLowerCase() : "";
    const produitNom = produit ? produit.nom.toLowerCase() : "";

    return (
      c.commande?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientNomComplet.includes(searchTerm.toLowerCase()) ||
      produitNom.includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">Gérez les ventes de vos clients.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{dialogType === "add" ? "Nouvelle commande" : "Modifier la commande"}</DialogTitle>
              <DialogDescription>
                {dialogType === "add" ? "Remplissez les informations nécessaires." : "Modifiez les informations de la commande."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCommande}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez un client" /></SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client._id} value={client._id}>{client.prenom} {client.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Produit</Label>
                  <Select value={produitId} onValueChange={setProduitId}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez un produit" /></SelectTrigger>
                    <SelectContent>
                      {produits.map(produit => (
                        <SelectItem key={produit._id} value={produit._id}>{produit.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input type="number" value={quantite} min="1" onChange={e => setQuantite(+e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select defaultValue="preparation" onValueChange={v => setStatut(v as Commande["statut"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Préparation</SelectItem>
                        <SelectItem value="expediee">Expédiée</SelectItem>
                        <SelectItem value="livree">Livrée</SelectItem>
                        <SelectItem value="annulee">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Paiement</Label>
                  <Select value={paiement} onValueChange={v => setPaiement(v as Commande["paiement"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="paye">Payé</SelectItem>
                      <SelectItem value="rembourse">Remboursé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paiement échelonné ?</Label>
                <Select value={paiementEchelonne ? "oui" : "non"} onValueChange={(v) => setPaiementEchelonne(v === "oui")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paiementEchelonne && (
                <div className="space-y-4">
                  <Label>Nombre d'échéances</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={nombreEcheances}
                    onChange={(e) => setNombreEcheances(+e.target.value)}
                  />
                </div>
              )}

              <DialogFooter >
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une commande..."
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
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Paiement échelonné</TableHead>
              <TableHead>Échéances</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommandes.map((commande) => (
              <TableRow key={commande._id}>
                <TableCell>{commande._id}</TableCell>
                <TableCell>
                  {clients.find(c => c._id === commande.clientId)
                    ? `${clients.find(c => c._id === commande.clientId)?.prenom} ${clients.find(c => c._id === commande.clientId)?.nom}`
                    : "?"}
                </TableCell>
                <TableCell>{produits.find(p => p._id === commande.produitId)?.nom || "?"}</TableCell>
                <TableCell>{commande.montantTotal} XOF</TableCell>
                <TableCell>{new Date(commande.dateCommande).toLocaleDateString()}</TableCell>
                <TableCell><Badge>{commande.statut}</Badge></TableCell>
                <TableCell><Badge>{commande.paiement}</Badge></TableCell>
                <TableCell>
                  {commande.paiementEchelonne ? (
                    <Badge className="bg-yellow-500 text-white">Oui</Badge>
                  ) : (
                    <Badge className="bg-gray-300 text-black">Non</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {commande.paiementEchelonne ? commande.nombreEcheances : "-"}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setCommandeAEditer(commande);
                        }}
                      >
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={async () => {
                          const confirmed = confirm("Voulez-vous vraiment supprimer cette commande ?");
                          if (!confirmed || !commande._id) return;

                          try {
                            await commandesAPI.remove(commande._id);
                            alert("Commande supprimée avec succès");
                            window.location.reload();
                          } catch (err) {
                            console.error("Erreur suppression :", err);
                            alert("Erreur lors de la suppression");
                          }
                        }}
                      >
                        Supprimer
                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
