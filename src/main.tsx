// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { VXProvider } from '@/context/VXProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VXProvider>
      <App />
    </VXProvider>
  </React.StrictMode>
);
