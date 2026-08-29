import type { Lang } from "./i18n";

let currentAudio: HTMLAudioElement | null = null;

export const stopAllAudio = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    currentAudio = null;
  }
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
 * Plays speech in any of the 9 Indian/global languages:
 * 1. Uses high-fidelity direct Google TTS audio stream for native Telugu, Hindi, Tamil, Kannada, etc.
 * 2. Seamlessly falls back to browser SpeechSynthesis.
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

  callbacks?.onStart?.();

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

  const ttsLangs: Record<Lang, string> = {
    en: "en",
    te: "te",
    hi: "hi",
    ta: "ta",
    kn: "kn",
    mr: "mr",
    bn: "bn",
    gu: "gu",
    pa: "pa",
  };

  const fallbackToBrowserSynthesis = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const voiceCode = langCodes[lang] ?? "te-IN";
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voiceCode;
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(
        (v) =>
          v.lang.toLowerCase().replace("_", "-") === voiceCode.toLowerCase() ||
          v.lang.toLowerCase().startsWith(lang.toLowerCase()),
      );

      if (match) {
        utterance.voice = match;
      }

      utterance.onend = () => {
        callbacks?.onEnd?.();
      };

      utterance.onerror = () => {
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    }
  };

  try {
    const ttsLang = ttsLangs[lang] ?? "te";
    const snippet = cleanText.slice(0, 190);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(snippet)}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onended = () => {
      currentAudio = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = () => {
      currentAudio = null;
      fallbackToBrowserSynthesis();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        currentAudio = null;
        fallbackToBrowserSynthesis();
      });
    }
  } catch {
    fallbackToBrowserSynthesis();
  }

  return () => {
    stopAllAudio();
    callbacks?.onEnd?.();
  };
};
