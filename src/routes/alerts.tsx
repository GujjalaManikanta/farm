import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Bell,
  Bug,
  CloudRain,
  Droplets,
  Flame,
  AlertTriangle,
  Filter,
  X,
  Radio,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ListenButton, SectionCard } from "@/components/farm-ui";
import { getLocalizedAlerts, type FarmAlertItem } from "@/lib/farm-data";
import { useLang, type Lang } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Farm Alerts & Pest Radar | AgriSmart AI" },
      {
        name: "description",
        content:
          "Real-time crop disease alerts, extreme weather warnings, and pest outbreak radar.",
      },
    ],
  }),
  component: AlertsPage,
});

const alertIcons: Record<string, typeof Bug> = {
  bug: Bug,
  "cloud-rain": CloudRain,
  droplets: Droplets,
  flame: Flame,
};

// Multilingual UI Strings for Alerts Page Chrome
const alertUiTranslations: Record<
  Lang,
  {
    badge: string;
    title: string;
    subTitle: string;
    filterAll: string;
    filterHigh: string;
    filterModerate: string;
    filterLow: string;
    receivedPrefix: string;
    dismissTooltip: string;
    dismissSuccess: string;
    emptyTitle: string;
    emptySub: string;
    voiceSummary: string;
  }
> = {
  te: {
    badge: "ప్రత్యక్ష పొలం రాడార్ & హెచ్చరికల ఫీడ్",
    title: "పంట హెచ్చరికలు & వ్యాప్తి నివారణ",
    subTitle:
      "పంట తెగుళ్లు, శిలీంద్ర బీజాల వ్యాప్తి మరియు విపరీతమైన వాతావరణ మార్పులపై ముందస్తు హెచ్చరికలు.",
    filterAll: "అన్ని హెచ్చరికలు",
    filterHigh: "తీవ్ర హెచ్చరికలు",
    filterModerate: "మధ్యస్థ హెచ్చరికలు",
    filterLow: "తక్కువ హెచ్చరికలు",
    receivedPrefix: "అందిన సమయం",
    dismissTooltip: "హెచ్చరికను తొలగించండి",
    dismissSuccess: "హెచ్చరిక తొలగించబడింది.",
    emptyTitle: "ప్రస్తుతం ఎలాంటి హెచ్చరికలు లేవు",
    emptySub: "మీ ప్రాంతంలో వాతావరణం మరియు పంట ఆరోగ్యం అనుకూలంగా ఉన్నాయి.",
    voiceSummary:
      "హెచ్చరికల సారాంశం: అధిక తేమ వల్ల టమోటాలో తెగులు ప్రమాదం ఉంది. ఈ రోజు సాయంత్రం భారీ వర్షం పడే అవకాశం ఉంది. తెల్లదోమ దాడిపై అప్రమత్తంగా ఉండండి.",
  },
  en: {
    badge: "Real-time Field Radar & Warning Feed",
    title: "Farm Alerts & Outbreak Warnings",
    subTitle:
      "Early warning notifications for pests, fungal spore spread, and extreme weather risks.",
    filterAll: "All Alerts",
    filterHigh: "High Severity",
    filterModerate: "Moderate Severity",
    filterLow: "Low Severity",
    receivedPrefix: "Received",
    dismissTooltip: "Dismiss alert",
    dismissSuccess: "Alert dismissed.",
    emptyTitle: "No Active Alerts",
    emptySub: "All field conditions and crop health parameters are currently normal.",
    voiceSummary:
      "Alert summary: High disease risk due to humidity. Heavy rain expected today evening. Whitefly alert in neighboring areas.",
  },
  hi: {
    badge: "लाइव फील्ड रडार और चेतावनी फीड",
    title: "खेत चेतावनियां और कीट अलर्ट",
    subTitle: "फसल रोग, फफूंद प्रसार और मौसम संबंधी जोखिमों की त्वरित सूचनाएं।",
    filterAll: "सभी अलर्ट",
    filterHigh: "उच्च गंभीरता",
    filterModerate: "मध्यम गंभीरता",
    filterLow: "कम गंभीरता",
    receivedPrefix: "प्राप्त",
    dismissTooltip: "अलर्ट हटाएं",
    dismissSuccess: "अलर्ट हटा दिया गया।",
    emptyTitle: "कोई सक्रिय अलर्ट नहीं है",
    emptySub: "वर्तमान में मौसम और फसल की स्थिति सामान्य है।",
    voiceSummary:
      "अलर्ट सारांश: अधिक नमी के कारण रोग का खतरा है। आज शाम भारी बारिश की संभावना है। सफेद मक्खी से सावधान रहें।",
  },
  ta: {
    badge: "நேரலை பண்ணை ரேடார் & எச்சரிக்கை",
    title: "பண்ணை எச்சரிக்கைகள் & நோய் தடுப்பு",
    subTitle: "பயிர் பூச்சிகள் மற்றும் தீவிர வானிலை பற்றிய முன்கூட்டிய எச்சரிக்கைகள்.",
    filterAll: "அனைத்து எச்சரிக்கைகள்",
    filterHigh: "அதிக தீவிரம்",
    filterModerate: "மிதமான தீவிரம்",
    filterLow: "குறைந்த தீவிரம்",
    receivedPrefix: "பெறப்பட்டது",
    dismissTooltip: "எச்சரிக்கையை நீக்கு",
    dismissSuccess: "எச்சரிக்கை நீக்கப்பட்டது.",
    emptyTitle: "எச்சரிக்கைகள் எதுவும் இல்லை",
    emptySub: "தற்போது வானிலை மற்றும் பயிர் நிலைமை சாதாரணமாக உள்ளது.",
    voiceSummary:
      "எச்சரிக்கை சுருக்கம்: ஈரப்பதம் காரணமாக பூஞ்சை நோய் ஆபத்து உள்ளது. இன்று மாலை கனமழை பெய்ய வாய்ப்புள்ளது.",
  },
  kn: {
    badge: "ಲೈವ್ ಫೀಲ್ಡ್ ರೇಡಾರ್ ಮತ್ತು ಎಚ್ಚರಿಕೆ",
    title: "ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು & ರೋಗ ಮುನ್ಸೂಚನೆ",
    subTitle: "ಬೆಳೆ ಕೀಟಗಳು ಮತ್ತು ಹವಾಮಾನ ಅಪಾಯಗಳ ಕುರಿತು ಮುನ್ಸೂಚನೆ ಅಧಿಸೂಚನೆಗಳು.",
    filterAll: "ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆಗಳು",
    filterHigh: "ಹೆಚ್ಚಿನ ತೀವ್ರತೆ",
    filterModerate: "ಮಧ್ಯಮ ತೀವ್ರತೆ",
    filterLow: "ಕಡಿಮೆ ತೀವ್ರತೆ",
    receivedPrefix: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    dismissTooltip: "ಎಚ್ಚರಿಕೆಯನ್ನು ತೆಗೆದುಹಾಕಿ",
    dismissSuccess: "ಎಚ್ಚರಿಕೆಯನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.",
    emptyTitle: "ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ",
    emptySub: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಪರಿಸ್ಥಿತಿಗಳು ಉತ್ತಮವಾಗಿವೆ.",
    voiceSummary:
      "ಎಚ್ಚರಿಕೆ ಸಾರಾಂಶ: ಹೆಚ್ಚಿನ ತೇವಾಂಶದಿಂದ ರೋಗದ ಅಪಾಯವಿದೆ. ಇಂದು ಸಂಜೆ ಭಾರೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.",
  },
  mr: {
    badge: "थेट शेत रडार आणि इशारा",
    title: "शेत इशारे आणि कीड प्रादुर्भाव",
    subTitle: "पीक रोग आणि हवामान बदलांची पूर्वसूचना देणारी प्रणाली.",
    filterAll: "सर्व इशारे",
    filterHigh: "उच्च तीव्रता",
    filterModerate: "मध्यम तीव्रता",
    filterLow: "कमी तीव्रता",
    receivedPrefix: "मिळाले",
    dismissTooltip: "इशारा हटवा",
    dismissSuccess: "इशारा हटवला.",
    emptyTitle: "कोणतेही इशारे नाहीत",
    emptySub: "सध्या शेतातील परिस्थिती सामान्य आहे.",
    voiceSummary:
      "इशारा सारांश: जास्त आर्द्रतेमुळे रोगाचा धोका आहे. आज संध्याकाळी मुसळधार पाऊस पडू शकतो.",
  },
  bn: {
    badge: "লাইভ খামার রাডার ও সতর্কতা",
    title: "খামার সতর্কতা ও রোগ প্রতিরোধ",
    subTitle: "ফসলের ক্ষতিকারক পোকা এবং আবহাওয়ার পূর্বাভাস সংক্রান্ত প্রাথমিক বিজ্ঞপ্তি।",
    filterAll: "সমস্ত সতর্কতা",
    filterHigh: "উচ্চ তীব্রতা",
    filterModerate: "মাঝারি তীব্রতা",
    filterLow: "কম তীব্রতা",
    receivedPrefix: "প্রাপ্ত হয়েছে",
    dismissTooltip: "সতর্কতা মুছুন",
    dismissSuccess: "সতর্কতা মুছে ফেলা হয়েছে।",
    emptyTitle: "কোনো সক্রিয় সতর্কতা নেই",
    emptySub: "বর্তমানে আবহাওয়া ও ফসলের অবস্থা স্বাভাবিক রয়েছে।",
    voiceSummary:
      "সতর্কতা সারাংশ: আর্দ্রতার কারণে রোগের ঝুঁকি রয়েছে। আজ সন্ধ্যায় ভারী বৃষ্টির সম্ভাবনা রয়েছে।",
  },
  gu: {
    badge: "લાઈવ ખેતર રડાર અને ચેતવણી",
    title: "ખેતર ચેતવણીઓ અને જીવાત એલર્ટ",
    subTitle: "પાકના રોગો અને હવામાન જોખમો અંગે અગાઉથી જાણકારી.",
    filterAll: "બધી ચેતવણીઓ",
    filterHigh: "ઉચ્ચ તીવ್ರતા",
    filterModerate: "મધ્યમ તીવ್ರતા",
    filterLow: "ઓછી તીવ್ರતા",
    receivedPrefix: "મળ્યા સમય",
    dismissTooltip: "ચેતવણી દૂર કરો",
    dismissSuccess: "ચેતવણી દૂર કરવામાં આવી.",
    emptyTitle: "કોઈ સક્રિય ચેતવણી નથી",
    emptySub: "હાલમાં હવામાન અને પાકની સ્થિતિ સામાન્ય છે.",
    voiceSummary:
      "ચેતવણી સારાંશ: વધુ ભેજને કારણે રોગનું જોખમ છે. આજે સાંજે ભારે વરસાદની શક્યતા છે.",
  },
  pa: {
    badge: "ਲਾਈਵ ਖੇਤ ਰਡਾਰ ਅਤੇ ਚਿਤਾਵਨੀ",
    title: "ਖੇਤ ਚਿਤਾਵਨੀਆਂ ਅਤੇ ਕੀੜੇ ਹਮਲੇ",
    subTitle: "ਫ਼ਸਲੀ ਬਿਮਾਰੀਆਂ ਅਤੇ ਮੌਸਮੀ ਖ਼ਤਰਿਆਂ ਬਾਰੇ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ।",
    filterAll: "ਸਾਰੀਆਂ ਚਿਤਾਵਨੀਆਂ",
    filterHigh: "ਉੱਚ ਗੰਭੀਰਤਾ",
    filterModerate: "ਦਰਮਿਆਨੀ ਗੰਭੀਰਤਾ",
    filterLow: "ਘੱਟ ਗੰਭੀਰਤਾ",
    receivedPrefix: "ਮਿਲਿਆ",
    dismissTooltip: "ਚਿਤਾਵਨੀ ਹਟਾਓ",
    dismissSuccess: "ਚਿਤਾਵਨੀ ਹਟਾਈ ਗਈ।",
    emptyTitle: "ਕੋਈ ਸਰਗਰਮ ਚਿਤਾਵਨੀ ਨਹੀਂ ਹੈ",
    emptySub: "ਮੌਜੂਦਾ ਸਮੇਂ ਮੌਸਮ ਅਤੇ ਫ਼ਸਲ ਦੀ ਸਥਿਤੀ ਠੀਕ ਹੈ।",
    voiceSummary: "ਚਿਤਾਵਨੀ ਸਾਰ: ਵੱਧ ਨਮੀ ਕਾਰਨ ਬਿਮਾਰੀ ਦਾ ਖ਼ਤਰਾ ਹੈ। ਅੱਜ ਸ਼ਾਮ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
  },
};

