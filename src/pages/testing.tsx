// src/pages/testing.tsx
import React from 'react';
import TestingSuite from '@/components/TestingSuite';
import BackButton from '@/components/BackButton';

const TestingPage: React.FC = () => {
  return (
    <div className="ins-page py-8">
      <div className="max-w-6xl mx-auto px-4">
        <BackButton className="!text-ins-teal hover:!text-ins-goldbright" />
        <TestingSuite />
      </div>
    </div>
  );
};

export default TestingPage;