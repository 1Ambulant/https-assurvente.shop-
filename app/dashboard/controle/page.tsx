"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Power,
  SatelliteIcon as RemoteControl,
  Refrigerator,
  AirVent,
  Tv,
  WashingMachine,
  Microwave,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { commandesAPI, produitsAPI } from "@/lib/api"
import Image from "next/image"

export default function ControlePage() {
  const [deviceStatus, setDeviceStatus] = useState({
    refrigerator: true,
    aircon: false,
    tv: true,
    washingMachine: false,
    microwave: true,
  })

  const [temperature, setTemperature] = useState({
    refrigerator: 4,
    aircon: 22,
  })

  const [washingMachineProgress, setWashingMachineProgress] = useState(0)
  const [microwaveTimer, setMicrowaveTimer] = useState(0)

  const [commandes, setCommandes] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])

  const [productStatus, setProductStatus] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchData = async () => {
      const [cmdRes, prodRes] = await Promise.all([
        commandesAPI.getAll(),
        produitsAPI.getAll(),
      ])
      setCommandes(cmdRes.data)
      setProduits(prodRes.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (produits.length > 0) {
      const initialStatus: { [key: string]: boolean } = {}
      produits.forEach((p) => {
        initialStatus[p._id] = true // Par défaut allumé
      })
      setProductStatus(initialStatus)
    }
  }, [produits])

  const toggleDevice = (device: string) => {
    setDeviceStatus((prev) => ({
      ...prev,
      [device]: !prev[device as keyof typeof prev],
    }))

  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commandes.map((commande) => {
          const produit = produits.find((p) => p._id === commande.produitId)
          if (!produit) return null
          return (
            <Card key={commande._id}>
              <div className="relative aspect-square">
                <Image
                  src={produit.image || "/placeholder.svg"}
                  alt={produit.nom}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{commande.commande}</CardTitle>
                <CardDescription>Commande du {new Date(commande.dateCommande).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><b>Produit :</b> {produit.nom}</div>
                  <div><b>ID :</b> {commande._id}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant={productStatus[produit._id] ? "destructive" : "default"}
                  onClick={() => setProductStatus((prev) => ({ ...prev, [produit._id]: !prev[produit._id] }))}
                >
                  {productStatus[produit._id] ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
