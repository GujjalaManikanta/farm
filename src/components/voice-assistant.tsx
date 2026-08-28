import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Globe,
  Bot,
  User,
  Radio,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
import { useLang, languages, type Lang } from "@/lib/i18n";
import { farm, weather, soil } from "@/lib/farm-data";
import { playSpeech, stopAllAudio } from "@/lib/voice-service";
import { generateAgriResponse } from "@/lib/agri-ai-engine";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

// Multilingual Q&A Knowledgebase for Farmers
const getPresetResponses = (lang: Lang) => {
  switch (lang) {
    case "te":
      return [
        {
          q: "ఈ రోజు వర్షం పడుతుందా?",
          a: `ఈ రోజు మధ్యాహ్నం శ్రీకాకుళం ప్రాంతంలో 12 మిమీ వర్షం పడే అవకాశం 75% ఉంది. ఉష్ణోగ్రత ${weather.temp}°C మరియు తేమ ${weather.humidity}% గా ఉంటుంది. దయచేసి మందుల పిచికారీని వాయిదా వేయండి.`,
        },
        {
          q: "నేడు నీరు పెట్టవచ్చా?",
          a: `వద్దు, ఈ రోజు నీరు పెట్టవద్దు. మీ పొలంలో నేల తేమ 62% తో సరిపడా ఉంది మరియు వర్షం రానుంది. నీటిపారుదల ఆపడం ద్వారా వేరు కుళ్లు తెగులు రాకుండా కాపాడవచ్చు.`,
        },
        {
          q: "టమోటా ఆకులపై మచ్చలకు ఏమి చేయాలి?",
          a: `ఇది ఎర్లీ బ్లైట్ (Early Blight) లక్షణం. లీటరు నీటికి 5 మిల్లీల వేప నూనె లేదా 2 గ్రాముల మాంకోజెబ్ (Mancozeb 75% WP) కలిపి పిచికారీ చేయండి. కింద ఉన్న పాడైన ఆకులను తీసివేయండి.`,
        },
        {
          q: "నేలలో ఎరువులు ఎంత వేయాలి?",
          a: `మీ పొలంలో పొటాషియం లోపం ఉంది. ఎకరాకు 25 కిలోల మ్యూరియేట్ ఆఫ్ పొటాష్ (MOP) ను తేమ ఉన్నప్పుడు వేయండి. భాస్వరం మోతాదు సరిపడా ఉంది.`,
        },
        {
          q: "సమీపంలో తెగుళ్ల సమాచారం ఏమిటి?",
          a: `సమీప గ్రామాల పరిధిలో తెల్లదోమ (Whitefly) ప్రభావం గమనించబడింది. మీ టమోటా ఆకుల అడుగు భాగాన్ని పరిశీలించండి.`,
        },
      ];
    case "hi":
      return [
        {
          q: "क्या आज बारिश होगी?",
          a: `हाँ, आज दोपहर बाद 75% बारिश की संभावना है। तापमान ${weather.temp}°C और आर्द्रता ${weather.humidity}% रहेगी। कीटनाशक छिड़काव अभी टालें।`,
        },
        {
          q: "क्या आज खेत में पानी लगाना चाहिए?",
          a: `नहीं, आज सिंचाई न करें। मिट्टी में 62% नमी पर्याप्त है और शाम को बारिश होने वाली है। आज पानी देने से जड़ सड़न हो सकती है।`,
        },
        {
          q: "टमाटर के पत्तों पर काले धब्बों का इलाज क्या है?",
          a: `यह अगेती झुलसा (Early Blight) है। 5 मिली नीम का तेल प्रति लीटर पानी या मैंकोजेब (Mancozeb) 2 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।`,
        },
        {
          q: "खेत में कौन सी खाद डालें?",
          a: `खेत में पोटाश की कमी पाई गई है। प्रति एकड़ 25 किलोग्राम पोटाश (MOP) डालें। यूरिया की सामान्य खुराक दें।`,
        },
        {
          q: "कीटों का कोई खतरा है क्या?",
          a: `आसपास के क्षेत्र में सफेद मक्खी का प्रकोप देखा गया है। पत्तियों के नीचे नियमित जांच करें और पीला स्टिकी ट्रैप लगाएं।`,
        },
      ];
    case "ta":
      return [
        {
          q: "இன்று மழை பெய்யுமா?",
          a: `ஆம், இன்று பிற்பகல் 75% மழை பெய்ய வாய்ப்புள்ளது. வெப்பநிலை ${weather.temp}°C. மருந்து தெளிப்பதை தள்ளிப்போடுங்கள்.`,
        },
        {
          q: "இன்று பயிருக்கு நீர் பாய்ச்சலாமா?",
          a: `வேண்டாம், மண்ணில் 62% ஈரப்பதம் உள்ளது. மேலும் மழை வரவுள்ளதால் இன்று பாசனம் செய்ய வேண்டாம்.`,
        },
        {
          q: "தக்காளி இலை கருகல் நோய்க்கு தீர்வு என்ன?",
          a: `வேப்ப எண்ணெய் 5 மிலி அல்லது மேன்கோசெப் 2 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.`,
        },
      ];
    case "kn":
      return [
        {
          q: "ಇಂದು ಮಳೆ ಬರುತ್ತದೆಯೇ?",
          a: `ಹೌದು, ಇಂದು ಮಧ್ಯಾಹ್ನ ಶೇ. 75 ಮಳೆ ಸಂಭವವಿದೆ. ತಾಪಮಾನ ${weather.temp}°C. ಔಷಧಿ ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ.`,
        },
        {
          q: "ಇಂದು ನೀರು ಹಾಯಿಸಬೇಕೆ?",
          a: `ಬೇಡ, ಮಣ್ಣಿನಲ್ಲಿ ಶೇ. 62 ತೇವಾಂಶವಿದೆ. ಮಳೆ ನಿರೀಕ್ಷೆಯಿರುವುದರಿಂದ ಇಂದು ನೀರಾವರಿ ಬೇಡ.`,
        },
        {
          q: "ಟೊಮೆಟೊ ಎಲೆ ಚುಕ್ಕೆ ರೋಗಕ್ಕೆ ಪರಿಹಾರವೇನು?",
          a: `ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.`,
        },
      ];
    case "mr":
      return [
        {
          q: "आज पाऊस पडेल का?",
          a: `होय, आज दुपारी ७५% पावसाची शक्यता आहे. तापमान ${weather.temp}°C राहील. कीटकनाशक फवारणी थांबवा.`,
        },
        {
          q: "आज शेताला पाणी द्यावे का?",
          a: `नाही, मातीत ६२% ओलावा पुरेसा आहे. पाऊस येणार असल्याने आज पाणी देऊ नका.`,
        },
        {
          q: "टोमॅटोच्या पानांवरील डागांवर काय उपाय आहे?",
          a: `५ मिली कडुनिंब तेल किंवा २ ग्रॅम मँकोझेब प्रति लिटर पाण्यात मिसळून फवारा.`,
        },
      ];
    case "bn":
      return [
        {
          q: "আজ কি বৃষ্টি হবে?",
          a: `হ্যাঁ, আজ বিকেলে ৭৫% বৃষ্টির সম্ভাবনা রয়েছে। তাপমাত্রা ${weather.temp}°C। স্প্রে করা স্থগিত রাখুন।`,
        },
        {
          q: "আজ কি সেচ দেওয়া উচিত?",
          a: `না, মাটিতে ৬২% আর্দ্রতা রয়েছে। আজ সেচ দেওয়ার প্রয়োজন নেই।`,
        },
        {
          q: "টমেটো পাতার দাগের চিকিৎসা কী?",
          a: `প্রতি লিটার জলে ৫ মিলি নিম তেল বা ২ গ্রাম ম্যানকোজেব স্প্রে করুন।`,
        },
      ];
    case "gu":
      return [
        {
          q: "શું આજે વરસાદ પડશે?",
          a: `હા, આજે બપોરે ૭૫% વરસાદની સંભાવના છે. દવાનો છંટકાવ મુલતવી રાખો.`,
        },
        {
          q: "શું આજે પાણી આપવું જોઈએ?",
          a: `ના, જમીનમાં ૬૨% ભેજ છે અને વરસાદ આવવાનો છે, તેથી આજે પિયત ન આપો.`,
        },
      ];
    case "pa":
      return [
        {
          q: "ਕੀ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ?",
          a: `ਹਾਂ, ਅੱਜ ਦੁਪਹਿਰ ਬਾਅਦ 75% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਸਪਰੇਅ ਕਰਨਾ ਮੁਲਤਵੀ ਕਰੋ।`,
        },
        {
          q: "ਕੀ ਅੱਜ ਪਾਣੀ ਲਗਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
          a: `ਨਹੀਂ, ਮਿੱਟੀ ਵਿੱਚ 62% ਨਮੀ ਕਾਫ਼ੀ ਹੈ। ਅੱਜ ਸਿੰਚਾਈ ਨਾ ਕਰੋ।`,
        },
      ];
    default:
      return [
        {
          q: "Will it rain today on my farm?",
          a: `Yes, there is a 75% chance of showers arriving this afternoon in ${farm.location}. Temperature is ${weather.temp}°C with high humidity (${weather.humidity}%). Postpone pesticide spraying.`,
        },
        {
          q: "Should I irrigate my crops today?",
          a: `Do NOT irrigate today. Your soil moisture is in the optimal range at 62%, and 12mm of rainfall is expected. Holding off protects root aeration and saves water.`,
        },
        {
          q: "How do I treat Early Blight on tomato leaves?",
          a: `Early Blight causes concentric dark spots. Spray 5% Neem oil (5ml/L) as an organic remedy, or Mancozeb 75% WP (2g/L) for chemical control. Prune and destroy infected lower leaves.`,
        },
        {
          q: "What is my soil nutrient status?",
          a: `Nitrogen and Phosphorus are good, but Potassium is low (30%). Apply 25 kg of MOP (Muriate of Potash) per acre after the current rain passes.`,
        },
        {
          q: "Are there any pest alerts near my village?",
          a: `Moderate Whitefly risk has been detected in a 15km cluster. Inspect leaf undersides and deploy yellow sticky traps.`,
        },
      ];
  }
};

