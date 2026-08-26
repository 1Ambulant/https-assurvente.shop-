import { useEffect } from "react";
import { SITE_URL } from "./seoConfig";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Met a jour title/description/canonical/OG/Twitter/robots au montage d'une
// page, pour que la navigation cote client (React Router) reflete des
// metadonnees propres a chaque route -- en complement du prerendering
// statique (scripts/prerender-seo.mjs) qui couvre le premier chargement/HTML
// brut vu par les robots. Ne touche a aucune logique metier.
export default function useSeo({ path, title, description, noindex = false }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    if (title) document.title = title;

    if (!noindex) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:title", title);
      upsertMeta("property", "og:description", description);
      upsertMeta("property", "og:url", url);
      upsertMeta("name", "twitter:title", title);
      upsertMeta("name", "twitter:description", description);
      upsertCanonical(url);
    }
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [path, title, description, noindex]);
}
