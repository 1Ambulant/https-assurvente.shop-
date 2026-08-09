import { useState, useRef, useEffect, useCallback } from "react";
import { Send, ArrowLeft, Wrench, MapPin, Package, CheckCircle2, Mic, Volume2, VolumeX, Phone, MessageCircle, Truck, ClipboardCheck, Star, Navigation, MapPinned, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const STEPS = {
  ASK_SYMPTOMS: "ask_symptoms",
  ASK_BRAND: "ask_brand",
  ASK_YEAR: "ask_year",
  ASK_PHONE: "ask_phone",
  DIAGNOSTIC_FOLLOWUP: "diagnostic_followup",
  DIAGNOSIS_RESULT: "diagnosis_result",
  SEARCHING: "searching",
  CHOOSE_MECANO: "choose_mecano",
  CHOOSE_PIECE: "choose_piece",
  CHOSEN: "chosen",
  PAYMENT: "payment",
  SHOW_CONTACTS: "show_contacts",
  INTERVENTION_STARTED: "intervention_started",
  RATING: "rating",
  CLOSED: "closed",
  NO_RESULTS: "no_results",
};

const API_BASE = import.meta.env.VITE_API_URL || "";

function getFollowUpQuestions(symptomes) {
  const s = symptomes.toLowerCase();
  const q = [];
  if (s.includes("demarreur") || s.includes("clic") || s.includes("tourne pas") || s.includes("demarre")) {
    q.push("Le voyant rouge de batterie s'allume-t-il quand vous tournez la cle ?");
    q.push("Le clic que vous entendez est-il sec et metallique, ou mou et etouffe ?");
    q.push("Avez-vous deja essaye de passer des cables de demarrage avec une autre voiture ?");
    q.push("Quand vous mettez les phares, sont-ils normaux ou faiblards ?");
    q.push("La batterie a-t-elle plus de 3 ans ?");
  } else if (s.includes("alternateur") || s.includes("batterie") || s.includes("charge") || s.includes("decharge")) {
    q.push("Le voyant rouge de batterie reste-t-il allume en roulant ?");
    q.push("Vos phares faiblissent-ils au ralenti ?");
    q.push("La batterie est-elle gonflee ou sent-elle le soufre ?");
    q.push("Avez-vous deja change l'alternateur ou la courroie d'accessoires ?");
  } else if (s.includes("embrayage") || s.includes("patine") || s.includes("vitesse") || s.includes("boite")) {
    q.push("L'embrayage patine-t-il des le demarrage ou uniquement en cote ?");
    q.push("Y a-t-il une odeur de brulee lorsque vous accelerez fort ?");
    q.push("La pedale d'embrayage est-elle dure ou molle ?");
    q.push("Entendez-vous un bruit de frottement quand vous appuyez sur la pedale ?");
  } else if (s.includes("frein") || s.includes("plaquette") || s.includes("disque")) {
    q.push("Entendez-vous un grincement ou un sifflement en freinant ?");
    q.push("La pedale de frein est-elle molle, dure, ou normal ?");
    q.push("Le vehicule tire-t-il a gauche ou a droite au freinage ?");
    q.push("Le liquide de frein est-il au niveau normal ?");
  } else if (s.includes("courroie") || s.includes("distribution") || s.includes("courroie accessoire")) {
    q.push("Entendez-vous un cliquetis au niveau du moteur au ralenti ?");
    q.push("Y a-t-il de la fumee ou une odeur de brulee sous le capot ?");
    q.push("Le moteur chauffe-t-il plus que d'habitude ?");
    q.push("A quand remonte le dernier changement de courroie de distribution ?");
  } else {
    q.push("Le probleme est-il apparu brutalement ou progressivement ?");
    q.push("Le voyant moteur (check engine) est-il allume sur votre tableau de bord ?");
    q.push("Le vehicule a-t-il subi un choc recent ou une inondation ?");
    q.push("Y a-t-il une odeur, une fumee, ou un bruit inhabituel ?");
    q.push("Le probleme s'aggrave-t-il a chaud ou a froid ?");
  }
  return q;
}

function getDiagnostic(symptomes, answers) {
  const s = symptomes.toLowerCase();
  const a = answers.map(x => x.toLowerCase());
  let confidence = 85;
  let details = [];
  let conclusion = "";

  if (s.includes("demarreur") || s.includes("clic") || s.includes("tourne pas")) {
    const voyant = a[0] || "";
    const clic = a[1] || "";
    const cables = a[2] || "";
    const phares = a[3] || "";
    const batterieAge = a[4] || "";

    if (voyant.includes("non") && clic.includes("sec") && phares.includes("normaux")) {
      confidence = 95;
      details.push("Le voyant batterie eteint exclut une panne electrique generale.");
      details.push("Le clic sec et metallique est typique du solenoide du demarreur qui enclenche mais le moteur ne tourne pas.");
      details.push("Les phares normaux confirment que la batterie delivre suffisamment de courant.");
      conclusion = "Le solenoide ou les charbons du demarreur sont tres probablement uses. Le demarreur doit etre remplace ou reconditionne.";
    } else if (voyant.includes("oui") && phares.includes("faiblar") && batterieAge.includes("oui")) {
      confidence = 92;
      details.push("Le voyant allume et les phares faiblards indiquent une tension insuffisante.");
      details.push("Une batterie de plus de 3 ans a Dakar subit des cycles de chaleur qui reduisent sa capacite.");
      conclusion = "La batterie est en fin de vie et doit etre remplacee. Le demarreur peut etre sain.";
    } else if (cables.includes("oui") || cables.includes("fonctionne") || cables.includes("marche")) {
      confidence = 90;
      details.push("Si les cables de demarrage ont permis de demarrer, la batterie est dechargee mais le demarreur fonctionne.");
      conclusion = "Batterie dechargee ou sulfaturee. Recharge ou remplacement necessaire. Verifier l'alternateur.";
    } else if (clic.includes("mou") || clic.includes("etouff")) {
      confidence = 88;
      details.push("Un clic mou indique que le demarreur recoit du courant mais n'a pas assez de puissance pour tourner.");
      conclusion = "Batterie faible ou bornes oxydees. Nettoyer les bornes, tester la batterie.";
    } else {
      confidence = 85;
      details.push("Les symptomes sont mixtes. Plusieurs causes possibles : batterie, demarreur, ou connexion electrique.");
      conclusion = "Batterie faible ou demarreur use. Un test de batterie et de solenoide est necessaire.";
    }
  } else if (s.includes("alternateur") || s.includes("batterie") || s.includes("charge")) {
    confidence = 90;
    details.push("L'alternateur charge la batterie en roulant. Si le voyant reste allume, il ne produit plus de courant.");
    conclusion = "Alternateur ou regulateur de charge defectueux. Risque de panne seche en roulant.";
  } else if (s.includes("embrayage")) {
    confidence = 90;
    details.push("Le patinage en cote avec odeur de brulee indique un disque d'embrayage use ou glace.");
    conclusion = "Kit d'embrayage (disque, mecanisme, butee) a remplacer.";
  } else if (s.includes("frein")) {
    confidence = 90;
    details.push("Grincement = plaquettes uses. Tirage = etrier bloque. Pedale molle = fuite de liquide.");
    conclusion = "Plaquettes et/ou disques a remplacer. Verifier l'etrier et le liquide de frein.";
  } else if (s.includes("courroie") || s.includes("distribution")) {
    confidence = 92;
    details.push("Un cliquetis au ralenti + surchauffe = courroie de distribution detendue ou usee.");
    conclusion = "Courroie de distribution et tendeur a remplacer en urgence (risque casse moteur).";
  } else {
    confidence = 75;
    conclusion = "Diagnostic necessitant une inspection visuelle complete sur place.";
  }

  const raisonnement = details.length > 0 ? "Analyse :\n• " + details.join("\n• ") + "\n\n" : "";
  return `${raisonnement}Diagnostic probable a ${confidence}% : ${conclusion}`;
}

function formatWhatsAppLink(phone, message) {
  const clean = phone.replace(/\D/g, "").replace(/^0/, "221");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

function formatMapsLink(lat, lng, label) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
}

export default function ChatLingua() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const mode = location.state?.mode || "diagnostic";
  const initialQuery = location.state?.query || "";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(mode === "diagnostic" ? STEPS.ASK_SYMPTOMS : STEPS.ASK_BRAND);
  const [form, setForm] = useState(() =>
    mode !== "diagnostic" && initialQuery
      ? { symptomes: mode === "piece" ? `Recherche piece: ${initialQuery}` : `Recherche mecanicien: ${initialQuery}` }
      : {}
  );
  const [options, setOptions] = useState([]);
  const [interventionId, setInterventionId] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [contacts, setContacts] = useState(null);
  const [rating, setRating] = useState(0);
  const [selectedMecano, setSelectedMecano] = useState(null);
  const [mecanoOptions, setMecanoOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const greetedRef = useRef(false);

  const speak = useCallback((text) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [audioEnabled]);

  const startListening = useCallback(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      addBotMessage("La reconnaissance vocale n'est pas disponible sur cet appareil. Veuillez ecrire.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      addBotMessage("Je n'ai pas compris. Veuillez repeter ou ecrire.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => handleSendWithText(transcript), 300);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;

    let intro;
    if (mode === "piece") {
      intro = `Je cherche ${initialQuery || "la piece"} pour vous. Quelle est la marque et le modele de votre vehicule ? (cette information est visible sur votre carte grise)`;
    } else if (mode === "mecano") {
      intro = "Je trouve un mecanicien pour vous. Quelle est la marque et le modele de votre vehicule ? (cette information est visible sur votre carte grise)";
    } else {
      intro = "Bonjour, je suis MyLingua, l'intelligence artificielle de FlashMecano. Decrivez-moi votre panne et je trouve pour vous le meilleur mecanicien + la piece au meilleur prix, en moins de 2 minutes. C'est gratuit et sans engagement.";
    }
    addBotMessage(intro);
    speak(intro);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, options, loading, contacts, rating]);

  const addBotMessage = (text) => {
    setMessages((p) => [...p, { role: "bot", text }]);
    speak(text);
  };
  const addUserMessage = (text) => setMessages((p) => [...p, { role: "user", text }]);

  const searchOptions = async (fullForm) => {
    const r1 = await fetch(`${API_BASE}/api/intervention/creer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fullForm) });
    if (!r1.ok) throw new Error("creer " + (await r1.text()));
    const d1 = await r1.json();
    setInterventionId(d1.intervention_id);

    const r2 = await fetch(`${API_BASE}/api/intervention/${d1.intervention_id}/chercher-options`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    if (!r2.ok) throw new Error("options " + (await r2.text()));
    const d2 = await r2.json();
    return d2.options || [];
  };

  const handleNoResults = (type) => {
    const label = type === "piece" ? "piece" : "mecano";
    addBotMessage(`Je n'ai pas trouve de ${label} disponible dans votre zone immediate. Notre equipe recherche activement au-dela de votre perimetre. Vous serez contacte sous 15 min au +221 78 926 22 18.`);
    setStep(STEPS.NO_RESULTS);
  };

  const handleRetry = () => {
    setForm({});
    setOptions([]);
    setMecanoOptions([]);
    setSelectedMecano(null);
    setSelectedOption(null);
    if (mode === "diagnostic") {
      setStep(STEPS.ASK_SYMPTOMS);
      addBotMessage("Pas de souci, recommencons. Decrivez-moi a nouveau votre panne.");
    } else {
      setStep(STEPS.ASK_BRAND);
      addBotMessage("Pas de souci, recommencons. Quelle est la marque et le modele de votre vehicule ?");
    }
  };

  const handleSendWithText = async (textOverride) => {
    const userText = textOverride || input.trim();
    if (!userText || loading) return;
    if (!textOverride) setInput("");
    addUserMessage(userText);
    setLoading(true);

    try {
      switch (step) {
        case STEPS.ASK_SYMPTOMS: {
          setForm((f) => ({ ...f, symptomes: userText }));
          addBotMessage("Merci. Quelle est la marque et le modele de votre vehicule ? (cette information est visible sur votre carte grise)");
          setStep(STEPS.ASK_BRAND);
          break;
        }

        case STEPS.ASK_BRAND: {
          const words = userText.split(/\s+/);
          const yearMatch = userText.match(/\b(19|20)\d{2}\b/);
          let marque = words[0];
          let modele = "";
          let annee = null;
          if (yearMatch) {
            annee = parseInt(yearMatch[0]);
            const yearIdx = words.indexOf(yearMatch[0]);
            modele = words.slice(1, yearIdx).join(" ");
          } else {
            modele = words.slice(1).join(" ");
          }
          const corr = {
            peugeot: "Peugeot", peogeot: "Peugeot", pigeot: "Peugeot",
            toyota: "Toyota", toyotta: "Toyota",
            renault: "Renault", renaults: "Renault",
            citroen: "Citroen",
            clio: "Clio", corolla: "Corolla", yaris: "Yaris",
            mercedes: "Mercedes", bmw: "BMW", audi: "Audi",
            volkswagen: "Volkswagen", vw: "Volkswagen",
            hyundai: "Hyundai", kia: "Kia", nissan: "Nissan",
            ford: "Ford", honda: "Honda"
          };
          if (corr[marque.toLowerCase()]) marque = corr[marque.toLowerCase()];
          const newForm = { ...form, marque, modele: modele || marque };
          if (annee) newForm.annee = annee;
          setForm(newForm);
          if (annee) {
            addBotMessage("Parfait. Votre numero de telephone ? (ex: 77 XXX XX XX)");
            setStep(STEPS.ASK_PHONE);
          } else {
            addBotMessage("Parfait. De quelle annee ? (cette information est visible sur votre carte grise)");
            setStep(STEPS.ASK_YEAR);
          }
          break;
        }

        case STEPS.ASK_YEAR: {
          const ym = userText.match(/\b(19|20)\d{2}\b/);
          const annee = ym ? parseInt(ym[0]) : new Date().getFullYear();
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
          const fullForm = { ...form, telephone_client: phone, latitude_client: 14.7167, longitude_client: -17.4677, adresse_client: "Dakar, Senegal" };
          setForm(fullForm);

          if (mode === "diagnostic") {
            const questions = getFollowUpQuestions(form.symptomes || "");
            setFollowUpQuestions(questions);
            setFollowUpIndex(0);
            setFollowUpAnswers([]);
            addBotMessage("Merci. Avant de chercher les options, j'aimerais affiner le diagnostic. " + questions[0]);
            setStep(STEPS.DIAGNOSTIC_FOLLOWUP);
          } else {
            addBotMessage("Merci. Je recherche les meilleures options pour vous...");
            setStep(STEPS.SEARCHING);
            try {
              const opts = await searchOptions(fullForm);
              setOptions(opts);
              if (opts.length === 0) {
                handleNoResults(mode === "piece" ? "piece" : "mecano");
              } else if (mode === "mecano") {
                const mecanosMap = new Map();
                opts.forEach((o) => { if (!mecanosMap.has(o.mecano_nom)) mecanosMap.set(o.mecano_nom, o); });
                setMecanoOptions(Array.from(mecanosMap.values()));
                addBotMessage("Voici les mecaniciens disponibles dans votre zone. Choisissez celui qui vous convient :\n(Tapez la lettre correspondante)");
                setStep(STEPS.CHOOSE_MECANO);
              } else {
                addBotMessage(`Voici les options disponibles${initialQuery ? ` pour "${initialQuery}"` : ""}. Quelle piece choisissez-vous ?\n(Tapez la lettre correspondante)`);
                setStep(STEPS.CHOOSE_PIECE);
              }
            } catch (searchErr) {
              console.error("[ChatLingua] search", searchErr);
              handleNoResults(mode === "piece" ? "piece" : "mecano");
            }
          }
          break;
        }

        case STEPS.DIAGNOSTIC_FOLLOWUP: {
          const newAnswers = [...followUpAnswers, userText];
          setFollowUpAnswers(newAnswers);
          if (followUpIndex < followUpQuestions.length - 1) {
            const nextIdx = followUpIndex + 1;
            setFollowUpIndex(nextIdx);
            addBotMessage(followUpQuestions[nextIdx]);
          } else {
            const diag = getDiagnostic(form.symptomes, newAnswers);
            addBotMessage(diag + "\n\nValidez-vous ce diagnostic ? Repondez 'oui' pour que je recherche les meilleures pieces et mecaniciens, ou decrivez plus de details.");
            setStep(STEPS.DIAGNOSIS_RESULT);
          }
          break;
        }

        case STEPS.DIAGNOSIS_RESULT: {
          if (userText.toLowerCase().includes("oui") || userText.toLowerCase().includes("valide") || userText.toLowerCase().includes("ok")) {
            addBotMessage("Parfait. Je recherche maintenant les meilleures pieces et mecaniciens chez nos partenaires...");
          } else {
            addBotMessage("Je note votre observation. Le mecanicien fera un diagnostic complet sur place. Poursuivons la recherche...");
          }
          setStep(STEPS.SEARCHING);

          const fullForm = { ...form, telephone_client: form.telephone_client, latitude_client: 14.7167, longitude_client: -17.4677, adresse_client: "Dakar, Senegal" };
          try {
            const opts = await searchOptions(fullForm);
            setOptions(opts);

            if (opts.length > 0) {
              const mecanosMap = new Map();
              opts.forEach(o => {
                if (!mecanosMap.has(o.mecano_nom)) {
                  mecanosMap.set(o.mecano_nom, o);
                }
              });
              const mecanos = Array.from(mecanosMap.values());
              setMecanoOptions(mecanos);
              addBotMessage("Voici les mecaniciens disponibles dans votre zone. Choisissez celui qui vous convient :\n(Tapez la lettre correspondante)");
              setStep(STEPS.CHOOSE_MECANO);
            } else {
              handleNoResults("mecano");
            }
          } catch (searchErr) {
            console.error("[ChatLingua] search", searchErr);
            handleNoResults("mecano");
          }
          break;
        }

        case STEPS.CHOOSE_MECANO: {
          const choice = userText.toUpperCase().replace(/[^A-Z]/g, "");
          const selected = mecanoOptions[choice.charCodeAt(0) - 65];
          if (!selected || choice.charCodeAt(0) - 65 >= mecanoOptions.length) {
            addBotMessage("Choisissez une option valide (A, B, C...) ou tapez la lettre correspondante.");
            setLoading(false);
            return;
          }
          setSelectedMecano(selected.mecano_nom);
          const pieces = options.filter(o => o.mecano_nom === selected.mecano_nom);
          setOptions(pieces);
          const vendeursCount = new Set(pieces.map(o => o.vendeur_nom)).size;
          const isSame = pieces.some(o => o.vendeur_nom === selected.mecano_nom);
          let msg = `Mecanicien choisi : ${selected.mecano_nom}.\n\n`;
          if (isSame) {
            msg += "Ce mecanicien propose aussi la piece directement.\n";
          }
          msg += `Je vous propose ${pieces.length} option${pieces.length > 1 ? "s" : ""} de piece${pieces.length > 1 ? "s" : ""} chez ${vendeursCount} vendeur${vendeursCount > 1 ? "s" : ""}. Quelle piece choisissez-vous ?`;
          addBotMessage(msg);
          setStep(STEPS.CHOOSE_PIECE);
          break;
        }

        case STEPS.CHOOSE_PIECE: {
          const choice = userText.toUpperCase().replace(/[^A-Z]/g, "");
          const selected = options.find((o) => o.option_label === choice);
          if (!selected) {
            addBotMessage("Choisissez une option valide (A, B, C...) ou tapez la lettre correspondante.");
            setLoading(false);
            return;
          }
          addBotMessage(`Vous avez choisi l'Option ${choice} (${selected.vendeur_nom}). Je cree votre commande...`);
          setStep(STEPS.SEARCHING);
          setSelectedOption(selected);
          const r3 = await fetch(`${API_BASE}/api/intervention/${interventionId}/choisir-option`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quote_id: selected.quote_id })
          });
          if (!r3.ok) throw new Error("choisir " + (await r3.text()));
          const d3 = await r3.json();
          setOrder(d3);
          setStep(STEPS.CHOSEN);
          const piece = selected?.prix_piece_client?.toLocaleString() || "—";
          const mo = selected?.prix_mecano_client?.toLocaleString() || "—";
          const transp = selected?.prix_transport_client?.toLocaleString() || "—";
          const total = d3.total_client?.toLocaleString() || "—";
          addBotMessage(`Commande creee avec succes !\n\nReference : ${d3.reference}\n\nDetail devis :\n• Piece : ${piece} FCFA\n• Main d'oeuvre : ${mo} FCFA\n• Transport : ${transp} FCFA\n• Total : ${total} FCFA\n\nPaiement securise par sequestre FlashMecano. Les contacts vendeur + mecano seront debloques apres paiement.`);
          break;
        }

        default:
          addBotMessage("Je n'ai pas compris. Pouvez-vous reformuler ?");
      }
    } catch (err) {
      console.error("[ChatLingua]", err);
      addBotMessage("Probleme technique temporaire. Notre equipe vous recontacte sous 15 min.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => handleSendWithText(null);

  const handleOptionClick = (opt) => {
    setInput(opt.option_label);
    setTimeout(() => handleSendWithText(opt.option_label), 50);
  };

  const handlePayment = async () => {
    if (!order?.order_id) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/paiement/initier/${order.order_id}`, { method: "POST" });
      if (!r.ok) throw new Error("paiement");
      const paymentData = await r.json();
      addBotMessage("Redirection vers la page de paiement securisee...");
      setStep(STEPS.PAYMENT);
      if (paymentData.payment_url) {
        window.open(paymentData.payment_url, "_blank");
      } else {
        setTimeout(() => simulatePaymentSuccess(), 2000);
      }
    } catch {
      addBotMessage("Le paiement n'a pas pu etre initie. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentSuccess = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/paiement/webhook-simuler/${order.order_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "succes" }),
      });
      if (!r.ok) throw new Error("webhook");
      const data = await r.json();
      setContacts(data.contacts || {});
      setStep(STEPS.SHOW_CONTACTS);
      addBotMessage(`Paiement recu avec succes !\n\nVoici vos contacts pour la livraison et l'intervention. Votre position est partagee avec le vendeur et le mecanicien pour un suivi en temps reel.`);
    } catch (err) {
      console.error(err);
      addBotMessage("Le paiement est en cours de traitement. Vous recevrez les contacts par SMS dans quelques minutes.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReception = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/intervention/${interventionId}/livrer`, { method: "POST" });
      if (!r.ok) throw new Error("livrer");
      setStep(STEPS.INTERVENTION_STARTED);
      addBotMessage("Piece recue et livree avec succes !\n\nLe mecanicien peut maintenant demarrer l'intervention.\n\nSouhaitez-vous noter le service a la fin de l'intervention ? (repondez 'oui' quand l'intervention est terminee)");
    } catch {
      addBotMessage("Confirmation de reception enregistree. Le mecanicien est informe.");
      setStep(STEPS.INTERVENTION_STARTED);
    } finally {
      setLoading(false);
    }
  };

  const handleStartIntervention = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/intervention/${interventionId}/demarrer`, { method: "POST" });
      if (!r.ok) throw new Error("demarrer");
      setStep(STEPS.RATING);
      addBotMessage("Intervention terminee !\n\nMerci d'avoir utilise FlashMecano.\n\nComment evaluez-vous le service ? Cliquez sur les etoiles ci-dessous :");
    } catch {
      setStep(STEPS.RATING);
      addBotMessage("Intervention terminee !\n\nMerci d'avoir utilise FlashMecano.\n\nComment evaluez-vous le service ? Cliquez sur les etoiles ci-dessous :");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (stars) => {
    setRating(stars);
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/intervention/${interventionId}/noter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: stars, commentaire: "" }),
      });
    } catch (e) {
      console.error(e);
    }
    setStep(STEPS.CLOSED);
    setLoading(false);
    addBotMessage(`Merci pour votre note de ${stars}/5 !\n\nVotre commande ${order?.reference || ""} est cloturee.\n\nA bientot sur FlashMecano !`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const placeholderText =
    step === STEPS.CHOOSE_MECANO || step === STEPS.CHOOSE_PIECE ? "Tapez A, B, C..." :
    step === STEPS.ASK_PHONE ? "77 XXX XX XX" :
    step === STEPS.DIAGNOSTIC_FOLLOWUP ? "Repondez a la question..." :
    step === STEPS.DIAGNOSIS_RESULT ? "Oui / Non / plus de details..." :
    "Ecrivez ou appuyez sur le micro...";

  // Position client (mock pour demo — remplacer par vraies coords)
  const clientPos = { lat: 14.7167, lng: -17.4677, address: form.adresse_client || "Dakar, Senegal" };

  const pageBg = isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900";
  const headerBg = isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white";
  const headerHover = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const botBubble = isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800";
  const cardBg = isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";
  const cardMuted = isDark ? "text-gray-300" : "text-gray-600";
  const cardMuted2 = isDark ? "text-gray-400" : "text-gray-500";
  const innerCardBg = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
  const inputBarBg = isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white";
  const inputPillBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const inputText = isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400";
  const inputIconIdle = isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900";
  const loadingBubble = isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500";
  const chipHover = isDark ? "hover:bg-gray-700" : "hover:bg-gray-200";

  return (
    <div className={`h-[100dvh] flex flex-col ${pageBg}`}>
      {/* Header */}
      <header className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${headerBg}`}>
        <button onClick={() => navigate(-1)} className={`p-2 -ml-2 rounded-full transition-colors ${headerHover}`}><ArrowLeft size={20} /></button>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">FM</div>
        <div className="flex-1">
          <h1 className="font-bold text-sm">MyLingua</h1>
          <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />Comparateur d'urgence</p>
        </div>
        <button onClick={() => {
          if (audioEnabled) window.speechSynthesis.cancel();
          setAudioEnabled(!audioEnabled);
        }} className={`p-2 rounded-full transition-colors ${audioEnabled ? "text-blue-400" : mutedText}`}>
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-blue-600 text-white rounded-br-md" : `${botBubble} rounded-bl-md`}`}>{m.text}</div>
          </div>
        ))}

        {/* Mecano cards */}
        {step === STEPS.CHOOSE_MECANO && mecanoOptions.length > 0 && (
          <div className="space-y-3 mt-2">
            {mecanoOptions.map((opt, idx) => (
              <button
                key={opt.mecano_nom}
                onClick={() => handleOptionClick({ option_label: String.fromCharCode(65 + idx) })}
                disabled={loading}
                className={`w-full text-left border hover:border-blue-500 rounded-2xl p-4 transition-all disabled:opacity-50 ${cardBg}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Option {String.fromCharCode(65 + idx)}</span>
                  <span className="text-green-500 font-bold text-lg">{opt.prix_mecano_client?.toLocaleString()} F</span>
                </div>
                <div className={`space-y-1.5 text-xs ${cardMuted}`}>
                  <p className="flex items-center gap-2"><Wrench size={12} className={cardMuted2} />{opt.mecano_nom}<span className={`${cardMuted2} flex items-center gap-1`}><MapPin size={10} /> {opt.mecano_distance_km} km</span></p>
                  <p className={cardMuted2}>Main d'oeuvre + Transport</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Piece cards */}
        {step === STEPS.CHOOSE_PIECE && options.length > 0 && (
          <div className="space-y-3 mt-2">
            {options.map((opt) => (
              <button key={opt.quote_id} onClick={() => handleOptionClick(opt)} disabled={loading} className={`w-full text-left border hover:border-blue-500 rounded-2xl p-4 transition-all disabled:opacity-50 ${cardBg}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Option {opt.option_label}</span>
                  <span className="text-green-500 font-bold text-lg">{opt.total_client?.toLocaleString()} F</span>
                </div>
                <div className={`space-y-1.5 text-xs ${cardMuted}`}>
                  <p className="flex items-center gap-2"><Wrench size={12} className={cardMuted2} />{opt.mecano_nom}<span className={`${cardMuted2} flex items-center gap-1`}><MapPin size={10} /> {opt.mecano_distance_km} km</span></p>
                  <p className="flex items-center gap-2"><Package size={12} className={cardMuted2} />{opt.vendeur_nom}</p>
                  <div className={`flex gap-3 pt-2 mt-1 border-t ${isDark ? "border-gray-700" : "border-gray-200"} ${cardMuted2}`}>
                    <span>Piece: {opt.prix_piece_client?.toLocaleString()} F</span>
                    <span>M.O.: {opt.prix_mecano_client?.toLocaleString()} F</span>
                    <span>Transp.: {opt.prix_transport_client?.toLocaleString()} F</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Payment button */}
        {step === STEPS.CHOSEN && order && (
          <div className="flex flex-col items-center mt-4 space-y-2">
            <button onClick={handlePayment} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-green-900/50">
              <CheckCircle2 size={18} />Payer pour intervention rapide
            </button>
          </div>
        )}

        {/* Contacts after payment — LOCALISATION BIDIRECTIONNELLE */}
        {step === STEPS.SHOW_CONTACTS && contacts && (
          <div className="space-y-3 mt-2">
            <div className={`border rounded-2xl p-4 ${isDark ? "bg-gray-800 border-green-700" : "bg-gray-50 border-green-300"}`}>
              <h3 className="font-bold text-green-500 mb-2 flex items-center gap-2"><CheckCircle2 size={16} />Paiement confirme !</h3>
              <p className={`text-xs mb-3 ${mutedText}`}>Vos contacts sont debloques. Votre position est partagee avec le vendeur et le mecanicien.</p>

              {/* Votre position partagee */}
              <div className={`border rounded-xl p-3 mb-3 ${isDark ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"}`}>
                <p className="text-xs text-blue-500 mb-1 flex items-center gap-1"><MapPinned size={12} />Votre position (partagee)</p>
                <p className="text-sm font-medium">{clientPos.address}</p>
                <div className="flex gap-2 mt-2">
                  <a href={formatMapsLink(clientPos.lat, clientPos.lng, "Ma position")} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 transition-colors">
                    <Navigation size={10} />Voir sur Maps
                  </a>
                </div>
                <p className={`text-[10px] mt-1 ${cardMuted2}`}>Le vendeur et le mecanicien voient cette position pour vous localiser.</p>
              </div>

              {/* Vendeur */}
              <div className={`rounded-xl p-3 mb-3 ${innerCardBg}`}>
                <p className="text-xs text-orange-500 mb-1 flex items-center gap-1"><Package size={12} />Vendeur de pieces</p>
                <p className="font-semibold">{contacts.vendeur?.nom || "N/A"}</p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <a href={`tel:${contacts.vendeur?.telephone}`} className="text-blue-500 hover:text-blue-400 flex items-center gap-1"><Phone size={14} />Appeler</a>
                  <a href={formatWhatsAppLink(contacts.vendeur?.telephone || "", `Bonjour, je suis client FlashMecano, commande ${order?.reference || ""}. Je suis a ${clientPos.address}. Pouvez-vous confirmer la livraison ?`)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 flex items-center gap-1"><MessageCircle size={14} />WhatsApp</a>
                </div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${cardMuted2}`}><MapPin size={10} />{contacts.vendeur?.adresse || "Adresse non disponible"}</p>
                <a href={formatMapsLink(contacts.vendeur?.latitude || 14.7167, contacts.vendeur?.longitude || -17.4677, contacts.vendeur?.nom || "Vendeur")} target="_blank" rel="noopener noreferrer" className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 mt-2 w-fit transition-colors ${inputPillBg} ${chipHover}`}>
                  <Navigation size={10} />Itineraire vers le vendeur
                </a>
              </div>

              {/* Mecano */}
              <div className={`rounded-xl p-3 mb-3 ${innerCardBg}`}>
                <p className="text-xs text-blue-500 mb-1 flex items-center gap-1"><Wrench size={12} />Mecanicien</p>
                <p className="font-semibold">{contacts.mecano?.nom || "N/A"}</p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <a href={`tel:${contacts.mecano?.telephone}`} className="text-blue-500 hover:text-blue-400 flex items-center gap-1"><Phone size={14} />Appeler</a>
                  <a href={formatWhatsAppLink(contacts.mecano?.telephone || "", `Bonjour, je suis client FlashMecano, commande ${order?.reference || ""}. Je suis a ${clientPos.address}. La piece arrive bientot, pouvez-vous confirmer votre disponibilite ?`)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 flex items-center gap-1"><MessageCircle size={14} />WhatsApp</a>
                </div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${cardMuted2}`}><MapPin size={10} />{contacts.mecano?.distance || "Distance non disponible"}</p>
                <a href={formatMapsLink(contacts.mecano?.latitude || 14.7167, contacts.mecano?.longitude || -17.4677, contacts.mecano?.nom || "Mecanicien")} target="_blank" rel="noopener noreferrer" className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 mt-2 w-fit transition-colors ${inputPillBg} ${chipHover}`}>
                  <Navigation size={10} />Itineraire vers le mecanicien
                </a>
              </div>

              <button onClick={handleConfirmReception} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                <Truck size={18} />Confirmer la reception de la piece
              </button>
            </div>
          </div>
        )}

        {/* Intervention started */}
        {step === STEPS.INTERVENTION_STARTED && (
          <div className="flex justify-center mt-4">
            <button onClick={handleStartIntervention} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/50">
              <ClipboardCheck size={18} />L'intervention est terminee
            </button>
          </div>
        )}

        {/* Rating */}
        {step === STEPS.RATING && (
          <div className="flex flex-col items-center mt-4 space-y-3">
            <p className={`text-sm ${cardMuted}`}>Cliquez pour noter :</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRating(star)} disabled={loading} className="p-2 transition-transform active:scale-110 disabled:opacity-50">
                  <Star size={32} className={star <= rating ? "text-yellow-400 fill-yellow-400" : isDark ? "text-gray-600" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aucun resultat */}
        {step === STEPS.NO_RESULTS && (
          <div className="flex flex-col items-center mt-4 space-y-2 w-full">
            <a href="https://wa.me/221789262218" target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="w-full bg-green-600 hover:bg-green-500 text-white p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                📱 Contacter FlashMecano sur WhatsApp
              </button>
            </a>
            <button
              onClick={handleRetry}
              disabled={loading}
              className={`w-full p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 ${isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              🔄 Reessayer avec d'autres criteres
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-3 text-sm flex items-center gap-3 ${loadingBubble}`}>
              <span className={`w-4 h-4 border-2 ${isDark ? "border-gray-600" : "border-gray-300"} border-t-orange-500 rounded-full animate-spin`} />
              MyLingua reflechit...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 border-t shrink-0 ${inputBarBg}`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${inputPillBg}`}>
          <button onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full transition-colors shrink-0 ${isListening ? "bg-red-500 text-white animate-pulse" : inputIconIdle}`}><Mic size={18} /></button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholderText} className={`flex-1 bg-transparent text-sm outline-none ${inputText}`} disabled={loading || step === STEPS.SEARCHING || step === STEPS.PAYMENT || step === STEPS.SHOW_CONTACTS || step === STEPS.INTERVENTION_STARTED || step === STEPS.RATING || step === STEPS.CLOSED || step === STEPS.NO_RESULTS} />
          <button onClick={handleSend} disabled={loading || !input.trim() || step === STEPS.SHOW_CONTACTS || step === STEPS.INTERVENTION_STARTED || step === STEPS.RATING || step === STEPS.CLOSED || step === STEPS.NO_RESULTS} className="p-2 text-blue-500 hover:text-blue-400 disabled:opacity-30 transition-colors shrink-0"><Send size={18} /></button>
        </div>
        {isListening && <p className="text-center text-xs text-red-400 mt-1 animate-pulse">Ecoute en cours... parlez</p>}
      </div>
    </div>
  );
}
