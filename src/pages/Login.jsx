import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../hooks/useAudio";
import { Phone, Lock, LogIn, Shield, Wrench } from "lucide-react";
import useSeo from "../lib/useSeo";
import { NOINDEX_PAGES } from "../lib/seoConfig";

export default function Login() {
  useSeo({ path: "/login", title: NOINDEX_PAGES["/login"], noindex: true });
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login(telephone, password, role);
      if (ok) {
        play("success");
        navigate(role === "admin" ? "/admin" : role === "partner" ? "/partner" : "/");
      }
    } catch {
      play("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FlashMecano</h1>
          <p className="text-gray-400 text-sm mt-1">Connexion sécurisée</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[
              { key: "client", label: "Client", icon: <Phone size={14} /> },
              { key: "partner", label: "Partenaire", icon: <Wrench size={14} /> },
              { key: "admin", label: "Admin", icon: <Shield size={14} /> },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  role === r.key ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Phone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="tel" inputMode="tel" placeholder="77 XXX XX XX"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="password" placeholder="Mot de passe"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all">
            {loading ? "Connexion..." : <><LogIn size={18} /> Se connecter</>}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Version Beta • Sénégal</p>
      </div>
    </div>
  );
}