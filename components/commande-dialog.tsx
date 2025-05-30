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
import { commandesAPI, paiementsAPI } from "@/lib/api";

export function CommandeDialog({ produit }: { produit: { _id: string, nom: string, prix: number } }) {
  const [open, setOpen] = useState(false)
  const [quantite, setQuantite] = useState(1)
  const [echelonne, setEchelonne] = useState(false)
  const [mois, setMois] = useState(0)
  const [showCGUV, setShowCGUV] = useState(false)
  const [cguvAccepted, setCguvAccepted] = useState(false)

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
      // La marge est appliquée sur le montant total en fonction du nombre de mois
      prix *= (1 + (taux * mois));
    }
    return Math.round(prix)
  }

  const montantMensuel = () => {
    if (!echelonne || mois <= 0) return 0;
    return Math.round(prixTotal() / mois);
  }

  

  const commander = async () => {
    if (!cguvAccepted) {
      setShowCGUV(true)
      return
    }

    const clientId = localStorage.getItem("id")
    if (!clientId) {
      alert("Utilisateur non identifié.")
      return
    }

    try {
      // Récupérer les informations du profil
      const response = await fetch(`/api/profil/client/${clientId}`)
      const profilData = await response.json()

      const prixUnitaire = produit.prix * quantite;
      let montantTotal = prixUnitaire;
      
      if (echelonne && mois > 0) {
        const taux = getTauxEchelonnement(prixUnitaire);
        montantTotal = Math.round(prixUnitaire * (1 + taux * mois));
      }
      
      const acompte = Math.round(montantTotal * 0.5);
      const resteAPayer = montantTotal;
      const _montantMensuel = echelonne && mois > 0 ? Math.round(montantTotal / mois) : 0;      

      const commande = {
        produitId: produit._id,
        clientId,
        quantite,
        montantTotal,
        paiementEchelonne: echelonne,
        commande: `${profilData.prenom} ${profilData.nom} - ${produit.nom}`,
        statut: "preparation" as "preparation",
        paiement: "attente" as "attente",
        dateCommande: new Date().toISOString(),
        nombreEcheances: mois,
        acompteInitial: acompte,
      }

      // Créer la commande
      const commandeRes = await commandesAPI.create(commande);

      // Créer le paiement initial
      const paiementInitial = {
        commandeId: commandeRes.data._id,
        clientId,
        commande: `${profilData.prenom} ${profilData.nom} - ${produit.nom}`,
        montantInitial: montantTotal,
        montantPaye: 0,
        paiementInitial: acompte,
        resteAPayer,
        datePaiement: new Date().toISOString(),
        statut: "en_cours" as "en_cours",
        type: (echelonne ? "echelonne" : "unique") as "echelonne" | "unique",
        echeances: echelonne
          ? [
              {
                numero: 0,
                type: "acompte",
                montant: acompte,
                dateEcheance: new Date().toISOString(),
                statut: "en_attente" as "en_attente",
                montantPaye: 0,
              },
              ...Array(mois).fill(null).map((_, index) => ({
                numero: index + 1,
                montant: Math.round((montantTotal - acompte) / mois),
                dateEcheance: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
                statut: "en_attente" as "en_attente",
                montantPaye: 0,
              }))
            ]
          : [],
      };

      await paiementsAPI.create(paiementInitial);

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
          <div className="flex items-center gap-2">
            <Checkbox
              id="cguv"
              checked={cguvAccepted}
              onCheckedChange={(checked) => setCguvAccepted(checked === true)}
            />
            <Label htmlFor="cguv" className="text-sm">
              J'accepte les <button type="button" onClick={() => setShowCGUV(true)} className="text-blue-600 hover:underline">conditions générales d'utilisation et de vente</button>
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={commander} disabled={!cguvAccepted}>Valider la commande</Button>
        </DialogFooter>
      </DialogContent>

      <Dialog open={showCGUV} onOpenChange={setShowCGUV}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-xl font-bold text-gray-900">Conditions Générales d'Utilisation et de Vente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-800 bg-white">
            <h3 className="font-semibold text-lg">1. Objet</h3>
            <p>Les présentes conditions générales d'utilisation et de vente (CGUV) régissent les ventes de produits de notre site.</p>

            <h3 className="font-semibold text-lg">2. Prix</h3>
            <p>Les prix de nos produits sont indiqués en FCFA toutes taxes comprises (TTC).</p>

            <h3 className="font-semibold text-lg">3. Paiement</h3>
            <p>Le fait de valider votre commande implique pour vous l'acceptation de l'ensemble des présentes conditions.</p>

            <h3 className="font-semibold text-lg">4. Paiement échelonné</h3>
            <p>En cas de paiement échelonné, des frais supplémentaires seront appliqués selon les tranches suivantes :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Jusqu'à 150.000 FCFA : +10%</li>
              <li>De 150.100 à 300.000 FCFA : +7.5%</li>
              <li>De 301.000 à 500.000 FCFA : +5%</li>
              <li>De 501.000 à 750.000 FCFA : +3.5%</li>
              <li>Au-delà de 750.000 FCFA : +2.5%</li>
            </ul>

            <h3 className="font-semibold text-lg">5. Livraison</h3>
            <p>Les délais de livraison sont donnés à titre indicatif. Nous ne pourrons être tenus responsables des conséquences dues à un retard de livraison.</p>
          </div>
          <DialogFooter className="bg-white">
            <Button onClick={() => {
              setShowCGUV(false)
              setCguvAccepted(true)
            }}>J'accepte les conditions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
