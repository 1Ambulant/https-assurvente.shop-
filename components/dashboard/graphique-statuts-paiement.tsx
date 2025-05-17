"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { name: "Payé", value: 65, color: "#16a34a" },
  { name: "En attente", value: 25, color: "#f59e0b" },
  { name: "Annulé", value: 10, color: "#dc2626" },
]

export function GraphiqueStatutsPaiement() {
  return (
    <div className="flex flex-col items-center justify-center h-[350px]">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Statut</span>
                        <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Pourcentage</span>
                        <span className="font-bold">{`${payload[0].value}%`}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
