// File: src/utils/voiceUtils.ts
/**
 * Plays voice audio using ElevenLabs API.
 * Falls back silently if no API key or text provided.
 */
export const playVoice = async (text) => {
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "default";
    if (!ELEVENLABS_API_KEY || !text) {
        console.warn("Narration skipped: Missing API key or empty text.");
        return;
    }
    // Stop any existing audio first
    stopVoice();
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
            method: "POST",
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text,
                voice_settings: {
                    stability: 0.6,
                    similarity_boost: 0.8,
                    style: 0.2,
                    use_speaker_boost: true
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        // Store instance globally to allow stopping
        window.__clarityNarration__ = audio;
        await audio.play();
        // Cleanup URL after playback
        audio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
        });
    }
    catch (error) {
        console.error("Voice playback failed:", error);
    }
};
export const stopVoice = () => {
    const audio = window.__clarityNarration__;
    if (audio && typeof audio.pause === "function") {
        audio.pause();
        audio.currentTime = 0;
    }
};
