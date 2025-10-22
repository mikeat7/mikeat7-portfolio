// src/components/ScrollManager.tsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function resetAll() {
  const scroller = document.scrollingElement || document.documentElement;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  (scroller as HTMLElement).scrollTop = 0;

  // Also reset any opt-in inner scrollers
  document.querySelectorAll<HTMLElement>("[data-reset-scroll]").forEach(el => {
    el.scrollTop = 0;
    el.scrollLeft = 0;
  });
}

export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // Take control from the browser so it doesn't restore previous Y
    if ("scrollRestoration" in window.history) {
      try { window.history.scrollRestoration = "manual"; } catch {}
    }
  }, []);

  useEffect(() => {
    // 1) Don’t fight anchors
    if (hash) return;

    // 2) Only reset on forward navigations (PUSH/REPLACE)
    if (navType === "POP") return;

    // 3) Run after paint; do it twice to defeat late layout shifts
    requestAnimationFrame(() => {
      resetAll();
      requestAnimationFrame(() => resetAll());
    });
  }, [pathname, search, hash, navType]);

  return null;
}
