import { jsx as _jsx } from "react/jsx-runtime";
// src/context/VXProvider.tsx
import { createContext, useContext, useState } from 'react';
export const VXContext = createContext(undefined);
export function useVXContext() {
    const ctx = useContext(VXContext);
    if (!ctx)
        throw new Error('useVXContext must be used within a VXProvider');
    return ctx;
}
export const VXProvider = ({ children }) => {
    const [reflexFrames, setReflexFrames] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [latestInput, setLatestInput] = useState('');
    return (_jsx(VXContext.Provider, { value: {
            reflexFrames,
            setReflexFrames,
            isAnalyzing,
            setIsAnalyzing,
            latestInput,
            setLatestInput,
        }, children: children }));
};
