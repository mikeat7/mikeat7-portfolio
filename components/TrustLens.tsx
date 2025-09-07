import React from 'react';
import { useVXContext } from "@/context/VXContext";
import ReflexInfoDrawer from './ReflexInfoDrawer';
import CoFirePanel from './CoFirePanel';


const TrustLens: React.FC = () => {
  const { reflexFrames } = useVXContext();

  return (
    <div className="bg-white shadow rounded-lg p-6">
    
      <h2 className="text-xl font-semibold mb-4">Reflex Summary</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reflexFrames.map((r) => (
          <li
            key={r.id}
            className={`p-4 rounded border-l-4 ${
              r.score > 0.7 ? 'border-red-500 bg-red-50' :
              r.score > 0.4 ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}
          >
            <p className="font-medium text-gray-800">{r.label}</p>
            <p className="text-sm">Score: {(r.score * 100).toFixed(1)}%</p>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <CoFirePanel />
        <ReflexInfoDrawer input={reflexFrames.map(r => r.label).join('; ')} />
      </div>
    </div>
  );
};

export default TrustLens;
