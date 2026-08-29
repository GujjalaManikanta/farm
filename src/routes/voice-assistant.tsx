import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Radio,
  HelpCircle,
  Play,
  RotateCcw,
  Globe,
  Send,
  CloudSun,
  Droplets,
  Sprout,
  Bug,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, SectionCard } from "@/components/farm-ui";
import { useLang, languages, type Lang } from "@/lib/i18n";
import { farm, weather, soil } from "@/lib/farm-data";
import { playSpeech, stopAllAudio } from "@/lib/voice-service";
import { generateAgriResponse } from "@/lib/agri-ai-engine";
import { toast } from "sonner";

export const Route = createFileRoute("/voice-assistant")({
  head: () => ({
    meta: [
      { title: "AgriVoice AI Assistant | Multilingual Farm Audio" },
      {
        name: "description",
        content:
          "Speak and listen to farm diagnosis, weather, irrigation, and crop advice in your native Indian language.",
      },
    ],
  }),
  component: VoiceAssistantPage,
});

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

function VoiceAssistantPage() {
  const { lang, setLang, t, currentLangInfo } = useLang();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const recognitionRef = useRef<unknown>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize messages whenever language changes
  useEffect(() => {
    const greetingText =
      lang === "te"
        ? "నమస్కారం! నేను మీ అగ్రి-వాయిస్ సహాయకుడిని. వర్షం, ఎరువులు లేదా పంట వ్యాధుల గురించి మాట్లాడండి లేదా అడగండి."
        : lang === "hi"
          ? "नमस्ते! मैं आपका एग्री-वॉयस सहायक हूँ। मौसम, फसल रोग, सिंचाई या खाद के बारे में मुझसे बोलकर पूछें।"
          : lang === "ta"
            ? "வணக்கம்! நான் உங்கள் அக்ரி-வாய்ஸ் உதவியாளர். விவசாய கேள்விகளை பேசிக் கேளுங்கள்."
            : lang === "kn"
              ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿ-ವಾಯ್ಸ್ ಸಹಾಯಕ. ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾತನಾಡಿ ಕೇಳಿ."
              : lang === "mr"
                ? "नमस्कार! मी तुमचा अ‍ॅग्री-व्हॉइस सहाय्यक आहे. शेतीविषयक प्रश्न विचारा."
                : lang === "bn"
                  ? "নমস্কার! আমি আপনার এগ্রি-ভয়েস সহকারী। কৃষি সংক্রান্ত প্রশ্ন বলুন।"
                  : lang === "gu"
                    ? "નમસ્તે! હું તમારો એગ્રી-વોઇસ સહાયક છું. ખેતી વિશે પ્રશ્ન પૂછો."
                    : lang === "pa"
                      ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀ-ਵਾਇਸ ਸਹਾਇਕ ਹਾਂ। ਖੇਤੀ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ।"
                      : "Hello! I am your AgriVoice Assistant. Speak or tap any question to hear instant farm advice in your language.";

    setMessages([
      {
        id: `init-${lang}`,
        sender: "assistant",
        text: greetingText,
      },
    ]);
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    stopAllAudio();
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string) => {
      playSpeech(text, lang, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [lang],
  );

  const handleQuery = useCallback(
    (queryText: string) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: trimmed },
      ]);
      setInputText("");

      setTimeout(() => {
        const answer = generateAgriResponse(trimmed, lang);

        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), sender: "assistant", text: answer },
        ]);
        speakText(answer);
      }, 400);
    },
    [lang, speakText],
  );

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as { stop: () => void }).stop();
        } catch {
          // Ignore
        }
      }
      setIsListening(false);
      return;
    }

    stopSpeaking();

    if (typeof window === "undefined") return;

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        maxAlternatives: number;
        onstart: () => void;
        onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: (e: { error?: string }) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        maxAlternatives: number;
        onstart: () => void;
        onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: (e: { error?: string }) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      };
    };

    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      toast.error("Speech recognition not supported on this browser. Tap any question chip below!");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = currentLangInfo.voiceCode;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(`🎙️ Listening in ${currentLangInfo.native}... Speak now!`);
      };

      recognition.onresult = (event) => {
        setIsListening(false);
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleQuery(transcript);
        }
      };

      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error !== "no-speech") {
          toast.error("Could not capture audio. Tap a quick question chip below!");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      toast.error("Could not access microphone. Please check browser permissions.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600/15 to-teal-600/15 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3.5" />
              <span>Multi-Dialect Indian Voice Engine</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              AgriVoice AI Assistant
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak naturally in Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi,
              or English.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/25"
              >
                <VolumeX className="size-4" />
                <span>{t("stopAudio")}</span>
              </button>
            )}
          </div>
        </div>

        {/* 9 Language Selector Pills */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Globe className="size-4 text-primary" />
              <span>Choose Your Native Speaking Language ({languages.length} Available)</span>
            </div>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
              Active: {currentLangInfo.flag} {currentLangInfo.native}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {languages.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    stopSpeaking();
                    toast.success(`Voice language changed to ${l.label} (${l.native})`);
                  }}
                  className={`flex items-center justify-between rounded-2xl border p-3 text-xs transition-all ${
                    active
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs scale-102"
                      : "border-border bg-card text-foreground hover:bg-muted font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{l.flag}</span>
                    <div className="text-left truncate">
                      <p className="font-bold leading-tight truncate">{l.native}</p>
                      <p className="text-[10px] text-muted-foreground">{l.label}</p>
                    </div>
                  </div>
                  {active && <span className="size-2 rounded-full bg-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Voice Assistant Console */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Chat Screen */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col h-[480px] rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
              {/* Messages area */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5 bg-muted/10">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-2xl font-bold ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-emerald-500/15 text-emerald-600"
                      }`}
                    >
                      {m.sender === "user" ? (
                        <User className="size-4.5" />
                      ) : (
                        <Bot className="size-4.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground font-semibold rounded-tr-sm"
                          : "border border-border/80 bg-card text-foreground rounded-tl-sm shadow-xs"
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.sender === "assistant" && (
                        <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                          <span>{currentLangInfo.native} Voice</span>
                          <button
                            onClick={() => speakText(m.text)}
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                          >
                            <Volume2 className="size-3.5" />
                            <span>Play Audio</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Sound wave graphic */}
                {(isListening || isSpeaking) && (
                  <div className="flex items-center justify-center gap-2 py-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {isListening ? "🎙️ Listening to microphone..." : "🔊 Speaking out loud..."}
                    </span>
                    <div className="flex items-end gap-1 h-5">
                      {[10, 22, 14, 26, 18, 12, 20].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-emerald-500 rounded-full animate-pulse"
                          style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Bottom input and big mic button */}
              <div className="border-t border-border/80 bg-card p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQuery(inputText);
                  }}
                  className="flex items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-all active:scale-95 ${
                      isListening
                        ? "bg-rose-500 animate-pulse ring-4 ring-rose-500/30"
                        : "bg-gradient-to-tr from-emerald-600 to-green-500 hover:brightness-105"
                    }`}
                  >
                    {isListening ? <MicOff className="size-6" /> : <Mic className="size-6" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Ask in ${currentLangInfo.native} or type here...`}
                    className="flex-1 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-40"
                  >
                    <Send className="size-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Quick Voice Topics Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <SectionCard title="Quick Voice Questions" icon={HelpCircle}>
              <div className="space-y-2.5">
                {[
                  {
                    icon: CloudSun,
                    q:
                      lang === "te"
                        ? "ఈ రోజు వర్షం పడుతుందా?"
                        : lang === "hi"
                          ? "क्या आज बारिश होगी?"
                          : "Will it rain today?",
                  },
                  {
                    icon: Droplets,
                    q:
                      lang === "te"
                        ? "నేడు నీరు పెట్టవచ్చా?"
                        : lang === "hi"
                          ? "क्या आज सिंचाई करें?"
                          : "Should I irrigate today?",
                  },
                  {
                    icon: Bug,
                    q:
                      lang === "te"
                        ? "టమోటా ఆకుల మచ్చలకు ఏమి చేయాలి?"
                        : lang === "hi"
                          ? "टमाटर के झुलसा रोग का इलाज?"
                          : "How to treat Early Blight?",
                  },
                  {
                    icon: Sprout,
                    q:
                      lang === "te"
                        ? "నేలలో ఎరువులు ఎంత వేయాలి?"
                        : lang === "hi"
                          ? "खेत में कौन सी खाद डालें?"
                          : "How much fertilizer to apply?",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuery(item.q)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 text-left text-xs font-bold text-foreground transition-all hover:bg-emerald-500/10 hover:border-emerald-500 active:scale-98"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="size-4" />
                    </div>
                    <span className="flex-1">{item.q}</span>
                    <Play className="size-3 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/60">
                <AiNote>
                  AgriVoice uses your device's native speech synthesis engine with automatic neural
                  fallback. Make sure your speaker volume is turned on.
                </AiNote>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
