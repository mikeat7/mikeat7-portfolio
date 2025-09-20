import React from "react";
import codex from "@/data/front-end-codex.v0.9.json";
import { failureText, type FailureKind } from "@/lib/codex-runtime";

interface Props {
  kind: "refuse" | "hedge" | "ask_clarify";
  onAction?: () => void;
  className?: string;
}

export const FailureBanner: React.FC<Props> = ({ kind, onAction, className }) => {
  const { text, action } = failureText(codex as any, kind);

  const actionLabel =
    action === "offer_alternatives"
      ? "See alternatives"
      : action === "show_confidence_and_next_steps"
      ? "Improve confidence"
      : "Clarify";

  return (
    <div
      className={
        "rounded-lg border p-3 text-sm bg-yellow-50 border-yellow-300 text-yellow-900 " +
        (className ?? "")
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">⚠️</div>
        <div className="flex-1">
          <p className="mb-2">{text}</p>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-gray-50"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FailureBanner;
