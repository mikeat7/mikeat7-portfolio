// VX-FP01 — False Precision Detector
// Flags overly precise statistics or misleading numeric certainty.
const falsePrecisionPatterns = [
    {
        regex: /\b\d{2}\.\d{10,}\b/g,
        rationale: "Overly precise number without meaningful justification.",
    },
    {
        regex: /\b(?:exactly|precisely|down to the penny)\b/gi,
        rationale: "Gives false impression of certainty using absolute modifiers.",
    },
    {
        regex: /\b(?:98\.7654321%|100\.000000%|0\.000001%)\b/g,
        rationale: "Unrealistically exact percentages intended to persuade.",
    },
];
const detectFalsePrecision = (text) => {
    const frames = [];
    falsePrecisionPatterns.forEach(({ regex, rationale }, index) => {
        let match;
        while ((match = regex.exec(text)) !== null) {
            frames.push({
                reflexId: `vx-fp01-${index}-${match.index}`,
                reflexLabel: "False Precision",
                rationale: `${rationale} Phrase: "${match[0]}"`,
                confidence: 0.77,
                tags: ["false-precision", "numerical"],
                priority: 2,
            });
            regex.lastIndex = match.index + match[0].length;
        }
    });
    return frames;
};
// ✅ Export both default and named for compatibility
export default detectFalsePrecision;
export { detectFalsePrecision };
export const analyzeFalsePrecision = detectFalsePrecision;
