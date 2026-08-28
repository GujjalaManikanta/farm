import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Leaf,
  CloudSun,
  Droplets,
  Sprout,
  Bug,
  Camera,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mic,
  TrendingUp,
  Activity,
  ShieldCheck,
  Smartphone,
  Layers,
  MapPin,
  Volume2,
  Zap,
} from "lucide-react";
import heroImg from "@/assets/hero-agri.jpg";
import { Brand, LanguageSelector, ThemeToggle } from "@/components/app-shell";
import { useLang, type Lang } from "@/lib/i18n";
import { FloatingVoiceAssistant } from "@/components/voice-assistant";
import { getLocalizedCropDiagnosis } from "@/lib/crop-classifier";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSmart AI – Smart Crop Disease Detection & Multilingual Voice Advisory" },
      {
        name: "description",
        content:
          "AI crop disease detection, continuous canopy growth tracking, hyperlocal weather alerts, smart irrigation, and 9-language voice assistance built for farmers.",
      },
    ],
  }),
  component: Landing,
});

const getLocalizedFeatures = (lang: Lang) => {
  if (lang === "te") {
    return [
      {
        icon: Mic,
        emoji: "🎙️",
        title: "బహుభాషా వాయిస్ అసిస్టెంట్",
        text: "మీ మాతృభాషలో మాట్లాడండి లేదా సలహాలు వినండి: తెలుగు, हिन्दी, தமிழ், ಕನ್ನಡ, मराठी, বাংলা, ગુજરાતી, ਪੰਜਾਬੀ లేదా English.",
        tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        icon: Leaf,
        emoji: "🌿",
        title: "AI పంట తెగుళ్ల గుర్తింపు",
        text: "వ్యాధి సోకిన ఆకు లేదా పంట ఫోటో తీసి సెకన్లలో సలహాలు మరియు నివారణ మార్గాలు పొందండి.",
        tone: "text-teal-600 bg-teal-500/10 border-teal-500/20",
      },
      {
        icon: TrendingUp,
        emoji: "📈",
        title: "పంట పెరుగుదల & పందిరి ట్రాకర్",
        text: "ఆకు రంగు సూచిక, ఎత్తు పెరుగుదల మరియు పందిరి కవరేజీని నిరంతరం పర్యవేక్షించి 0-100 ఆరోగ్య స్కోర్‌ను పొందండి.",
        tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        icon: CloudSun,
        emoji: "🌦",
        title: "ఖచ్చితమైన వాతావరణ సమాచారం",
        text: "పొలం వద్ద ప్రత్యక్ష వాతావరణం, వర్షపు సూచన మరియు మందుల పిచికారీకి అనుకూలమైన సమయం.",
        tone: "text-sky-600 bg-sky-500/10 border-sky-500/20",
      },
      {
        icon: Droplets,
        emoji: "💧",
        title: "స్మార్ట్ నీటిపారుదల ప్లానర్",
        text: "నీటిని పొదుపు చేయండి. ఎప్పుడు నీరు పెట్టాలో మరియు వర్షం ఉన్నప్పుడు ఎప్పుడు ఆపాలో తెలుసుకోండి.",
        tone: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      },
      {
        icon: Sprout,
        emoji: "🌱",
        title: "నేల పోషకాలు & NPK విశ్లేషణ",
        text: "నత్రజని, భాస్వరం, పొటాషియం మరియు pH మోతాదులను తనిఖీ చేసి సరైన ఎరువుల పరిమాణం వేయండి.",
        tone: "text-amber-700 bg-amber-600/10 border-amber-600/20",
      },
    ];
  }

  return [
    {
      icon: Mic,
      emoji: "🎙️",
      title: "Multilingual Voice Assistant",
      text: "Speak or listen in your native dialect: Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi, or English.",
      tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Leaf,
      emoji: "🌿",
      title: "Instant AI Crop Diagnosis",
      text: "Scan any affected leaf photo to receive instant disease diagnosis and organic/chemical remedies in under 3 seconds.",
      tone: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    },
    {
      icon: TrendingUp,
      emoji: "📈",
      title: "Continuous Growth Tracker",
      text: "Track leaf greenness (SPAD), plant height velocity, canopy ground cover %, and 0-100 Crop Health Scores.",
      tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: CloudSun,
      emoji: "🌦",
      title: "Hyperlocal Weather Advisory",
      text: "Live field forecasts, rain probability, humidity alerts, and ideal spraying window recommendations.",
      tone: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    },
    {
      icon: Droplets,
      emoji: "💧",
      title: "Smart Irrigation Planner",
      text: "Save water and protect root health. Know precisely when to irrigate and when to hold back during rain.",
      tone: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Sprout,
      emoji: "🌱",
      title: "Soil Health & NPK Balance",
      text: "Track Nitrogen, Phosphorus, Potassium and pH levels with custom fertilizer dosage guidance.",
      tone: "text-amber-700 bg-amber-600/10 border-amber-600/20",
    },
  ];
};

