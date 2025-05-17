import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const ventesRecentes = [
  {
    id: "VNT-001",
    client: "Martin Dubois",
    initiales: "MD",
    email: "martin.dubois@example.com",
    montant: "125,000 XOF",
    statut: "payé",
    date: "Il y a 2 heures",
  },
  {
    id: "VNT-002",
    client: "Sophie Lefebvre",
    initiales: "SL",
    email: "sophie.lefebvre@example.com",
    montant: "85,500 XOF",
    statut: "en attente",
    date: "Il y a 3 heures",
  },
  {
    id: "VNT-003",
    client: "Thomas Moreau",
    initiales: "TM",
    email: "thomas.moreau@example.com",
    montant: "450,000 XOF",
    statut: "payé",
    date: "Il y a 5 heures",
  },
  {
    id: "VNT-004",
    client: "Camille Petit",
    initiales: "CP",
    email: "camille.petit@example.com",
    montant: "75,000 XOF",
    statut: "annulé",
    date: "Il y a 8 heures",
  },
  {
    id: "VNT-005",
    client: "Lucas Bernard",
    initiales: "LB",
    email: "lucas.bernard@example.com",
    montant: "220,000 XOF",
    statut: "en attente",
    date: "Hier",
  },
]

export function VentesRecentes() {
  return (
    <div className="space-y-8">
      {ventesRecentes.map((vente) => (
        <div key={vente.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-600">{vente.initiales}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{vente.client}</p>
            <p className="text-sm text-muted-foreground">{vente.email}</p>
          </div>
          <div className="ml-auto font-medium">{vente.montant}</div>
          <div className="ml-4">
            <Badge
              variant={vente.statut === "payé" ? "default" : vente.statut === "en attente" ? "outline" : "destructive"}
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
