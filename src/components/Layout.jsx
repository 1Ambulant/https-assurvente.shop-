import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, History, Wrench, Shield, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (p) => location.pathname === p;

  const navItems = [
    { to: "/", icon: <Home size={22} />, label: "Accueil" },
    { to: "/historique", icon: <History size={22} />, label: "Historique" },
    { to: "/partner", icon: <Wrench size={22} />, label: "Partenaire", roles: ["partner","admin"] },
    { to: "/admin", icon: <Shield size={22} />, label: "Admin", roles: ["admin"] },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex justify-center">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col relative overflow-hidden">
        <header className="flex-none bg-blue-600 text-white px-4 py-3 shadow-md z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h1 className="text-lg font-bold tracking-tight">FlashMecano</h1>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={logout} className="text-white/80 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            ) : (
              <Link to="/login" className="text-white/80 hover:text-white transition-colors">
                <User size={18} />
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
          <div className="p-4 pb-28 min-h-full">
            <Outlet />
          </div>
        </main>

        <nav className="flex-none absolute bottom-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-200 z-30 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center py-2">
            {navItems.filter(n => !n.roles || (user && n.roles.includes(user.role))).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  isActive(item.to) ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}