const cropPreviews = [
  { key: "tomato", diseaseKey: "early_blight", name: "Tomato (టమోటా)", icon: "🍅" },
  { key: "chilli", diseaseKey: "powdery_mildew", name: "Chilli (మిరప)", icon: "🌶️" },
  { key: "paddy", diseaseKey: "blast", name: "Paddy (వరి)", icon: "🌾" },
  { key: "cotton", diseaseKey: "leaf_curl", name: "Cotton (పత్తి)", icon: "☁️" },
];

function Landing() {
  const { lang, t, currentLangInfo } = useLang();
  const currentFeatures = getLocalizedFeatures(lang);

  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const activeCrop = cropPreviews[selectedCropIndex];
  const activeDiagnosis = getLocalizedCropDiagnosis(
    activeCrop.key,
    activeCrop.diseaseKey,
    "attention",
    95,
    undefined,
    lang,
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Brand />

          <nav className="hidden items-center gap-6 text-xs sm:text-sm font-bold md:flex">
            <Link to="/" className="text-primary transition-colors">
              {t("home")}
            </Link>
            <Link
              to="/dashboard"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("dashboard")}
            </Link>
            <Link
              to="/crop-growth"
              className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
            >
              <TrendingUp className="size-3.5 text-emerald-600" />
              <span>{t("cropGrowth") || "Growth Tracker"}</span>
            </Link>
            <Link
              to="/voice-assistant"
              className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
            >
              <Mic className="size-3.5 text-emerald-600" />
              <span>{t("voiceAssistant")}</span>
            </Link>
            <Link
              to="/crop-doctor"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("cropDoctor")}
            </Link>
            <Link
              to="/history"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("history")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:brightness-105 active:scale-95"
            >
              <span>{t("openDashboard")}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-xs">
                <Sparkles className="size-3.5 text-emerald-600" />
                <span>
                  {currentLangInfo.flag} {currentLangInfo.native} Active • 9 Indian Languages
                  Supported
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
                {t("heroTitle")}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-2xl">
                {t("heroSub")}
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/crop-doctor"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:brightness-110 active:scale-98"
                >
                  <Camera className="size-5" />
                  <span>{t("analyzeMyCrop")}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  to="/crop-growth"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-card px-5 py-3.5 text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 transition-all hover:bg-emerald-500/10 shadow-xs active:scale-98"
                >
                  <TrendingUp className="size-5 text-emerald-600" />
                  <span>{t("cropGrowth") || "Growth Tracker"}</span>
                </Link>

                <Link
                  to="/voice-assistant"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-5 py-3.5 text-sm sm:text-base font-bold text-foreground transition-all hover:bg-muted active:scale-98 shadow-xs"
                >
                  <Mic className="size-5 text-emerald-600 animate-pulse" />
                  <span>{t("askVoice")}</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border/70 pt-6">
                <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center shadow-xs">
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">95%+</p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                    Vision Accuracy
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center shadow-xs">
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">9</p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                    Native Languages
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center shadow-xs">
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">&lt; 3s</p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                    Instant Remedies
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive AI Preview Showcase */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-card p-5 shadow-2xl backdrop-blur-md">
                {/* Header & Tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live AI Scanner Demo
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                    95% Match
                  </span>
                </div>

                {/* Crop Tabs */}
                <div className="mt-3.5 flex gap-1.5 overflow-x-auto pb-1">
                  {cropPreviews.map((c, i) => (
                    <button
                      key={c.key}
                      onClick={() => setSelectedCropIndex(i)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCropIndex === i
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-xs"
                          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Hero Image with Diagnostic Overlay */}
                <div className="relative mt-3.5 overflow-hidden rounded-2xl border border-border/80">
                  <img
                    src={heroImg}
                    alt="Farmer field scan demo"
                    className="aspect-16/10 w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {activeDiagnosis.cropName}
                    </p>
                    <p className="text-sm font-extrabold">{activeDiagnosis.diseaseName}</p>
                  </div>
                </div>

                {/* Diagnostic Details */}
                <div className="mt-4 space-y-2.5">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                      🔍 AI Detected Symptoms
                    </p>
                    <p className="text-xs text-foreground mt-0.5 font-medium">
                      {activeDiagnosis.symptoms[0]}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      🌿 Recommended Organic Spray
                    </p>
                    <p className="text-xs text-foreground mt-0.5 font-medium line-clamp-2">
                      {activeDiagnosis.organicRemedy}
                    </p>
                  </div>
                </div>

                {/* Launch Button */}
                <Link
                  to="/crop-doctor"
                  className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                >
                  <Camera className="size-4" />
                  <span>Scan Your Crop Photo Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="bg-muted/30 py-16 border-y border-border/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
              Complete AI Smart Farming Suite
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Designed specifically for smallholder and commercial farmers with voice-first ease of
              use.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {currentFeatures.map((f) => (
              <div
                key={f.title}
                className="group rounded-3xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl ${f.tone} transition-transform group-hover:scale-110`}
                  >
                    <f.icon className="size-6" />
                  </div>
                  <span className="text-2xl">{f.emoji}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Brand />
          <p>© 2026 AgriSmart AI. Multilingual Voice Agriculture Assistant for Indian Farmers.</p>
          <LanguageSelector />
        </div>
      </footer>

      <FloatingVoiceAssistant />
    </div>
  );
}
