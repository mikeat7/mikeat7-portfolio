// src/lib/voiceUtils.ts
// ElevenLabs voice narration logic (stub-safe for preview)
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "aMSt68OGf4xUZAnLpTU8";
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
export async function speak(text) {
    const enabled = getVoicePreference();
    if (!enabled || !text || !ELEVENLABS_API_KEY) {
        if (!ELEVENLABS_API_KEY) {
            console.warn("🎙️ ElevenLabs API key not configured");
        }
        return;
    }
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.6,
                    similarity_boost: 0.8,
                    style: 0.2,
                    use_speaker_boost: true
                }
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }
        const audioBlob = await response.blob();
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        // Store globally for stop functionality
        window.__clarityNarration__ = audio;
        await audio.play();
        // Cleanup URL after playback
        audio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioURL);
        });
    }
    catch (err) {
        console.error("🎙️ ElevenLabs narration failed:", err);
    }
}
export function stopVoice() {
    const audio = window.__clarityNarration__;
    if (audio && typeof audio.pause === "function") {
        audio.pause();
        audio.currentTime = 0;
    }
}
export function getVoicePreference() {
    const stored = localStorage.getItem("voiceEnabled");
    return stored === "true";
}
export function setVoicePreference(enabled) {
    localStorage.setItem("voiceEnabled", enabled.toString());
}
