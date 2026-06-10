// src/components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Force navigation to this route — bypasses browser history entirely */
  to?: string;
  /** Where to go if there is no browser history */
  fallback?: string;
  /** Extra classes if you need different styling in some pages */
  className?: string;
  /** Optional custom label (defaults to Back) */
  label?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ to, fallback = "/", className = "", label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      // Explicit destination — ignore history
      navigate(to);
    } else if (typeof window !== "undefined" && window.history.length > 1) {
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
