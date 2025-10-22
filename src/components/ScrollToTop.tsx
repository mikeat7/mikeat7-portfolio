// src/components/ScrollToTop.tsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    // Always start at top on route change (helps Firefox/Chrome mobile)
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }

    const jump = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run synchronously before paint, then once more right after
    jump();
    setTimeout(jump, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;


