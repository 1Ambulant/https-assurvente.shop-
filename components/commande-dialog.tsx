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

    if (echelonne && mois <= 0) {
      alert("Veuillez choisir le nombre de mois pour le paiement échelonné.")
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-xl font-bold text-gray-900">Conditions Générales d'Utilisation, de Vente et Politique de Confidentialité</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-800 bg-white">
            <div>
              <h3 className="font-semibold text-lg mb-2">Préambule</h3>
              <p className="mb-4">
                African Global Business, société de droit sénégalais, immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro [numéro], dont le siège social est situé à [adresse], exploite la plateforme assurvente.shop. Cette plateforme permet la vente en ligne à crédit de produits ainsi que la mise à disposition d'un système de contrôle à distance et de localisation des produits vendus.
              </p>
              <p>
                Les présentes Conditions Générales d'Utilisation et de Vente (CGUV), complétées par la Politique de Confidentialité, régissent les relations contractuelles entre la Société, les clients (ci-après « Client ») et les partenaires propriétaires de produits (ci-après « Partenaire »), ainsi que les modalités de collecte et de traitement des données personnelles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 1 : Acceptation des CGUV et de la Politique de Confidentialité</h3>
              <p>
                Toute utilisation du site, commande ou accès aux services implique l'acceptation sans réserve des présentes CGUV et de la Politique de confidentialité. La Société se réserve le droit de modifier ces documents à tout moment, les nouvelles versions s'appliquant dès leur mise en ligne.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 2 : Objet</h3>
              <p>
                Les CGUV définissent les conditions d'utilisation du site, les modalités de vente à crédit, les droits et obligations des parties, ainsi que les conditions d'utilisation du système de contrôle à distance. La Politique de Confidentialité décrit les modalités de collecte, d'utilisation, de conservation et de protection des données personnelles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 3 : Produits, partenaires et services</h3>
              <h4 className="font-medium mb-2">3.1 Produits</h4>
              <p className="mb-4">
                Les produits proposés sont décrits sur le site avec leurs caractéristiques, prix, modalités de paiement et garanties. La Société garantit leur conformité.
              </p>
              <h4 className="font-medium mb-2">3.2 Partenaires</h4>
              <p>
                Les Partenaires peuvent proposer leurs produits via la plateforme, utiliser le système de contrôle à distance moyennant un forfait ou déléguer cette gestion à la Société. Ils disposent d'un droit de regard sur les paiements, commandes et produits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 4 : Vente à crédit et système de contrôle à distance</h3>
              <h4 className="font-medium mb-2">4.1 Modalités de vente à crédit</h4>
              <p className="mb-4">
                Le Client peut acheter à crédit sous réserve d'acceptation par la Société, qui peut effectuer une analyse de solvabilité.
              </p>
              <h4 className="font-medium mb-2">4.2 Contrôle à distance</h4>
              <p className="mb-4">
                Un système de contrôle et de localisation est activé sur les produits vendus à crédit pour garantir le paiement intégral. Il permet de restreindre l'usage des produits en cas de défaut de paiement.
              </p>
              <h4 className="font-medium mb-2">4.3 Gestion par les Partenaires</h4>
              <p>
                Les Partenaires peuvent gérer eux-mêmes ou confier à la Société la gestion du contrôle à distance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 5 : Modalités de paiement</h3>
              <p>
                Le paiement s'effectue comptant ou échelonné. Le défaut de paiement entraîne activation du contrôle à distance, suspension ou résiliation du contrat, et récupération des produits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 6 : Droits et obligations</h3>
              <h4 className="font-medium mb-2">6.1 Obligations de la Société</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Fournir des produits conformes</li>
                <li>Assurer le fonctionnement de la plateforme et du système de contrôle</li>
              </ul>
              <h4 className="font-medium mb-2">6.2 Obligations du Client</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Fournir des informations exactes</li>
                <li>Respecter les échéances de paiement</li>
                <li>Autoriser le contrôle à distance</li>
              </ul>
              <h4 className="font-medium mb-2">6.3 Obligations des Partenaires</h4>
              <ul className="list-disc pl-6">
                <li>Proposer des produits conformes</li>
                <li>Respecter les conditions d'utilisation et payer les forfaits</li>
            </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 7 : Protection des données personnelles</h3>
              <h4 className="font-medium mb-2">7.1 Responsable du traitement</h4>
              <p className="mb-4">
                Le responsable du traitement est African Global Business, [adresse], contact : [email], [téléphone].
              </p>
              <h4 className="font-medium mb-2">7.2 Données collectées</h4>
              <p className="mb-4">
                Nous collectons : données d'identification, données de connexion, données financières, données sur les produits (localisation, contrôle), données communiquées par les partenaires.
              </p>
              <h4 className="font-medium mb-2">7.3 Finalités</h4>
              <p className="mb-4">
                Les données sont utilisées pour la gestion des commandes, paiements, livraisons, ventes à crédit, contrôle à distance, gestion des comptes, amélioration du service, communication, et respect des obligations légales.
              </p>
              <h4 className="font-medium mb-2">7.4 Base légale</h4>
              <p className="mb-4">
                Traitement fondé sur l'exécution du contrat, consentement, obligations légales, et intérêts légitimes.
              </p>
              <h4 className="font-medium mb-2">7.5 Destinataires</h4>
              <p className="mb-4">
                Données communiquées à la Société, partenaires, prestataires techniques, autorités compétentes.
              </p>
              <h4 className="font-medium mb-2">7.6 Durée de conservation</h4>
              <p className="mb-4">
                Conservation conforme aux obligations légales sénégalaises.
              </p>
              <h4 className="font-medium mb-2">7.7 Sécurité</h4>
              <p className="mb-4">
                Mesures techniques et organisationnelles pour protéger les données.
              </p>
              <h4 className="font-medium mb-2">7.8 Droits des utilisateurs</h4>
              <p>
                Droit d'accès, rectification, opposition, suppression, limitation, retrait du consentement, et recours auprès de la Commission des Données Personnelles. Exercice via contact : [email].
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 8 : Cookies et traceurs</h3>
              <p>
                Le site utilise des cookies pour améliorer la navigation et mesurer l'audience. Les utilisateurs peuvent gérer leur consentement via le bandeau d'information et les paramètres de leur navigateur.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 9 : Responsabilité</h3>
              <p>
                La Société est responsable sauf cas de force majeure. Sa responsabilité est limitée conformément au droit sénégalais. Elle n'est pas responsable des dommages indirects liés au contrôle à distance sauf faute lourde.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 10 : Droit applicable et juridiction compétente</h3>
              <p>
                Les présentes CGUV et Politique de Confidentialité sont régies par le droit sénégalais. Tout litige sera soumis aux tribunaux compétents de Dakar.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 11 : Résiliation</h3>
              <p>
                En cas de manquement, notamment de paiement, la Société peut résilier le contrat, activer le contrôle à distance et récupérer les produits. Les Partenaires peuvent voir leur accès suspendu.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Article 12 : Réclamations et médiation</h3>
              <p>
                Les réclamations s'adressent au service client via le site. En cas de litige non résolu, un médiateur de la consommation peut être saisi conformément à la loi.
              </p>
            </div>
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
