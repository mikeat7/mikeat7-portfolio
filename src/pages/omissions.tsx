// src/pages/omissions.tsx
import React from 'react';
import OmissionHandler from '@/components/OmissionHandler';
import BackButton from '@/components/BackButton';

const OmissionsPage = () => {
  return (
    <div className="ins-page">
      <div className="max-w-4xl mx-auto p-8">
        <BackButton className="!text-ins-teal hover:!text-ins-goldbright" />
        <OmissionHandler />
      </div>
    </div>
  );
};

export default OmissionsPage;