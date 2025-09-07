// src/components/ui/input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => (
  <input {...props} style={{ padding: '0.5em', border: '1px solid #ccc' }} />
);
