import { redirect } from "next/navigation"

export default function Home() {
  // Rediriger vers la page de connexion
  redirect("/connexion")
}
