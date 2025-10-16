// src/components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Where to go if there’s no browser history */
  fallback?: string;
  /** Extra classes if you need different styling in some pages */
  className?: string;
  /** Optional custom label (defaults to “Back”) */
  label?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ fallback = "/", className = "", label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there is navigable history, go back; otherwise use the fallback route
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }

    // Scroll to top after nav
    setTimeout(() => {
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`flex items-center text-sm text-blue-600 hover:text-blue-800 transition ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      {label}
    </button>
  );
};

export default BackButton;

