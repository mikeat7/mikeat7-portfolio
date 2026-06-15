// src/components/ScrollManager.tsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const lastKeyRef = useRef<string | null>(null);

  // Set manual restoration once
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try { window.history.scrollRestoration = "manual"; } catch {}
    }
  }, []);

  useEffect(() => {
    const isPop = navType === "POP";
    const thisKey = (location as any).key;
    const sameKey = lastKeyRef.current === thisKey;
    lastKeyRef.current = thisKey;

    if (isPop && !sameKey) {
      // Back/forward: allow native restoration
      return;
    }

    // Temporarily clamp browser behaviors that fight us
    const root = document.documentElement;
    const prevScrollBehavior = root.style.scrollBehavior;
    const prevOverflowAnchor = root.style.overflowAnchor as string | undefined;

    root.style.scrollBehavior = "auto";
    root.style.overflowAnchor = "none";

    // Blur any focused input (mobile caret causes y-remember)
    if (document.activeElement instanceof HTMLElement) {
      try { document.activeElement.blur(); } catch {}
    }

    // Helper to set scroll on all likely targets.
    // THE REAL FIX (2026-06): `html,body,#root { height:100%; overflow-x:hidden }`
    // makes #root the actual vertical scroll container (overflow-x:hidden promotes
    // overflow-y to auto). Past attempts only reset window/documentElement/body —
    // never #root — so they could never move the real scroll position. Reset it too.
    const rootEl = document.getElementById("root");
    const setTop = () => {
      if (rootEl) rootEl.scrollTop = 0;
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    // Pass 1: sync
    setTop();

    // Pass 2: next frame
    const raf1 = requestAnimationFrame(setTop);

    // Pass 3: short delay (late layout)
    const t80 = setTimeout(setTop, 80);

    // Pass 4: slightly later (images/webfonts on mobile)
    const t140 = setTimeout(setTop, 140);

    // Cleanup + restore original styles so your normal smooth scrolling works elsewhere
    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t80);
      clearTimeout(t140);
      // restore styles
      root.style.scrollBehavior = prevScrollBehavior;
      // undefined/empty strings both clear inline style
      if (prevOverflowAnchor) root.style.overflowAnchor = prevOverflowAnchor;
      else root.style.removeProperty("overflow-anchor");
    };
  }, [location.pathname, location.search, navType]);

  return null;
}
