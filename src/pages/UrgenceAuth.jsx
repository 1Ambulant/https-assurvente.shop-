import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, MessageCircle, Send } from "lucide-react";

export default function UrgenceAuth() {
  const navigate = useNavigate();
  const handleContinue = () => navigate("/chat-lingua");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="ml-2 text-sm text-gray-400">Retour</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Confirmez votre urgence</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs">
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

      <footer className="py-6 text-center text-xs text-gray-600">
        <p>FlashMecano — Dakar, Senegal</p>
      </footer>
    </div>
  );
}
