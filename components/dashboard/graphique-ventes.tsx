"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    total: 1500000,
  },
  {
    name: "Fév",
    total: 1800000,
  },
  {
    name: "Mar",
    total: 2200000,
  },
  {
    name: "Avr",
    total: 2500000,
  },
  {
    name: "Mai",
    total: 3100000,
  },
  {
    name: "Juin",
    total: 3500000,
  },
  {
    name: "Juil",
    total: 3200000,
  },
  {
    name: "Août",
    total: 3800000,
  },
  {
    name: "Sep",
    total: 4000000,
  },
  {
    name: "Oct",
    total: 4500000,
  },
  {
    name: "Nov",
    total: 4300000,
  },
  {
    name: "Déc",
    total: 4800000,
  },
]

export function GraphiqueVentes() {
  const formatMontant = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M XOF`
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatMontant} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Mois</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Ventes</span>
                      <span className="font-bold">{formatMontant(payload[0].value as number)}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#2563eb"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#2563eb", opacity: 0.25 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
