import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, MessageCircle, Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function UrgenceAuth() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const handleContinue = () => navigate("/chat-lingua");

  const pageBg = isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900";
  const headerHover = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const footerMuted = isDark ? "text-gray-600" : "text-gray-400";

  return (
    <div className={`min-h-screen flex flex-col ${pageBg}`}>
      <header className="flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)} className={`p-2 -ml-2 rounded-full transition-colors ${headerHover}`}>
          <ArrowLeft size={22} />
        </button>
        <span className={`ml-2 text-sm ${mutedText}`}>Retour</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Confirmez votre urgence</h1>
        <p className={`text-sm leading-relaxed mb-10 max-w-xs ${mutedText}`}>
          Pour vous mettre en relation instantanement avec un mecanicien, validez votre identite.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            <MessageCircle size={20} />
            Continuer avec WhatsApp
          </button>
          <button onClick={handleContinue} className="w-full bg-blue-500 hover:bg-blue-400 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            <Send size={20} />
            Continuer avec Telegram
          </button>
        </div>
      </div>

      <footer className={`py-6 text-center text-xs ${footerMuted}`}>
        <p>FlashMecano — Dakar, Senegal</p>
      </footer>
    </div>
  );
}