export function VoiceAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
        ? "నమస్కారం! నేను మీ అగ్రి-వాయిస్ సహాయకుడిని. వాతావరణం, పంట వ్యాధులు, నీటిపారుదల లేదా ఎరువుల గురించి అడగండి."
        : lang === "hi"
          ? "नमस्ते! मैं आपका एग्री-वॉयस सहायक हूँ। मौसम, फसल रोग, सिंचाई या खाद के बारे में मुझसे पूछें।"
          : lang === "ta"
            ? "வணக்கம்! நான் உங்கள் அக்ரி-வாய்ஸ் உதவியாளர். விவசாய சந்தேகங்களை கேளுங்கள்."
            : lang === "kn"
              ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿ-ವಾಯ್ಸ್ ಸಹಾಯಕ. ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ."
              : lang === "mr"
                ? "नमस्कार! मी तुमचा अ‍ॅग्री-व्हॉइस सहाय्यक आहे. शेतीविषयक प्रश्न विचारा."
                : lang === "bn"
                  ? "নমস্কার! আমি আপনার এগ্রি-ভয়েস সহকারী। কৃষি সংক্রান্ত যে কোনো প্রশ্ন জিজ্ঞাসা করুন।"
                  : lang === "gu"
                    ? "નમસ્તે! હું તમારો એગ્રી-વોઇસ સહાયક છું. ખેતી સંબંધિત પ્રશ્નો પૂછો."
                    : lang === "pa"
                      ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀ-ਵਾਇਸ ਸਹਾਇਕ ਹਾਂ। ਖੇਤੀ ਸੰਬੰਧੀ ਸਵਾਲ ਪੁੱਛੋ।"
                      : "Hello! I am your AgriVoice Assistant. Ask me anything about your crops, today's rain forecast, irrigation, or soil health.";

    setMessages([
      {
        id: `init-${lang}`,
        sender: "assistant",
        text: greetingText,
        timestamp: "Just now",
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

  const handleUserQuery = useCallback(
    (queryText: string) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: trimmed,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");

      setTimeout(() => {
        const botAnswer = generateAgriResponse(trimmed, lang);

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: botAnswer,
          timestamp: "Just now",
        };

        setMessages((prev) => [...prev, botMsg]);
        speakText(botAnswer);
      }, 400);
    },
    [lang, speakText],
  );

  // Speech Recognition hook
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
          stop: () => void;
        };
        webkitSpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
          stop: () => void;
        };
      };

      const SpeechRecognitionClass =
        windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLangInfo.voiceCode;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleUserQuery(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          toast.error("Microphone timed out. Tap a question chip below!");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as { stop: () => void }).stop();
        } catch {
          // Ignore error on teardown
        }
      }
    };
  }, [lang, currentLangInfo, handleUserQuery, stopSpeaking]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) (recognitionRef.current as { stop: () => void }).stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

    if (recognitionRef.current) {
      try {
        const rec = recognitionRef.current as {
          lang: string;
          start: () => void;
        };
        rec.lang = currentLangInfo.voiceCode;
        rec.start();
        setIsListening(true);
        toast.info(`Listening in ${currentLangInfo.label}... Speak now!`);
      } catch {
        setIsListening(false);
        toast.error("Could not access microphone. Tap a quick question below.");
      }
    } else {
      toast.error("Speech recognition is not supported in this browser. Please use quick prompts.");
    }
  };

  const presetQuestions = getPresetResponses(lang);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex h-[90vh] max-h-[720px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-card shadow-2xl">
        {/* Assistant Header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Bot className="size-6" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex size-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex size-3.5 rounded-full bg-amber-400" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight sm:text-lg">
                  AgriVoice AI Assistant
                </h2>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {currentLangInfo.native}
                </span>
              </div>
              <p className="text-xs text-emerald-100">Hyperlocal Speech Telemetry & Diagnostics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30"
              >
                <VolumeX className="size-3.5" />
                <span>{t("stopAudio")}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Multi-Language Quick Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-muted/40 px-4 py-2.5 scrollbar-none">
          <span className="shrink-0 text-[11px] font-bold text-muted-foreground uppercase mr-1">
            Language:
          </span>
          {languages.map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  stopSpeaking();
                  toast.success(`Switched voice assistant to ${l.label} (${l.native})`);
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-2xs scale-102"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.native}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 bg-background/50">
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
                {m.sender === "user" ? <User className="size-4.5" /> : <Bot className="size-4.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground font-semibold rounded-tr-sm"
                    : "border border-border/80 bg-card text-foreground rounded-tl-sm"
                }`}
              >
                <p>{m.text}</p>
                {m.sender === "assistant" && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                    <span>AgriSmart AI</span>
                    <button
                      onClick={() => speakText(m.text)}
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                    >
                      <Volume2 className="size-3.5" />
                      <span>{t("listen")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Sound Wave Equalizer animation while listening/speaking */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center gap-1.5 py-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-2">
                {isListening ? "🎙️ Listening to your voice..." : "🔊 Speaking advisory..."}
              </span>
              <div className="flex items-end gap-1 h-5">
                {[12, 20, 16, 24, 14, 22, 10].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="border-t border-border/70 bg-card/80 p-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500" />
            <span>Tap any question to ask in {currentLangInfo.native}:</span>
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {presetQuestions.map((pq, i) => (
              <button
                key={i}
                onClick={() => handleUserQuery(pq.q)}
                className="shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-emerald-500/15 hover:border-emerald-500 active:scale-95"
              >
                {pq.q}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Speech Bar & Manual Input */}
        <div className="border-t border-border/80 bg-card p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputText);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`relative flex size-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-all active:scale-95 ${
                isListening
                  ? "bg-rose-500 animate-pulse ring-4 ring-rose-500/30"
                  : "bg-gradient-to-tr from-emerald-600 to-green-500 hover:brightness-105"
              }`}
              title={isListening ? "Stop Listening" : "Tap to Speak"}
            >
              {isListening ? <MicOff className="size-6" /> : <Mic className="size-6" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask in ${currentLangInfo.native} or type question...`}
              className="flex-1 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-40 transition-all hover:bg-primary/90"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Global Floating Voice Assistant Bubble Button
export function FloatingVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLangInfo } = useLang();

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-2xl ring-4 ring-emerald-500/20 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-emerald-500/30"
          aria-label="Open Voice Assistant"
        >
          <div className="relative">
            <Mic className="size-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black uppercase tracking-wider leading-none">AgriVoice</p>
            <p className="text-[10px] text-emerald-100 leading-tight mt-0.5">
              {currentLangInfo.flag} {currentLangInfo.native}
            </p>
          </div>
        </button>
      </div>

      <VoiceAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
