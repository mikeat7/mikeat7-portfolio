// src/components/ScrollToTop.tsx
import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Ensure the browser doesn't restore scroll between SPA navigations
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = (history as any).scrollRestoration;
      (history as any).scrollRestoration = "manual";
      return () => {
        (history as any).scrollRestoration = prev ?? "auto";
      };
    }
  }, []);

  useLayoutEffect(() => {
    const id = hash?.replace("#", "");
    const toTop = () => {
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
          return;
        }
      }
      // Hit all targets to satisfy iOS/Safari/Firefox quirks
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    // Do it now (pre-paint), then again after layout settles
    toTop();
    const t0 = setTimeout(toTop, 0);
    const t1 = setTimeout(toTop, 120);
    const t2 = setTimeout(toTop, 300);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, hash]);

  return null;
}

