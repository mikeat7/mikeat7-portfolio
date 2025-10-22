// src/components/ScrollManager.tsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Robust scroll normalizer for SPA navigations:
 * - PUSH / REPLACE => force top (phones/desktop)
 * - POP (back/forward) => let browser restore position
 * Handles mobile focus + scroll anchoring quirks.
 */
export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Force manual restoration for SPAs (some browsers ignore this unless set often)
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const isPop = navType === "POP";
    const sameKey = lastKeyRef.current === (location as any).key;
    lastKeyRef.current = (location as any).key;

    if (isPop && !sameKey) {
      // Let the browser restore on back/forward
      return;
    }

    // On PUSH/REPLACE, hard-reset to top

    // 0) blur any focused element (mobile caret can force scroll)
    if (document.activeElement instanceof HTMLElement) {
      try {
        document.activeElement.blur();
      } catch {
        /* ignore */
      }
    }

    // helper: set both roots
    const setTop = (top = 0) => {
      // Some engines use documentElement, others use body
      document.documentElement.scrollTop = top;
      document.body.scrollTop = top;
      // Also call the formal API
      window.scrollTo({ top, left: 0, behavior: "auto" });
    };

    // 1) immediate
    setTop(0);

    // 2) next frame (after layout)
    const raf = requestAnimationFrame(() => setTop(0));

    // 3) after a short delay (late images/webfonts/anchor shifts)
    const t = setTimeout(() => setTop(0), 80);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [location.pathname, location.search, navType]);

  return null;
}

