import { Outlet, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`h-screen w-full flex justify-center ${isDark ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col relative overflow-hidden ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <header className={`flex-none h-14 px-4 shadow-sm z-20 flex items-center justify-between border-b bg-white dark:bg-gray-900 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <Link to="/" className="flex items-center gap-2 text-orange-500">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-lg tracking-tight">FlashMecano</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              aria-label="Changer de theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
          <div className="p-4 pb-0 min-h-full flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>

            <footer className="bg-gray-950 text-gray-400 -mx-4 px-4 mt-auto py-8 border-t border-gray-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 text-lg">⚡</span>
                    <span className="font-bold text-white">FlashMecano</span>
                  </div>
                  <p className="text-gray-500">Mecaniciens &amp; Pieces auto au Senegal</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Navigation</h3>
                  <ul className="space-y-1.5">
                    <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                    <li><Link to="/urgence" className="hover:text-white transition-colors">Urgence</Link></li>
                    <li><Link to="/mes-commandes" className="hover:text-white transition-colors">Mes commandes</Link></li>
                    <li><Link to="/espace-vendeur" className="hover:text-white transition-colors">Espace Vendeur</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Legal</h3>
                  <ul className="space-y-1.5">
                    <li><Link to="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
                    <li><Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions legales</Link></li>
                    <li><Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialite</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Contact</h3>
                  <a
                    href="https://wa.me/221789262218"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp<br />+221 78 926 22 18
                  </a>
                </div>
              </div>
              <div className="text-center text-[10px] text-gray-600 mt-6 pt-4 border-t border-gray-800">
                FlashMecano © 2026 — Dakar, Sénégal
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
