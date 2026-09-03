const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Voix multilingue par défaut (Rachel, compatible français via le modèle "multilingual").
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export function isTtsConfigured() {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

/**
 * Génère la narration audio (mp3) d'un texte via l'API ElevenLabs.
 * Renvoie `null` si la clé API n'est pas configurée ou en cas d'échec,
 * pour que la génération d'histoire ne soit jamais bloquée par l'audio.
 */
export async function generateNarration(text: string): Promise<Buffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  try {
    const res = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!res.ok) {
      console.error("Erreur ElevenLabs :", res.status, await res.text().catch(() => ""));
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("Erreur lors de la génération de la narration audio :", err);
    return null;
  }
}
