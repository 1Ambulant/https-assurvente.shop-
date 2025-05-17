import { CalendarDays } from "lucide-react"

const paiementsAVenir = [
  {
    id: "PAY-001",
    client: "Entreprise Alpha",
    montant: "1,250,000 XOF",
    date: "25 mai 2025",
  },
  {
    id: "PAY-002",
    client: "Société Beta",
    montant: "750,000 XOF",
    date: "28 mai 2025",
  },
  {
    id: "PAY-003",
    client: "Groupe Gamma",
    montant: "325,000 XOF",
    date: "1 juin 2025",
  },
  {
    id: "PAY-004",
    client: "Entreprise Delta",
    montant: "890,000 XOF",
    date: "5 juin 2025",
  },
]

export function PaiementsAVenir() {
  return (
    <div className="space-y-8">
      {paiementsAVenir.map((paiement) => (
        <div key={paiement.id} className="flex items-center">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{paiement.client}</p>
            <p className="text-sm text-muted-foreground">{paiement.date}</p>
          </div>
          <div className="ml-auto font-medium">{paiement.montant}</div>
        </div>
      ))}
    </div>
  )
}
