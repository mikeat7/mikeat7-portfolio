// File: src/components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back
    </button>
  );
};

export default BackButton;