function AlertsPage() {
  const { lang } = useLang();
  const ui = alertUiTranslations[lang] ?? alertUiTranslations.te;

  const [filterSeverity, setFilterSeverity] = useState<"All" | "High" | "Moderate" | "Low">("All");
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  // Dynamically retrieve alerts in current active language
  const localizedAlerts = useMemo(() => {
    return getLocalizedAlerts(lang);
  }, [lang]);

  const activeAlerts = localizedAlerts.filter((a) => !dismissedIds.includes(a.id));

  const filteredAlerts = activeAlerts.filter(
    (a) => filterSeverity === "All" || a.severity === filterSeverity,
  );

  const dismissAlert = (id: number) => {
    setDismissedIds((prev) => [...prev, id]);
    toast.success(ui.dismissSuccess);
  };

  const filterButtons = [
    { key: "All", label: ui.filterAll },
    { key: "High", label: ui.filterHigh },
    { key: "Moderate", label: ui.filterModerate },
    { key: "Low", label: ui.filterLow },
  ] as const;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
              <Radio className="size-3.5 animate-pulse" />
              <span>{ui.badge}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {ui.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{ui.subTitle}</p>
          </div>

          <ListenButton text={ui.voiceSummary} />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="size-4 text-muted-foreground shrink-0 mr-1" />
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilterSeverity(btn.key)}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === btn.key
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-2xs"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Alert Cards Feed */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((a) => {
              const Icon = alertIcons[a.icon] ?? AlertTriangle;
              return (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-emerald-500/40"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                        a.severity === "High"
                          ? "bg-rose-500/15 text-rose-600"
                          : a.severity === "Moderate"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-sky-500/15 text-sky-600"
                      }`}
                    >
                      <Icon className="size-5.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-foreground">{a.title}</h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            a.severity === "High"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                              : a.severity === "Moderate"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                : "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                          }`}
                        >
                          {a.severityLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {a.text}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                        {ui.receivedPrefix}: {a.time}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAlert(a.id)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                    title={ui.dismissTooltip}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-3xl border border-border/80 bg-card">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
                <Bell className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">{ui.emptyTitle}</h3>
              <p className="text-xs text-muted-foreground max-w-md mt-1">{ui.emptySub}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
