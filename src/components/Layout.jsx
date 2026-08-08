import { Outlet, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`h-screen w-full flex justify-center ${isDark ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col relative overflow-hidden ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <header className={`flex-none text-white px-4 py-3 shadow-md z-20 flex items-center justify-between ${isDark ? "bg-gray-900" : "bg-blue-600"}`}>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h1 className="text-lg font-bold tracking-tight">FlashMecano</h1>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors" aria-label="Changer de theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
          <div className="p-4 pb-0 min-h-full flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>

            <footer className="bg-gray-950 border-t border-gray-800 py-6 px-4 text-center -mx-4 mt-8">
              <div className="max-w-md mx-auto space-y-4">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-orange-500 text-xl">⚡</span>
                  <span className="font-bold text-white">FlashMecano</span>
                </div>

                {/* Liens principaux */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-blue-400">
                  <Link to="/cgv" className="hover:underline">CGV</Link>
                  <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
                  <Link to="/confidentialite" className="hover:underline">Confidentialité</Link>
                </div>

                {/* Espace pro */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                  <Link to="/partner" className="text-green-400 hover:underline">Espace Vendeur</Link>
                  <Link to="/mes-commandes" className="text-blue-400 hover:underline">Mes commandes</Link>
                  <a href="https://wa.me/221789262218?text=Bonjour%20FlashMecano%2C%20je%20souhaite%20m'inscrire%20comme%20vendeur%20de%20pieces%20ou%20mecanicien%20partenaire."
                     target="_blank" rel="noopener noreferrer"
                     className="text-green-400 hover:underline">Devenir vendeur via WhatsApp</a>
                </div>

                {/* Coordonnées */}
                <div className="text-[10px] text-gray-500 space-y-1 pt-2 border-t border-gray-800">
                  <p>© 2026 FlashMecano</p>
                  <p>📍 Dakar, Sénégal</p>
                  <p>📞 +221 78 926 22 18</p>
                  <p className="text-gray-600">flashmecano.com</p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
