"use client"

import { useState } from "react"
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

  const toggleDevice = (device: string) => {
    setDeviceStatus((prev) => ({
      ...prev,
      [device]: !prev[device as keyof typeof prev],
    }))

  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contrôle à distance</h1>
        <p className="text-muted-foreground">Gérez et contrôlez vos appareils électroménagers à distance.</p>
      </div>

      <Tabs defaultValue="appareils">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="appareils">
            <Refrigerator className="mr-2 h-4 w-4" />
            Appareils
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appareils" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Réfrigérateur */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Réfrigérateur Samsung</CardTitle>
                  <Badge
                    variant={deviceStatus.refrigerator ? "default" : "secondary"}
                    className={deviceStatus.refrigerator ? "bg-green-500" : ""}
                  >
                    {deviceStatus.refrigerator ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <CardDescription>Réfrigérateur Side by Side</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Refrigerator
                    className={`h-16 w-16 ${deviceStatus.refrigerator ? "text-blue-600" : "text-gray-400"}`}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>ID de l'appareil</Label>
                    <span className="text-sm">REF-001</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dernière connexion</Label>
                    <span className="text-sm">Il y a 5 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mode économie d'énergie</Label>
                    <Switch checked={deviceStatus.refrigerator} disabled={!deviceStatus.refrigerator} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Détails
                </Button>
                <Button
                  variant={deviceStatus.refrigerator ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleDevice("refrigerator")}
                >
                  {deviceStatus.refrigerator ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>

            {/* Climatiseur */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Climatiseur Daikin</CardTitle>
                  <Badge
                    variant={deviceStatus.aircon ? "default" : "secondary"}
                    className={deviceStatus.aircon ? "bg-green-500" : ""}
                  >
                    {deviceStatus.aircon ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <CardDescription>Climatiseur Inverter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <AirVent className={`h-16 w-16 ${deviceStatus.aircon ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Température actuelle</Label>
                      <span className="text-sm font-medium">{temperature.aircon}°C</span>
                    </div>
                    <Slider
                      value={[temperature.aircon]}
                      min={16}
                      max={30}
                      step={1}
                      disabled={!deviceStatus.aircon}
                      onValueChange={(value) => setTemperature({ ...temperature, aircon: value[0] })}
                      className={deviceStatus.aircon ? "bg-blue-100" : ""}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ID de l'appareil</Label>
                    <span className="text-sm">CLIM-002</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dernière connexion</Label>
                    <span className="text-sm">Il y a 2 heures</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mode</Label>
                    <Select disabled={!deviceStatus.aircon} defaultValue="cool">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cool">Froid</SelectItem>
                        <SelectItem value="heat">Chaud</SelectItem>
                        <SelectItem value="fan">Ventilation</SelectItem>
                        <SelectItem value="dry">Déshumidification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Détails
                </Button>
                <Button
                  variant={deviceStatus.aircon ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleDevice("aircon")}
                >
                  {deviceStatus.aircon ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>

            {/* Smart TV */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Smart TV LG</CardTitle>
                  <Badge
                    variant={deviceStatus.tv ? "default" : "secondary"}
                    className={deviceStatus.tv ? "bg-green-500" : ""}
                  >
                    {deviceStatus.tv ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <CardDescription>Téléviseur connecté</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Tv className={`h-16 w-16 ${deviceStatus.tv ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>ID de l'appareil</Label>
                    <span className="text-sm">TV-003</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dernière connexion</Label>
                    <span className="text-sm">Il y a 10 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Source</Label>
                    <Select disabled={!deviceStatus.tv} defaultValue="hdmi1">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hdmi1">HDMI 1</SelectItem>
                        <SelectItem value="hdmi2">HDMI 2</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="netflix">Netflix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Volume</Label>
                    <div className="w-[120px]">
                      <Slider
                        value={[30]}
                        min={0}
                        max={100}
                        step={1}
                        disabled={!deviceStatus.tv}
                        className={deviceStatus.tv ? "bg-blue-100" : ""}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Détails
                </Button>
                <Button
                  variant={deviceStatus.tv ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleDevice("tv")}
                >
                  {deviceStatus.tv ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>

            {/* Machine à laver */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Machine à laver LG</CardTitle>
                  <Badge
                    variant={deviceStatus.washingMachine ? "default" : "secondary"}
                    className={deviceStatus.washingMachine ? "bg-green-500" : ""}
                  >
                    {deviceStatus.washingMachine ? "En marche" : "Arrêtée"}
                  </Badge>
                </div>
                <CardDescription>Machine à laver 8kg</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <WashingMachine
                    className={`h-16 w-16 ${deviceStatus.washingMachine ? "text-blue-600" : "text-gray-400"}`}
                  />
                </div>
                <div className="space-y-4">
                  {deviceStatus.washingMachine && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Progression du cycle</Label>
                        <span className="text-sm font-medium">{washingMachineProgress}%</span>
                      </div>
                      <Progress value={washingMachineProgress} className="h-2" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label>ID de l'appareil</Label>
                    <span className="text-sm">WASH-004</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dernière connexion</Label>
                    <span className="text-sm">Il y a 30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Programme</Label>
                    <Select disabled={!deviceStatus.washingMachine || washingMachineProgress > 0} defaultValue="normal">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Programme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eco">Éco</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="intense">Intensif</SelectItem>
                        <SelectItem value="quick">Rapide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Détails
                </Button>
                <Button
                  variant={deviceStatus.washingMachine ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleDevice("washingMachine")}
                  disabled={deviceStatus.washingMachine && washingMachineProgress > 0 && washingMachineProgress < 100}
                >
                  {deviceStatus.washingMachine ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>

            {/* Micro-ondes */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Micro-ondes Panasonic</CardTitle>
                  <Badge
                    variant={deviceStatus.microwave ? "default" : "secondary"}
                    className={deviceStatus.microwave ? "bg-green-500" : ""}
                  >
                    {deviceStatus.microwave ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <CardDescription>Micro-ondes intelligent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Microwave className={`h-16 w-16 ${deviceStatus.microwave ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Minuterie (min)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!deviceStatus.microwave || microwaveTimer <= 0}
                        onClick={() => setMicrowaveTimer((prev) => Math.max(0, prev - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{microwaveTimer}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!deviceStatus.microwave || microwaveTimer >= 30}
                        onClick={() => setMicrowaveTimer((prev) => Math.min(30, prev + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ID de l'appareil</Label>
                    <span className="text-sm">MICRO-005</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dernière connexion</Label>
                    <span className="text-sm">Il y a 15 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Puissance</Label>
                    <Select disabled={!deviceStatus.microwave} defaultValue="medium">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Puissance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="defrost">Décongélation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Détails
                </Button>
                <Button
                  variant={deviceStatus.microwave ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleDevice("microwave")}
                >
                  {deviceStatus.microwave ? "Éteindre" : "Allumer"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
