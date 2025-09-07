// src/pages/omissions.tsx
import React from 'react';
import OmissionHandler from '@/components/OmissionHandler';
import BackButton from '@/components/BackButton';

const OmissionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <BackButton />
        <OmissionHandler />
      </div>
    </div>
  );
};

export default OmissionsPage;