import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Wrench, MapPin, Package, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = {
  ASK_SYMPTOMS: "ask_symptoms",
  ASK_BRAND_MODEL: "ask_brand_model",
  ASK_YEAR: "ask_year",
  ASK_PHONE: "ask_phone",
  SEARCHING: "searching",
  SHOW_OPTIONS: "show_options",
  CHOSEN: "chosen",
  PAYMENT: "payment",
};

export default function ChatLingua() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(STEPS.ASK_SYMPTOMS);
  const [form, setForm] = useState({});
  const [options, setOptions] = useState([]);
  const [interventionId, setInterventionId] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    addBotMessage(
      "Bonjour ! Je suis Lingua, votre comparateur FlashMecano. Decrivez-moi votre panne ou vos symptomes, je trouve le meilleur prix pour vous."
    );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, options]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { role: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    addUserMessage(userText);
    setInput("");
    setLoading(true);

    try {
      switch (step) {
        case STEPS.ASK_SYMPTOMS: {
          setForm((f) => ({ ...f, symptomes: userText }));
          addBotMessage("Merci. Quelle est la marque et le modele de votre vehicule ?");
          setStep(STEPS.ASK_BRAND_MODEL);
          break;
        }

        case STEPS.ASK_BRAND_MODEL: {
          const words = userText.split(/\s+/);
          const marque = words[0] || userText;
          const modele = words.slice(1).join(" ");
          setForm((f) => ({ ...f, marque, modele }));
          addBotMessage("Parfait. De quelle annee ? (cette information est visible sur votre carte grise)");
          setStep(STEPS.ASK_YEAR);
          break;
        }

        case STEPS.ASK_YEAR: {
          const yearMatch = userText.match(/\b(19|20)\d{2}\b/);
          const annee = yearMatch ? parseInt(yearMatch[0]) : userText.trim();
          setForm((f) => ({ ...f, annee }));
          addBotMessage("Votre numero de telephone ? (ex: 77 XXX XX XX)");
          setStep(STEPS.ASK_PHONE);
          break;
        }

        case STEPS.ASK_PHONE: {
          const phone = userText.replace(/\D/g, "");
          if (phone.length < 9) {
            addBotMessage("Veuillez entrer un numero senegalais valide (77, 76, 75, 70, 78).");
            setLoading(false);
            return;
          }

          const fullForm = {
            ...form,
            telephone_client: phone,
            latitude_client: 14.7167,
            longitude_client: -17.4677,
            adresse_client: "Dakar, Senegal",
          };

          setStep(STEPS.SEARCHING);

          const res1 = await fetch("/api/intervention/creer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullForm),
          });
          if (!res1.ok) throw new Error(`API creer: ${await res1.text()}`);
          const data1 = await res1.json();
          setInterventionId(data1.intervention_id);

          const res2 = await fetch(`/api/intervention/${data1.intervention_id}/chercher-options`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (!res2.ok) throw new Error(`API options: ${await res2.text()}`);
          const data2 = await res2.json();
          const foundOptions = data2.options || [];
          setOptions(foundOptions);

          if (foundOptions.length > 0) {
            addBotMessage(
              `J'ai trouve ${foundOptions.length} option${foundOptions.length > 1 ? "s" : ""}. Choisissez la meilleure offre :`
            );
            setStep(STEPS.SHOW_OPTIONS);
          } else {
            addBotMessage("Je n'ai pas trouve de piece pour ce modele dans l'immediat. Notre equipe vous recontacte sous 2h avec une solution.");
            setStep(STEPS.ASK_SYMPTOMS);
          }
          break;
        }

        case STEPS.SHOW_OPTIONS: {
          const choice = userText.toUpperCase().replace(/[^A-Z]/g, "");
          const selected = options.find((o) => o.option_label === choice);
          if (!selected) {
            addBotMessage("Choisissez une option valide (tapez la lettre : A, B, C...)");
            setLoading(false);
            return;
          }
          await chooseOption(selected);
          break;
        }

        default:
          addBotMessage("Je n'ai pas compris. Pouvez-vous reformuler ?");
      }
    } catch (err) {
      console.error("[ChatLingua] Erreur:", err);
      addBotMessage("Probleme technique temporaire. Notre equipe vous recontacte sous 15 min.");
    } finally {
      setLoading(false);
    }
  };

  const chooseOption = async (selected) => {
    setStep(STEPS.SEARCHING);
    try {
      const res3 = await fetch(`/api/intervention/${interventionId}/choisir-option`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote_id: selected.quote_id }),
      });
      if (!res3.ok) throw new Error(`API choisir: ${await res3.text()}`);
      const data3 = await res3.json();
      setOrder(data3);
      setStep(STEPS.CHOSEN);
      addBotMessage(
        `Commande creee ! Reference : ${data3.reference} — Total : ${data3.total_client?.toLocaleString()} FCFA`
      );
    } catch (err) {
      console.error("[ChatLingua] Erreur:", err);
      addBotMessage("Probleme technique temporaire. Notre equipe vous recontacte sous 15 min.");
      setStep(STEPS.SHOW_OPTIONS);
    }
  };

  const handleOptionClick = (opt) => {
    if (loading) return;
    setLoading(true);
    chooseOption(opt).finally(() => setLoading(false));
  };

  const handlePayment = async () => {
    if (!order?.order_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/paiement/initier/${order.order_id}`, { method: "POST" });
      if (!res.ok) throw new Error("Init paiement echoue");
      addBotMessage("Redirection vers la page de paiement securisee...");
      setStep(STEPS.PAYMENT);
    } catch (err) {
      addBotMessage("Probleme technique temporaire. Notre equipe vous recontacte sous 15 min.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
          FM
        </div>
        <div>
          <h1 className="font-bold text-sm">Chat Lingua</h1>
          <p className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Comparateur d'urgence
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-800 text-gray-100 rounded-bl-md"
              }`}
            >
              {m.text.split("\n").map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-1" : ""}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {step === STEPS.SHOW_OPTIONS && options.length > 0 && (
          <div className="space-y-3 mt-2">
            {options.map((opt) => (
              <button
                key={opt.quote_id}
                onClick={() => handleOptionClick(opt)}
                disabled={loading}
                className="w-full text-left bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-2xl p-4 active:bg-gray-700 transition-all disabled:opacity-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    Option {opt.option_label}
                  </span>
                  <span className="text-green-400 font-bold text-lg">
                    {opt.total_client?.toLocaleString()} F
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-300">
                  <p className="flex items-center gap-2">
                    <Wrench size={12} className="text-gray-500" />
                    {opt.mecano_nom}
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin size={10} /> {opt.mecano_distance_km} km
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Package size={12} className="text-gray-500" />
                    {opt.vendeur_nom}
                  </p>
                  <div className="flex gap-3 pt-2 mt-1 border-t border-gray-700 text-gray-400">
                    <span>Piece: {opt.prix_piece_client?.toLocaleString()} F</span>
                    <span>M.O.: {opt.prix_mecano_client?.toLocaleString()} F</span>
                    <span>Transp.: {opt.prix_transport_client?.toLocaleString()} F</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === STEPS.CHOSEN && order && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-green-900/50"
            >
              <CheckCircle2 size={18} />
              Payer {order.total_client?.toLocaleString()} FCFA
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400 flex items-center gap-3">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
              Lingua reflechit...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 pb-safe border-t border-gray-800 bg-gray-900">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              step === STEPS.SHOW_OPTIONS
                ? "Tapez A, B, C..."
                : step === STEPS.ASK_PHONE
                ? "77 XXX XX XX"
                : "Ecrivez..."
            }
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500 text-white"
            disabled={loading || step === STEPS.SEARCHING}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 text-blue-400 hover:text-blue-300 disabled:opacity-30 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
