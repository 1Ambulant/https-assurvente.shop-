"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Client {
  _id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  type: "Particulier" | "Entreprise"
}

export default function MesClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const partenaireId = localStorage.getItem("id")
        if (!partenaireId) {
          router.push("/connexion")
          return
        }

        const response = await fetch(`/api/clients/partenaire/${partenaireId}`)
        if (!response.ok) throw new Error("Erreur lors de la récupération des clients")
        
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [router])

  const filteredClients = clients.filter((client) =>
    `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Clients</h1>
          <p className="text-muted-foreground">Liste de vos clients et leurs informations.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
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
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(client.nom, client.prenom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.prenom} {client.nom}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.email}</div>
                      <div className="text-muted-foreground">{client.telephone}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 