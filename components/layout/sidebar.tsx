"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Box,
  CreditCard,
  Home,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users,
  X,
  MapPin,
  SatelliteIcon as RemoteControl,
  Handshake,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[] // Ajout des rôles pour chaque item
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()
  const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null

  const navItems: NavItem[] = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: Home,
      roles: ["admin"],
    },
    {
      title: "Produits",
      href: "/dashboard/produits",
      icon: Box,
      roles: ["admin", "client", "partenaire"],
    },
    {
      title: "Mes Commandes",
      href: "/dashboard/mescommandes",
      icon: ShoppingCart,
      roles: ["client"],
    },
    {
      title: "Mes Paiements",
      href: "/dashboard/mespaiements",
      icon: CreditCard,
      roles: ["client"],
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Commandes",
      href: "/dashboard/commandes",
      icon: ShoppingCart,
      roles: ["admin"],
    },
    {
      title: "Paiements",
      href: "/dashboard/paiements",
      icon: CreditCard,
      roles: ["admin"],
    },
    {
      title: "Partenaires",
      href: "/dashboard/partenaires",
      icon: Handshake,
      roles: ["admin"],
    },
    {
      title: "Géolocalisation",
      href: "/dashboard/geolocalisation",
      icon: MapPin,
      roles: ["admin"],
    },
    {
      title: "Contrôle à distance",
      href: "/dashboard/controle",
      icon: RemoteControl,
      roles: ["admin"],
    },
    {
      title: "Statistiques",
      href: "/dashboard/statistiques",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      title: "Paramètres",
      href: "/dashboard/parametres",
      icon: Settings,
      roles: ["admin", "client"]
    },
  ]

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole || ""))

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar pour mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M12 11V3" />
                <path d="M12 3H8" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">AssurVente</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-200 mt-6">
            <Link
              href="/connexion"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
