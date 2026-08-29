import type { Lang } from "./i18n";

let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices immediately on startup
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      // Ignore
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const stopAllAudio = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
};

/**
 * Clean text for speech synthesis (remove markdown, asterisks, emojis, hashtags)
 */
export const sanitizeTextForSpeech = (text: string): string => {
  return text
    .replace(/[#*_`~>[\]()]/g, " ")
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * High-performance, zero-latency speech synthesis supporting all 9 Indian languages.
 * Works natively across all mobile browsers (iOS Safari, Android Chrome) and desktops.
 */
export const playSpeech = async (
  rawText: string,
  lang: Lang = "te",
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  },
): Promise<() => void> => {
  stopAllAudio();

  const cleanText = sanitizeTextForSpeech(rawText);
  if (!cleanText) {
    callbacks?.onEnd?.();
    return () => {};
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported on this device/browser.");
    callbacks?.onEnd?.();
    return () => {};
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const langCodes: Record<Lang, string> = {
      en: "en-IN",
      te: "te-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      pa: "pa-IN",
    };

    const targetLocale = langCodes[lang] ?? "te-IN";
    const shortLocale = lang.toLowerCase();

    // Use a clean snippet for responsive voice speech (first 250 characters)
    const textToSpeak = cleanText.length > 280 ? `${cleanText.slice(0, 280)}...` : cleanText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.lang = targetLocale;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Search cached or fresh voices for best regional match
    const availableVoices =
      cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

    const voiceMatch = availableVoices.find(
      (v) =>
        v.lang.toLowerCase().replace("_", "-") === targetLocale.toLowerCase() ||
        v.lang.toLowerCase().startsWith(shortLocale),
    );

    if (voiceMatch) {
      utterance.voice = voiceMatch;
    } else {
      // Fallback to Indian English or first available voice if specific regional voice not installed on device
      const indianFallback = availableVoices.find(
        (v) => v.lang.toLowerCase().includes("in") || v.lang.toLowerCase().includes("hi"),
      );
      if (indianFallback) {
        utterance.voice = indianFallback;
      }
    }

    let hasStarted = false;

    utterance.onstart = () => {
      hasStarted = true;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (err) => {
      console.warn("Speech synthesis notice:", err);
      callbacks?.onEnd?.();
    };

    // Trigger start notification immediately
    callbacks?.onStart?.();

    window.speechSynthesis.speak(utterance);

    // Watchdog timer to ensure callback triggers even if device terminates audio silently
    const maxDuration = Math.max(3000, textToSpeak.length * 90);
    const safetyTimer = setTimeout(() => {
      if (!hasStarted) {
        callbacks?.onEnd?.();
      }
    }, maxDuration);

    return () => {
      clearTimeout(safetyTimer);
      stopAllAudio();
      callbacks?.onEnd?.();
    };
  } catch (err) {
    console.error("Speech synthesis error:", err);
    callbacks?.onError?.(err);
    callbacks?.onEnd?.();
    return () => {};
  }
};
