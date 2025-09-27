export function toReflexFrame(vx, i = 0) {
    const anyVX = vx;
    return {
        id: vx.reflexId || `vx-${i}`,
        label: vx.reflexLabel || vx.reflexId || "vx",
        confidence: vx.confidence ?? 0,
        rationale: vx.rationale ?? "",
        fragment: anyVX.fragment,
        explanation: anyVX.explanation,
        tone: anyVX.tone ?? "neutral"
    };
}
