const API_BASE = "/api";

async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("fm_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Erreur ${res.status}`);
  }
  return res.json();
}

export const api = {
  creerIntervention: (body) => apiFetch("/intervention/creer", { method: "POST", body: JSON.stringify(body) }),
  chercherOptions: (id) => apiFetch(`/intervention/${id}/chercher-options`, { method: "POST" }),
  choisirOption: (id, quote_id) => apiFetch(`/intervention/${id}/choisir-option`, { method: "POST", body: JSON.stringify({ quote_id }) }),
  initierPaiement: (order_id) => apiFetch(`/paiement/initier/${order_id}`, { method: "POST" }),
  simulerWebhook: (order_id) => apiFetch(`/paiement/webhook-simuler/${order_id}`, { method: "POST" }),
  validerReception: (order_id, valideur = "mecano") => apiFetch(`/paiement/valider-reception/${order_id}?valideur=${valideur}`, { method: "POST" }),
  demarrerIntervention: (order_id) => apiFetch(`/paiement/demarrer-intervention/${order_id}`, { method: "POST" }),
  noterIntervention: (order_id, params) => apiFetch(`/paiement/noter-intervention/${order_id}?${new URLSearchParams(params).toString()}`, { method: "POST" }),
  getHistorique: (tel) => apiFetch(`/client/historique/${tel}`),
  getAdminCompta: () => apiFetch("/admin/flashmecano/comptabilite"),
  getPartnerAccount: () => apiFetch("/partner/flashmecano/mon-compte"),
  demanderRetrait: (body) => apiFetch("/partner/flashmecano/demander-retrait", { method: "POST", body: JSON.stringify(body) }),
  getPartnerRetraits: () => apiFetch("/partner/flashmecano/mes-retraits"),
  getQrCode: (order_id) => apiFetch(`/tracking/qr-code/${order_id}`),
  enregistrerPosition: (body) => apiFetch("/tracking/position", { method: "POST", body: JSON.stringify(body) }),
  getPositions: (order_id) => apiFetch(`/tracking/position/${order_id}`),
};

export default api;