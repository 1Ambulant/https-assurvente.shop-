/* =========================================================================
   MOCK BACKEND MYLINGUA — faux serveur pour démos sans backend réel.
   Renvoie EXACTEMENT le format JSON validé (conversation_id + messages
   typés : text, diagnostic, offer_list, payment_cta), avec un délai de
   1.5s simulant le temps de réflexion de l'IA.
   ========================================================================= */

const GREETING_MESSAGE = {
  id: "msg_001",
  type: "text",
  text: "Décrivez votre panne.",
};

const FULL_SCRIPT_MESSAGES = [
  {
    id: "msg_002",
    type: "diagnostic",
    title: "🧠 Analyse Multi-Symptômes",
    text: "Clic-clac sec + absence de rotation = décharge profonde ou coupure cellule batterie. Ce n'est pas un problème d'alternateur.",
    confidence: 98,
  },
  {
    id: "msg_003",
    type: "offer_list",
    category: "parts",
    label: "✅ 3 vendeurs partenaires ont la batterie 70Ah compatible avec votre Polo 6 TSI.",
    offers: [
      {
        id: "offer_p1",
        title: "Ibrahima Pièces",
        distance_km: 1.2,
        zone: "Keur Massar",
        price: 40000,
        currency: "FCFA",
        tag: null,
        rating: null,
        locked: true,
      },
      {
        id: "offer_p2",
        title: "Auto-Services Keur Massar",
        distance_km: 2.5,
        zone: "Keur Massar",
        price: 42000,
        currency: "FCFA",
        tag: null,
        rating: null,
        locked: true,
      },
      {
        id: "offer_p3",
        title: "Casse Diop",
        distance_km: 3.1,
        zone: "Keur Massar",
        price: 35000,
        currency: "FCFA",
        tag: "OCCASION",
        rating: null,
        locked: true,
      },
    ],
  },
  {
    id: "msg_004",
    type: "offer_list",
    category: "mechanics",
    label: "🔧 Mécaniciens disponibles pour le remplacement immédiat :",
    offers: [
      {
        id: "offer_m1",
        title: "Mamadou Dépannage",
        distance_km: 2,
        zone: "Keur Massar",
        price: 15000,
        currency: "FCFA",
        tag: null,
        rating: 4.8,
        locked: true,
      },
      {
        id: "offer_m2",
        title: "Garage Sérère Auto",
        distance_km: 3,
        zone: "Keur Massar",
        price: 20000,
        currency: "FCFA",
        tag: null,
        rating: 4.9,
        locked: true,
      },
      {
        id: "offer_m3",
        title: "Omar Mécanique",
        distance_km: 4,
        zone: "Keur Massar",
        price: 12000,
        currency: "FCFA",
        tag: "NOUVEAU",
        rating: null,
        locked: true,
      },
    ],
  },
  {
    id: "msg_005",
    type: "payment_cta",
    text: "Faites votre choix. Une fois sélectionnés, les prix sont figés. Zéro négociation sur site, zéro surprise.",
    total_amount: 47000,
    currency: "FCFA",
    breakdown: [
      { label: "Casse Diop (pièce, occasion)", ref_offer_id: "offer_p3", amount: 35000 },
      { label: "Main d'œuvre — Omar Mécanique", ref_offer_id: "offer_m3", amount: 12000 },
    ],
    mission_id: "mission_a91f",
  },
];

const MOCK_DELAY_MS = 1500;

/* Simule POST /api/lingua/chat. Le premier appel ("init", envoyé au montage
   du chat) ne renvoie que la salutation. Tout message utilisateur suivant
   (texte ou vocal, peu importe le contenu) déclenche le script complet :
   diagnostic + offres pièces + offres mécaniciens + bouton de paiement. */
export function fetchMockLinguaResponse({ conversationId, message }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isInit = message?.type === "init";
      resolve({
        conversation_id: conversationId || "conv_mock_demo",
        messages: isInit ? [GREETING_MESSAGE] : FULL_SCRIPT_MESSAGES,
      });
    }, MOCK_DELAY_MS);
  });
}
