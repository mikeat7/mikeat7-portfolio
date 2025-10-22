// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Turn off the browser's scroll restoration so SPA controls it.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = (history as any).scrollRestoration;
      (history as any).scrollRestoration = "manual";
      return () => {
        (history as any).scrollRestoration = prev ?? "auto";
      };
    }
  }, []);

  useEffect(() => {
    const id = hash?.replace("#", "");
    const scrollTop = () => {
      const el = document.scrollingElement || document.documentElement;
      if (id) {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
          return;
        }
      }
      // Force to absolute top (covers iOS/Firefox quirks)
      (el as HTMLElement).scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    // Multi-pass: next frame + small delays to beat late layout/font paint
    const raf = requestAnimationFrame(scrollTop);
    const t0 = setTimeout(scrollTop, 0);
    const t1 = setTimeout(scrollTop, 60);
    const t2 = setTimeout(scrollTop, 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, hash]);

  return null;
}

