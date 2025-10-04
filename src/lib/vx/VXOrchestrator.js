// src/lib/vx/VXOrchestrator.ts
import { useEffect } from 'react';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import { useVXContext } from '@/context/VXContext';
const VXOrchestrator = ({ input }) => {
    const { setReflexFrames } = useVXContext();
    useEffect(() => {
        const runAnalysis = async () => {
            if (input && input.length > 10) {
                const results = await runReflexAnalysis(input);
                setReflexFrames(results);
            }
        };
        runAnalysis();
    }, [input]);
    return null;
};
export default VXOrchestrator;
