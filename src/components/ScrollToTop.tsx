// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Disable browser's saved scroll so we always start at top
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {/* ignore */}
    }

    const jumpTop = () => {
      // Be extra explicit for mobile browsers
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Do it on next paint, then once more after layout settles
    requestAnimationFrame(() => {
      jumpTop();
      setTimeout(jumpTop, 0);
    });
  }, [pathname, search]); // keep hash intact for in-page anchors

  return null;
};

export default ScrollToTop;

