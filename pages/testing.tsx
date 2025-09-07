// src/pages/testing.tsx
import React from 'react';
import TestingSuite from '@/components/TestingSuite';
import BackButton from '@/components/BackButton';

const TestingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <BackButton />
        <TestingSuite />
      </div>
    </div>
  );
};

export default TestingPage;