// src/components/ui/slider.tsx

import * as React from 'react';

// SCAFFOLD: Basic slider input
export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider: React.FC<SliderProps> = (props) => (
  <input type="range" {...props} />
);
