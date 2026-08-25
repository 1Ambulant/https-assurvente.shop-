import { useState, useRef, useEffect, useCallback } from "react";
import { Send, ArrowLeft, Wrench, MapPin, Package, CheckCircle2, Mic, Volume2, VolumeX, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../lib/api";

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
  const [selectedMecano, setSelectedMecano] = useState(null);
  const [mecanoOptions, setMecanoOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  // P9 : contrat reel = paydunia_url (jamais url_paiement/payment_url).
  // Stocke uniquement ce que /payment/initiate renvoie reellement.
  const [paymentInfo, setPaymentInfo] = useState(null);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const greetedRef = useRef(false);
  // Bloc B (P9 -> confirmation reelle) : IDs de timers en useRef, jamais en
  // state, pour eviter tout re-render inutile et permettre un cleanup fiable.
  const pollIntervalRef = useRef(null);
  const pollTimeoutRef = useRef(null);

  const speak = useCallback((text) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/MyLingua/g, "My Lingua"));
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
  }, [messages, options, loading, contacts]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Bloc B : cleanup dedie au polling de paiement, separe du useEffect
  // speechSynthesis ci-dessus pour ne pas melanger les responsabilites.
  useEffect(() => {
    return () => {
      stopPaymentPolling();
    };
  }, []);

  const addBotMessage = (text) => {
    setMessages((p) => [...p, { role: "bot", text }]);
    speak(text);
  };
  const addUserMessage = (text) => setMessages((p) => [...p, { role: "user", text }]);

  // P5 (mission_intake.py) : intention n'a que 2 valeurs cote backend reel
  // ("panne" ou "piece") -- mode="mecano" est mappe sur "panne" (need_type
  // "breakdown"), seule valeur qui declenche la recherche mecanicien cote
  // mission_offers.py. Mapping confirme par le contrat P5, pas invente.
  const buildIntakeBody = (fullForm) => {
    const intention = mode === "piece" ? "piece" : "panne";
    let piece_recherchee = null;
    if (mode === "piece" && typeof fullForm.symptomes === "string") {
      const match = fullForm.symptomes.match(/^Recherche piece:\s*(.+)$/i);
      if (match) piece_recherchee = match[1].trim();
    }
    return {
      telephone_client: fullForm.telephone_client,
      intention,
      marque: fullForm.marque || null,
      modele: fullForm.modele || null,
      annee: fullForm.annee || null,
      symptomes: fullForm.symptomes || null,
      piece_recherchee,
      latitude_client: fullForm.latitude_client ?? null,
      longitude_client: fullForm.longitude_client ?? null,
      adresse_client: fullForm.adresse_client || null,
      photo_url: null,
    };
  };

  // P6 (mission_offers.py) : la reponse reelle separe les offres par
  // categorie ("parts" ou "mechanics"), jamais les deux a la fois pour une
  // seule intention -- adapte ici vers la forme "options" plate deja
  // consommee par l'UI existante (CHOOSE_MECANO / CHOOSE_PIECE), sans
  // inventer de prix transport ni de total combine qui n'existent plus
  // cote backend reel.
  const adaptOffersResponse = (offersData) => {
    const labels = "ABCDEFGHIJ";
    let labelIdx = 0;
    const adapted = [];
    for (const block of offersData.messages || []) {
      if (block.type !== "offer_list") continue;
      for (const o of block.offers || []) {
        adapted.push({
          option_label: labels[labelIdx] || String(labelIdx + 1),
          offer_id: o.id,
          quote_id: `${block.category}:${o.id}`,
          category: block.category,
          mecano_nom: block.category === "mechanics" ? o.title : null,
          vendeur_nom: block.category === "parts" ? o.title : null,
          mecano_distance_km: o.distance_km,
          prix_piece_client: block.category === "parts" ? o.price : null,
          prix_mecano_client: block.category === "mechanics" ? o.price : null,
          prix_transport_client: null,
          total_client: o.price,
          zone: o.zone,
          tag: o.tag,
          rating: o.rating,
        });
        labelIdx += 1;
      }
    }
    return adapted;
  };

  const searchOptions = async (fullForm) => {
    const r1 = await fetch(`${API_BASE}/api/mission/intake`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildIntakeBody(fullForm)) });
    if (!r1.ok) throw new Error("intake " + (await r1.text()));
    const d1 = await r1.json();
    setInterventionId(d1.mission_id);

    const r2 = await fetch(`${API_BASE}/api/mission/${d1.mission_id}/offers`, { method: "GET" });
    if (!r2.ok) throw new Error("offers " + (await r2.text()));
    const d2 = await r2.json();
    return adaptOffersResponse(d2);
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
          addBotMessage(`Mecanicien choisi : ${selected.mecano_nom}. Verrouillage de la selection...`);
          setStep(STEPS.SEARCHING);
          try {
            const rLock = await fetch(`${API_BASE}/api/mission/${interventionId}/select`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category: "mechanics", offer_id: selected.offer_id }),
            });
            if (!rLock.ok) throw new Error("select " + (await rLock.text()));
            const lockData = await rLock.json();
            if (!lockData.locked) {
              addBotMessage(`Selection impossible (${lockData.reason || "raison inconnue"}). Reessayez.`);
              setStep(STEPS.CHOOSE_MECANO);
              break;
            }
            setOrder({ mission_id: interventionId, selection: lockData.selection });
            setStep(STEPS.CHOSEN);
            const offer = lockData.selection?.offer || {};
            addBotMessage(`Selection verrouillee !\n\nCategorie : Mecanicien\n${offer.title || "-"}\nPrix : ${offer.price != null ? offer.price.toLocaleString() : "-"} ${offer.currency || "FCFA"}`);
          } catch (selectErr) {
            console.error("[ChatLingua] select mechanics", selectErr);
            addBotMessage("Probleme technique lors du verrouillage. Reessayez.");
            setStep(STEPS.CHOOSE_MECANO);
          }
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
          addBotMessage(`Vous avez choisi l'Option ${choice} (${selected.vendeur_nom}). Verrouillage de la selection...`);
          setStep(STEPS.SEARCHING);
          setSelectedOption(selected);
          try {
            const r3 = await fetch(`${API_BASE}/api/mission/${interventionId}/select`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category: "parts", offer_id: selected.offer_id }),
            });
            if (!r3.ok) throw new Error("select " + (await r3.text()));
            const d3 = await r3.json();
            if (!d3.locked) {
              addBotMessage(`Selection impossible (${d3.reason || "raison inconnue"}). Reessayez.`);
              setStep(STEPS.CHOOSE_PIECE);
              break;
            }
            setOrder({ mission_id: interventionId, selection: d3.selection });
            setStep(STEPS.CHOSEN);
            const offer = d3.selection?.offer || {};
            addBotMessage(`Selection verrouillee !\n\nCategorie : Piece\n${offer.title || "-"}\nPrix : ${offer.price != null ? offer.price.toLocaleString() : "-"} ${offer.currency || "FCFA"}`);
          } catch (selectErr) {
            console.error("[ChatLingua] select parts", selectErr);
            addBotMessage("Probleme technique lors du verrouillage. Reessayez.");
            setStep(STEPS.CHOOSE_PIECE);
          }
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

  // Bloc B : lit EXCLUSIVEMENT payment.payment_status (jamais payment.status,
  // qui reste "computed" pour toujours et n'est pas le statut du paiement).
  const checkPaymentStatus = async (missionId) => {
    try {
      const r = await fetch(`${API_BASE}/api/mission/${missionId}/payment`);
      if (!r.ok) return { ok: false };
      const data = await r.json();
      if (!data.found) return { ok: true, payment_status: null };
      return { ok: true, payment_status: data.payment?.payment_status || null };
    } catch (e) {
      console.error("[ChatLingua] checkPaymentStatus", e);
      return { ok: false };
    }
  };

  const stopPaymentPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  // Intervalle 5s / timeout 5min valides par vous. Un seul polling actif a
  // la fois : stopPaymentPolling() est appele en tete pour eviter tout
  // setInterval duplique.
  const startPaymentPolling = (missionId) => {
    stopPaymentPolling();

    pollIntervalRef.current = setInterval(async () => {
      const result = await checkPaymentStatus(missionId);
      if (!result.ok) return; // erreur transitoire (HTTP non OK ou reseau) : on continue le polling
      const status = result.payment_status; // null si found:false -- jamais traite comme un echec

      if (status === "paye") {
        stopPaymentPolling();
        setPaymentInfo((p) => ({ ...p, payment_status: "paye" }));
        setStep(STEPS.CLOSED);
        addBotMessage("Votre paiement a ete confirme avec succes.\n\nVotre demande a ete transmise au partenaire concerne. Vous pourrez suivre l'evolution de votre demande depuis votre historique.\n\nMerci d'avoir utilise FlashMecano.");
      } else if (status === "echec") {
        stopPaymentPolling();
        setPaymentInfo((p) => ({ ...p, payment_status: "echec" }));
        setStep(STEPS.CLOSED);
        addBotMessage("Le paiement a echoue.\n\nAucune commande n'a ete validee. Vous pouvez nous contacter via WhatsApp au +221 78 926 22 18 si besoin.");
      } else if (status === "annule") {
        stopPaymentPolling();
        setPaymentInfo((p) => ({ ...p, payment_status: "annule" }));
        setStep(STEPS.CLOSED);
        addBotMessage("Le paiement a ete annule.\n\nVous pouvez nous contacter via WhatsApp au +221 78 926 22 18 si besoin.");
      }
      // "pending" ou found:false (status === null) : on continue silencieusement.
    }, 5000);

    pollTimeoutRef.current = setTimeout(() => {
      stopPaymentPolling();
      addBotMessage("Votre paiement est toujours en attente de confirmation.\n\nSi vous avez effectue le paiement, sa validation peut prendre quelques instants. Vous pourrez verifier son statut plus tard.");
    }, 5 * 60 * 1000);
  };

  // BLOC A (P8+P9) : interventionId est la seule source de verite pour
  // mission_id depuis P7 -- order.order_id n'existe plus dans ce contrat,
  // jamais utilise ici. Ne simule aucun succes, n'appelle jamais le
  // webhook : apres l'initiation, le paiement reste "pending" jusqu'au
  // vrai callback PayDunya (hors perimetre de ce bloc).
  const handlePayment = async () => {
    if (!interventionId) return;
    setLoading(true);
    try {
      const r8 = await fetch(`${API_BASE}/api/mission/${interventionId}/payment/compute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!r8.ok) throw new Error("compute " + (await r8.text()));
      const d8 = await r8.json();
      if (!d8.computed || !d8.payment) {
        addBotMessage(`Calcul du paiement impossible (${d8.reason || "raison inconnue"}). Reessayez.`);
        return;
      }
      setOrder((o) => ({
        ...o,
        payment: { id: d8.payment.id, client_amount: d8.payment.client_amount, status: d8.payment.status },
      }));

      const r9 = await fetch(`${API_BASE}/api/mission/${interventionId}/payment/initiate`, { method: "POST" });
      if (!r9.ok) throw new Error("initiate " + (await r9.text()));
      const d9 = await r9.json();
      if (!d9.paydunia_url) {
        addBotMessage(`Initiation du paiement impossible (${d9.reason || "raison inconnue"}). Reessayez.`);
        return;
      }

      setPaymentInfo({ paydunia_url: d9.paydunia_url, payment_status: d9.payment_status });
      addBotMessage("Redirection vers la page de paiement securisee. Le paiement reste en attente de confirmation.");
      setStep(STEPS.PAYMENT);
      window.open(d9.paydunia_url, "_blank");
      startPaymentPolling(interventionId);
    } catch (err) {
      console.error("[ChatLingua] handlePayment", err);
      addBotMessage("Le paiement n'a pas pu etre initie. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentSuccess = async () => {
    setLoading(true);
    try {
      // Le backend local /webhook-simuler/{order_id} ne lit aucun corps de
      // requete (statut toujours force a "paye") -- aucun corps envoye ici.
      const r = await fetch(`${API_BASE}/api/paiement/webhook-simuler/${order.order_id}`, {
        method: "POST",
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const placeholderText =
    step === STEPS.CHOOSE_MECANO || step === STEPS.CHOOSE_PIECE ? "Tapez A, B, C..." :
    step === STEPS.ASK_PHONE ? "77 XXX XX XX" :
    step === STEPS.DIAGNOSTIC_FOLLOWUP ? "Repondez a la question..." :
    step === STEPS.DIAGNOSIS_RESULT ? "Oui / Non / plus de details..." :
    "Ecrivez ou appuyez sur le micro...";

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

        {/* Bloc 3 : secours si l'ouverture automatique (window.open) a ete
            bloquee par le navigateur -- ouvre exactement paymentInfo.paydunia_url,
            ne touche pas au polling, ne considere jamais le paiement reussi ici :
            le seul statut reel reste payment.payment_status === "paye" (polling). */}
        {step === STEPS.PAYMENT && paymentInfo?.paydunia_url && (
          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className={`text-xs text-center ${mutedText}`}>Si la page de paiement ne s'est pas ouverte automatiquement :</p>
            <a href={paymentInfo.paydunia_url} target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="w-full bg-green-600 hover:bg-green-500 text-white p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                <CheckCircle2 size={18} />Ouvrir la page de paiement
              </button>
            </a>
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
