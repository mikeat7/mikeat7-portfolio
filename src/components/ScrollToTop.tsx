// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll on route changes.
 * - Ignores querystring-only changes (so /analyze ?tab switches don’t jump).
 * - If there's a hash (#anchor), scrolls to that element after mount.
 * - Otherwise, scrolls to top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Wait a tick for the new route to paint
    const id = hash?.replace("#", "");
    const t = setTimeout(() => {
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);

    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
