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

            <footer className="bg-gray-950 text-gray-400 text-center text-sm py-6 mt-auto -mx-4">
              FlashMecano © 2026 — +221 78 926 22 18 — Dakar, Sénégal
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
