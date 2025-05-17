import { Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const commandesRecentes = [
  {
    id: "CMD-001",
    client: "Entreprise Alpha",
    produit: "Réfrigérateur Samsung",
    date: "25 mai 2025",
    statut: "en préparation",
  },
  {
    id: "CMD-002",
    client: "Société Beta",
    produit: "Machine à laver LG",
    date: "28 mai 2025",
    statut: "expédiée",
  },
  {
    id: "CMD-003",
    client: "Groupe Gamma",
    produit: "Climatiseur Daikin",
    date: "1 juin 2025",
    statut: "livrée",
  },
  {
    id: "CMD-004",
    client: "Entreprise Delta",
    produit: "Cuisinière Bosch",
    date: "5 juin 2025",
    statut: "en préparation",
  },
]

export function CommandesRecentes() {
  return (
    <div className="space-y-8">
      {commandesRecentes.map((commande) => (
        <div key={commande.id} className="flex items-center">
          <Truck className="h-5 w-5 text-blue-600" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{commande.client}</p>
            <p className="text-sm text-muted-foreground">{commande.produit}</p>
          </div>
          <div className="ml-auto">
            <Badge
              variant={
                commande.statut === "livrée" ? "default" : commande.statut === "expédiée" ? "outline" : "secondary"
              }
              className={
                commande.statut === "livrée"
                  ? "bg-green-500"
                  : commande.statut === "expédiée"
                    ? "bg-blue-100 text-blue-600 border-blue-200"
                    : "bg-gray-100 text-gray-800"
              }
            >
              {commande.statut}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
