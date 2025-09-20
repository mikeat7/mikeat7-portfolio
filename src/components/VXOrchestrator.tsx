// src/components/VXOrchestrator.tsx
import React, { useEffect } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import codex from '@/data/front-end-codex.v0.9.json';
import { shouldTriggerReflex, emitTelemetry } from '@/lib/codex-runtime';
import type { VXFrame } from '@/types/VXTypes';

const reflexKey = (id: string): string | undefined => {
  const low = id.toLowerCase();
  if (low.startsWith('vx-da')) return 'data_less_claim';
  if (low.startsWith('vx-fp')) return 'false_precision';
  if (low.startsWith('vx-ha')) return 'hallucination';
  if (low.startsWith('vx-os')) return 'omission';
  if (low.startsWith('vx-pc')) return 'perceived_consensus';
  if (low.startsWith('vx-tu')) return 'tone_urgency';
  if (low.startsWith('vx-ed')) return 'ethical_drift';
  if (low.startsWith('vx-em')) return 'emotional_manipulation';
  if (low.startsWith('vx-so')) return 'speculative_authority';
  // leave others (e.g., rhetorical interruption) ungated by codex thresholds
  return undefined;
};

interface Props {
  input: string;
  mode?: '--direct' | '--careful' | '--recap';
  stakes?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

const VXOrchestrator: React.FC<Props> = ({ input, mode = '--careful', stakes = 'medium', children }) => {
  const { setLatestInput, setReflexFrames } = useVXContext();

  useEffect(() => {
    if (!input) return;
    setLatestInput(input);

    (async () => {
      const frames = await runReflexAnalysis(input);

      // Apply codex thresholds where we have a mapping
      const gated: VXFrame[] = [];
      for (const f of frames) {
        const key = reflexKey(f.reflexId);
        if (!key) { gated.push(f); continue; }

        const { trigger, block } = shouldTriggerReflex(
          codex as any,
          key,
          f.confidence ?? 0,
          stakes
        );
        if (block) {
          // Optionally you could set a banner in context here.
          // For now we just skip pushing any more frames if a hard block is signaled.
          break;
        }
        if (trigger) gated.push(f);
      }

      setReflexFrames(gated);
      emitTelemetry(codex as any, { name: 'analysis_complete', data: {
        mode, stakes, triggered_reflexes: gated.map(x => x.reflexId)
      }}, (e) => console.log('[telemetry]', e));
    })();
  }, [input, mode, stakes, setLatestInput, setReflexFrames]);

  return <>{children}</>;
};

export default VXOrchestrator;
