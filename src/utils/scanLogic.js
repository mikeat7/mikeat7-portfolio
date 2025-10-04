// src/utils/scanLogic.ts
export async function runClarityScan(input) {
    if (!input.trim()) {
        return {
            status: "invalid",
            confidence: "N/A",
            details: "No input detected.",
        };
    }
    if (input.toLowerCase().includes("never lied") || input.toLowerCase().includes("100% effective")) {
        return {
            status: "manipulative",
            confidence: "High (85%)",
            details: "Detected absolute language likely masking nuance.",
        };
    }
    return {
        status: "uncertain",
        confidence: "Moderate (65%)",
        details: "Input contains claims that should be investigated further.",
    };
}
