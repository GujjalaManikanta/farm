import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "te" | "hi";

export const languages: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "te", label: "తెలుగు", short: "TE" },
  { code: "hi", label: "हिन्दी", short: "HI" },
];

type Dict = Record<string, string>;

const en: Dict = {
  home: "Home",
  dashboard: "Dashboard",
  cropDoctor: "Crop Doctor",
  weather: "Weather",
  irrigation: "Irrigation",
  soil: "Soil Health",
  alerts: "Alerts",
  history: "Farm History",
  settings: "Settings",
  scan: "Scan",
  profile: "Profile",
  analyzeMyCrop: "Analyze My Crop",
  openDashboard: "Open Dashboard",
  heroTitle: "Smarter Farming with AI",
  heroSub:
    "Detect crop diseases, understand weather conditions, optimize irrigation, and receive intelligent farm advice — all in one place.",
  greeting: "Good Morning 👋",
  greetingSub: "Here's what's happening on your farm today.",
  listen: "Listen to Advice",
};

const te: Dict = {
  home: "హోమ్",
  dashboard: "డాష్‌బోర్డ్",
  cropDoctor: "పంట డాక్టర్",
  weather: "వాతావరణం",
  irrigation: "నీటిపారుదల",
  soil: "నేల ఆరోగ్యం",
  alerts: "హెచ్చరికలు",
  history: "పంట చరిత్ర",
  settings: "సెట్టింగ్‌లు",
  scan: "స్కాన్",
  profile: "ప్రొఫైల్",
  analyzeMyCrop: "నా పంటను పరిశీలించండి",
  openDashboard: "డాష్‌బోర్డ్ తెరవండి",
  heroTitle: "AI తో స్మార్ట్ వ్యవసాయం",
  heroSub:
    "పంట వ్యాధులను గుర్తించండి, వాతావరణాన్ని తెలుసుకోండి, నీటిపారుదలను మెరుగుపరచండి — అన్నీ ఒకే చోట.",
  greeting: "శుభోదయం 👋",
  greetingSub: "ఈ రోజు మీ పొలంలో పరిస్థితి ఇదీ.",
  listen: "సలహా వినండి",
};

const hi: Dict = {
  home: "होम",
  dashboard: "डैशबोर्ड",
  cropDoctor: "फसल डॉक्टर",
  weather: "मौसम",
  irrigation: "सिंचाई",
  soil: "मिट्टी स्वास्थ्य",
  alerts: "चेतावनी",
  history: "खेत इतिहास",
  settings: "सेटिंग्स",
  scan: "स्कैन",
  profile: "प्रोफ़ाइल",
  analyzeMyCrop: "मेरी फसल जांचें",
  openDashboard: "डैशबोर्ड खोलें",
  heroTitle: "AI के साथ स्मार्ट खेती",
  heroSub:
    "फसल रोग पहचानें, मौसम समझें, सिंचाई बेहतर करें और स्मार्ट सलाह पाएं — सब एक जगह।",
  greeting: "सुप्रभात 👋",
  greetingSub: "आज आपके खेत में यह हो रहा है।",
  listen: "सलाह सुनें",
};

const dicts: Record<Lang, Dict> = { en, te, hi };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: "en", setLang: () => {}, t: (k) => en[k] ?? k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => dicts[lang][key] ?? en[key] ?? key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
