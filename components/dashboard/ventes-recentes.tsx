import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { commandesAPI } from "@/lib/api"

interface Vente {
  _id: string
  commande: string,
  client: string
  initiales: string
  email: string
  montant: string
  statut: "payé" | "en attente" | "annulé"
  date: string
}

export function VentesRecentes() {
  const [ventes, setVentes] = useState<Vente[]>([])

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const res = await commandesAPI.getAll()
        setVentes(res.data)

      } catch (error) {
        console.error("Erreur chargement ventes", error)
      }
    }
    fetchVentes()
  }, [])

  return (
    <div className="space-y-8">
      {ventes.map((vente) => (
        <div key={vente._id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{vente.commande}</p>
          </div>
          <div className="ml-auto font-medium">{vente.montant}</div>
          <div className="ml-4">
            <Badge
              variant={
                vente.statut === "payé"
                  ? "default"
                  : vente.statut === "en attente"
                  ? "outline"
                  : "destructive"
              }
              className={
                vente.statut === "payé"
                  ? "bg-green-500"
                  : vente.statut === "en attente"
                  ? "bg-yellow-500 text-yellow-800"
                  : ""
              }
            >
              {vente.statut}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
