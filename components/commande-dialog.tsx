"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { commandesAPI } from "@/lib/api";

export function CommandeDialog({ produit }: { produit: { _id: string, nom: string, prix: number } }) {
  const [open, setOpen] = useState(false)
  const [quantite, setQuantite] = useState(1)
  const [echelonne, setEchelonne] = useState(false)
  const [mois, setMois] = useState(0)

  const getTauxEchelonnement = (montant: number) => {
    if (montant <= 150000) return 0.10; // +10%
    if (montant <= 300000) return 0.075; // +7.5%
    if (montant <= 500000) return 0.05; // +5%
    if (montant <= 750000) return 0.035;

    
    return 0.025; // +2.5%
  }

  const prixTotal = () => {
    let prix = produit.prix * quantite
    if (echelonne && mois > 0) {
      const taux = getTauxEchelonnement(prix);
      prix *= (1 + taux);
    }
    return Math.round(prix)
  }

  const commander = async () => {
    const clientId = localStorage.getItem("id")
    if (!clientId) {
      alert("Utilisateur non identifié.")
      return
    }

    try {
      // Récupérer les informations du profil
      const response = await fetch(`/api/profil/client/${clientId}`)
      const profilData = await response.json()

      const commande = {
        produitId: produit._id,
        clientId,
        quantite,
        montantTotal: prixTotal(),
        paiementEchelonne: echelonne,
        commande: `${profilData.prenom} ${profilData.nom} - ${produit.nom}`,
        statut: "preparation" as "preparation",
        paiement: "attente" as "attente",
        dateCommande: new Date().toISOString(),
        nombreEcheances: mois,
      }

      await commandesAPI.create(commande)
      setOpen(false)
      alert("Commande enregistrée !")
    } catch (err) {
      console.error("Erreur lors de la commande :", err)
      alert("Une erreur est survenue lors de l'enregistrement.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Commander</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commander {produit.nom}</DialogTitle>
          <DialogDescription>Remplissez les détails de votre commande</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Quantité</Label>
            <Input
              type="number"
              min={1}
              value={quantite}
              onChange={(e) => setQuantite(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="echelonne"
              checked={echelonne}
              onCheckedChange={(checked) => setEchelonne(checked === true)}
            />
            {echelonne && (
              <div>
                <Label htmlFor="mois">Nombre de mois</Label>
                <Input
                  id="mois"
                  type="number"
                  min={0}
                  max={24}
                  value={mois}
                  onChange={(e) => setMois(parseInt(e.target.value))}
                />
              </div>
            )}
            <Label htmlFor="echelonne">Payer en échelonné</Label>
          </div>
          <div className="font-semibold">
            Prix total : {prixTotal().toLocaleString()} XOF
          </div>
        </div>
        <DialogFooter>
          <Button onClick={commander}>Valider la commande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
