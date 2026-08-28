import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LineChart,
  Calendar,
  Search,
  Filter,
  Camera,
  Trash2,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, SectionCard, StatusPill } from "@/components/farm-ui";
import {
  clearAllHistory,
  getStoredHistory,
  type HistoryRecord,
  getStatusLabel,
} from "@/lib/farm-data";
import { useLang, type Lang } from "@/lib/i18n";
import { getLocalizedCropDiagnosis } from "@/lib/crop-classifier";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Farm Scan History | AgriSmart AI" },
      {
        name: "description",
        content: "Track past crop scans, disease recovery timelines, and yield health trends.",
      },
    ],
  }),
  component: HistoryPage,
});

// Multilingual UI Strings for History Page
const historyUiTranslations: Record<
  Lang,
  {
    badge: string;
    title: string;
    subTitle: string;
    newScan: string;
    clearRecords: string;
    clearConfirm: string;
    clearedSuccess: string;
    searchPlaceholder: string;
    filterAll: string;
    filterTomato: string;
    filterChilli: string;
    filterPaddy: string;
    filterCotton: string;
    tableSectionTitle: string;
    colDate: string;
    colCrop: string;
    colDisease: string;
    colStatus: string;
    colRemedy: string;
    emptyTitle: string;
    emptySub: string;
    scanNow: string;
    aiNote: string;
  }
> = {
  te: {
    badge: "ప్రత్యక్ష పంట చరిత్ర",
    title: "పంట చరిత్ర & పరిశీలన రికార్డులు",
    subTitle:
      "మీరు Crop Doctor లో సమర్పించిన పంట సమస్యల మరియు AI పరిశీలనల పూర్తి రికార్డుల జాబితా.",
    newScan: "కొత్త సమస్యను స్కాన్ చేయండి",
    clearRecords: "రికార్డులను క్లియర్ చేయండి",
    clearConfirm: "మీరు నిజంగా అన్ని పాత రికార్డులను క్లియర్ చేయాలనుకుంటున్నారా?",
    clearedSuccess: "పంట రికార్డులు విజయవంతంగా తొలగించబడ్డాయి.",
    searchPlaceholder: "పంట లేదా తెగులు పేరుతో శోధించండి...",
    filterAll: "అన్నీ",
    filterTomato: "టమోటా",
    filterChilli: "మిరప",
    filterPaddy: "వరి",
    filterCotton: "పత్తి",
    tableSectionTitle: "పంట పరిశీలన లాగ్ (Diagnostic Records)",
    colDate: "తేదీ & సమయం",
    colCrop: "పంట పేరు",
    colDisease: "గుర్తించిన సమస్య / తెగులు",
    colStatus: "ఆరోగ్య స్థితి",
    colRemedy: "సిఫార్సు చేసిన నివారణ",
    emptyTitle: "ప్రస్తుతం ఎలాంటి పాత రికార్డులు లేవు",
    emptySub:
      "Crop Doctor లో మీ పంట ఆకు ఫోటోను స్కాన్ చేసినప్పుడు, ఆ పరిశీలనలు మరియు నివారణలు ఇక్కడ రికార్డు అవుతాయి.",
    scanNow: "ఇప్పుడే స్కాన్ చేయండి",
    aiNote:
      "పంట చరిత్ర రికార్డులు మీ పరికరంలో భద్రంగా నిల్వ చేయబడతాయి. మీరు భాషను మార్చినప్పుడు మొత్తం సమాచారం ఆ భాషలోకి స్వయంచాలకంగా మారుతుంది.",
  },
  en: {
    badge: "Live Farm History Ledger",
    title: "Crop Scan History & Diagnostics",
    subTitle: "Complete historical record of crop diagnoses, visual AI inspections, and remedies.",
    newScan: "New Leaf Scan",
    clearRecords: "Clear History",
    clearConfirm: "Are you sure you want to clear all past history records?",
    clearedSuccess: "Farm history records cleared successfully.",
    searchPlaceholder: "Search by crop or disease name...",
    filterAll: "All Crops",
    filterTomato: "Tomato",
    filterChilli: "Chilli",
    filterPaddy: "Paddy",
    filterCotton: "Cotton",
    tableSectionTitle: "Field Diagnostic Logs & Records",
    colDate: "Date & Time",
    colCrop: "Crop",
    colDisease: "Diagnosed Condition",
    colStatus: "Health Status",
    colRemedy: "Recommended Remedy",
    emptyTitle: "No Previous Records Found",
    emptySub:
      "When you scan a leaf photo in Crop Doctor, the diagnoses and remedies will appear here.",
    scanNow: "Scan Crop Now",
    aiNote:
      "Farm diagnostic records are stored locally and dynamically translated into your active language.",
  },
  hi: {
    badge: "खेत इतिहास लेजर",
    title: "फसल इतिहास और निदान रिकॉर्ड",
    subTitle: "क्रॉप डॉक्टर में किए गए फसल स्कैन, रोग निदान और उपचार की संपूर्ण सूची।",
    newScan: "नया स्कैन करें",
    clearRecords: "इतिहास हटाएं",
    clearConfirm: "क्या आप वाकई सभी पुराने रिकॉर्ड हटाना चाहते हैं?",
    clearedSuccess: "फसल इतिहास सफलतापूर्वक हटा दिया गया।",
    searchPlaceholder: "फसल या रोग का नाम खोजें...",
    filterAll: "सभी फसलें",
    filterTomato: "टमाटर",
    filterChilli: "मिर्च",
    filterPaddy: "धान",
    filterCotton: "कपास",
    tableSectionTitle: "फसल निरीक्षण रिकॉर्ड (Diagnostic Records)",
    colDate: "दिनांक और समय",
    colCrop: "फसल",
    colDisease: "पहचाना गया रोग",
    colStatus: "स्वास्थ्य स्थिति",
    colRemedy: "अनुशंसित उपचार",
    emptyTitle: "फिलहाल कोई पिछला रिकॉर्ड नहीं है",
    emptySub: "जब आप क्रॉप डॉक्टर में फोटो स्कैन करेंगे, तो विवरण यहां दिखाई देगा।",
    scanNow: "अभी स्कैन करें",
    aiNote: "फसल इतिहास रिकॉर्ड आपके डिवाइस पर सुरक्षित हैं और चयनित भाषा में अपडेट होते हैं।",
  },
  ta: {
    badge: "பண்ணை வரலாறு",
    title: "பயிர் வரலாறு மற்றும் பரிசோதனை பதிவுகள்",
    subTitle: "பயிர் மருத்துவத்தில் சமர்ப்பிக்கப்பட்ட நோய் பரிசோதனைகளின் முழுமையான பட்டியல்.",
    newScan: "புதிய ஸ்கேன்",
    clearRecords: "பதிவுகளை அழிக்கவும்",
    clearConfirm: "அனைத்து பதிவுகளையும் அழிக்க விரும்புகிறீர்களா?",
    clearedSuccess: "பதிவுகள் வெற்றிகரமாக அழிக்கப்பட்டன.",
    searchPlaceholder: "பயிர் அல்லது நோயைத் தேடுங்கள்...",
    filterAll: "அனைத்தும்",
    filterTomato: "தக்காளி",
    filterChilli: "மிளகாய்",
    filterPaddy: "நெல்",
    filterCotton: "பருத்தி",
    tableSectionTitle: "பயிர் ஆய்வு பதிவு (Diagnostic Records)",
    colDate: "தேதி & நேரம்",
    colCrop: "பயிர்",
    colDisease: "கண்டறியப்பட்ட பிரச்சனை",
    colStatus: "ஆரோக்கிய நிலை",
    colRemedy: "பரிந்துரைக்கப்பட்ட தீர்வு",
    emptyTitle: "பதிவுகள் எதுவும் இல்லை",
    emptySub: "பயிர் மருத்துவத்தில் இலை புகைப்படத்தை ஸ்கேன் செய்யும் போது இங்கு தோன்றும்.",
    scanNow: "இப்போது ஸ்கேன் செய்யவும்",
    aiNote: "பண்ணை பதிவுகள் உங்கள் சாதனத்தில் பாதுகாப்பாக சேமிக்கப்படுகின்றன.",
  },
  kn: {
    badge: "ಕೃಷಿ ಇತಿಹಾಸ",
    title: "ಬೆಳೆ ಇತಿಹಾಸ ಮತ್ತು ರೋಗ ದಾಖಲೆಗಳು",
    subTitle: "ಕ್ರಾಪ್ ಡಾಕ್ಟರ್‌ನಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾದ ಬೆಳೆ ಸಮಸ್ಯೆಗಳ ಪಟ್ಟಿ.",
    newScan: "ಹೊಸ ಸ್ಕ್ಯಾನ್",
    clearRecords: "ದಾಖಲೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
    clearConfirm: "ನೀವು ಎಲ್ಲಾ ಹಳೆಯ ದಾಖಲೆಗಳನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
    clearedSuccess: "ದಾಖಲೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ.",
    searchPlaceholder: "ಬೆಳೆ ಅಥವಾ ರೋಗದ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...",
    filterAll: "ಎಲ್ಲಾ",
    filterTomato: "ಟೊಮೆಟೊ",
    filterChilli: "ಮೆಣಸಿನಕಾಯಿ",
    filterPaddy: "ಭತ್ತ",
    filterCotton: "ಹತ್ತಿ",
    tableSectionTitle: "ಬೆಳೆ ತಪಾಸಣೆ ಲಾಗ್ (Diagnostic Records)",
    colDate: "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
    colCrop: "ಬೆಳೆ",
    colDisease: "ಗುರುತಿಸಲಾದ ರೋಗ",
    colStatus: "ಆರೋಗ್ಯ ಸ್ಥಿತಿ",
    colRemedy: "ಶಿಫಾರಸು ಮಾಡಿದ ಪರಿಹಾರ",
    emptyTitle: "ಯಾವುದೇ ಹಿಂದಿನ ದಾಖಲೆಗಳಿಲ್ಲ",
    emptySub: "ನೀವು ಫೋಟೋ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದಾಗ ಇಲ್ಲಿ ವಿವರಗಳು ಗೋಚರಿಸುತ್ತವೆ.",
    scanNow: "ಈಗ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    aiNote: "ದಾಖಲೆಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾಗಿರುತ್ತವೆ.",
  },
  mr: {
    badge: "शेत इतिहास",
    title: "पीक इतिहास आणि निदान नोंदी",
    subTitle: "क्रॉप डॉक्टरमधील पीक तपासणी आणि उपायांची संपूर्ण यादी.",
    newScan: "नवीन स्कॅन",
    clearRecords: "नोंदी हटवा",
    clearConfirm: "आपण सर्व जुन्या नोंदी हटवू इच्छिता?",
    clearedSuccess: "नोंदी यशस्वीरित्या हटवल्या.",
    searchPlaceholder: "पीक किंवा रोगाचे नाव शोधा...",
    filterAll: "सर्व",
    filterTomato: "टोमॅटो",
    filterChilli: "मिरची",
    filterPaddy: "भात",
    filterCotton: "कापूस",
    tableSectionTitle: "पीक तपासणी नोंद (Diagnostic Records)",
    colDate: "तारीख आणि वेळ",
    colCrop: "पीक",
    colDisease: "निदान झालेला रोग",
    colStatus: "आरोग्य स्थिती",
    colRemedy: "शिफारस केलेला उपाय",
    emptyTitle: "कोणत्याही जुन्या नोंदी नाहीत",
    emptySub: "फोटो स्कॅन केल्यावर येथे नोंदी दिसतील.",
    scanNow: "आता स्कॅन करा",
    aiNote: "नोंदी तुमच्या डिव्हाइसवर सुरक्षित आहेत.",
  },
  bn: {
    badge: "খামার ইতিহাস",
    title: "ফসল ইতিহাস এবং রোগ নির্ণয় রেকর্ড",
    subTitle: "ক্রপ ডক্টরে স্ক্যান করা ফসলের রোগ ও প্রতিকারের সম্পূর্ণ তালিকা।",
    newScan: "নতুন স্ক্যান",
    clearRecords: "রেকর্ড মুছুন",
    clearConfirm: "আপনি কি সমস্ত পুরানো রেকর্ড মুছতে চান?",
    clearedSuccess: "রেকর্ড সফলভাবে মুছে ফেলা হয়েছে।",
    searchPlaceholder: "ফসল বা রোগের নাম খুঁজুন...",
    filterAll: "সব",
    filterTomato: "টমেটো",
    filterChilli: "মরিচ",
    filterPaddy: "ধান",
    filterCotton: "তুলা",
    tableSectionTitle: "ফসল পর্যবেক্ষণ লগ (Diagnostic Records)",
    colDate: "তারিখ ও সময়",
    colCrop: "ফসল",
    colDisease: "শনাক্ত রোগ",
    colStatus: "স্বাস্থ্য অবস্থা",
    colRemedy: "প্রস্তাবিত প্রতিকার",
    emptyTitle: "কোনো পূর্ববর্তী রেকর্ড নেই",
    emptySub: "ছবি স্ক্যান করার পর এখানে ফলাফল দেখা যাবে।",
    scanNow: "এখনই স্ক্যান করুন",
    aiNote: "রেকর্ডগুলি আপনার ডিভাইসে নিরাপদে সংরক্ষিত আছে।",
  },
  gu: {
    badge: "ખેતર ઇતિહાસ",
    title: "પાક ઇતિહાસ અને નિદાન રેકોર્ડ્સ",
    subTitle: "ક્રોપ ડૉક્ટરમાં તપાસેલા પાકના રોગો અને ઉપાયોની સૂચિ.",
    newScan: "નવો સ્કેન",
    clearRecords: "રેકોર્ડ સાફ કરો",
    clearConfirm: "શું તમે ખરેખર જૂના રેકોર્ડ્સ સાફ કરવા માંગો છો?",
    clearedSuccess: "રેકોર્ડ સફળતાપૂર્વક સાફ કરવામાં આવ્યા.",
    searchPlaceholder: "પાક અથવા રોગનું નામ શોધો...",
    filterAll: "બધા",
    filterTomato: "ટામેટા",
    filterChilli: "મરચાં",
    filterPaddy: "ડાંગર",
    filterCotton: "કપાસ",
    tableSectionTitle: "પાક નિરીક્ષણ લૉગ (Diagnostic Records)",
    colDate: "તારીખ અને સમય",
    colCrop: "પાક",
    colDisease: "નિદાન થયેલ રોગ",
    colStatus: "આરોગ્ય સ્થિતિ",
    colRemedy: "ભલામણ કરેલ ઉપાય",
    emptyTitle: "કોઈ જૂના રેકોર્ડ નથી",
    emptySub: "જ્યારે તમે ફોટો સ્કેન કરશો ત્યારે વિગતો અહીં દેખાશે.",
    scanNow: "હમણાં સ્કેન કરો",
    aiNote: "રેકોર્ડ્સ તમારા ઉપકરણ પર સુરક્ષಿತ છે.",
  },
  pa: {
    badge: "ਖੇਤ ਇਤਿਹਾਸ",
    title: "ਫ਼ਸਲ ਇਤਿਹਾਸ ਅਤੇ ਜਾਂਚ ਰਿਕਾਰਡ",
    subTitle: "ਕ੍ਰੌਪ ਡਾਕਟਰ ਵਿੱਚ ਕੀਤੇ ਗਏ ਸਕੈਨ ਅਤੇ ਇਲਾਜਾਂ ਦੀ ਸੂਚੀ।",
    newScan: "ਨਵਾਂ ਸਕੈਨ",
    clearRecords: "ਰਿਕਾਰਡ ਸਾਫ਼ ਕਰੋ",
    clearConfirm: "ਕੀ ਤੁਸੀਂ ਸਾਰੇ ਪੁਰਾਣੇ ਰਿਕਾਰਡ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    clearedSuccess: "ਰਿਕਾਰਡ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾਏ ਗਏ।",
    searchPlaceholder: "ਫ਼ਸਲ ਜਾਂ ਬਿਮਾਰੀ ਖੋਜੋ...",
    filterAll: "ਸਾਰੇ",
    filterTomato: "ਟਮਾਟਰ",
    filterChilli: "ਮਿਰਚ",
    filterPaddy: "ਝੋਨਾ",
    filterCotton: "ਕਪਾਹ",
    tableSectionTitle: "ਫ਼ਸਲ ਨਿਰੀਖਣ ਲੌਗ (Diagnostic Records)",
    colDate: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ",
    colCrop: "ਫ਼ਸਲ",
    colDisease: "ਪਛਾਣ ਕੀਤੀ ਬਿਮਾਰੀ",
    colStatus: "ਸਿਹਤ ਸਥਿਤੀ",
    colRemedy: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤਾ ਇਲਾਜ",
    emptyTitle: "ਕੋਈ ਪੁਰਾਣਾ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ",
    emptySub: "ਜਦੋਂ ਤੁਸੀਂ ਫ਼ੋਟੋ ਸਕੈਨ ਕਰੋਗੇ ਤਾਂ ਇੱਥੇ ਜਾਣਕਾਰੀ ਦਿਸੇਗੀ।",
    scanNow: "ਹੁਣੇ ਸਕੈਨ ਕਰੋ",
    aiNote: "ਰਿਕਾਰਡ ਤੁਹਾਡੇ ਯੰਤਰ 'ਤੇ ਸੁਰੱਖਿਅਤ ਹਨ।",
  },
};

/**
 * Resolves localized display text for a history record based on active language
 */
function resolveLocalizedRecord(item: HistoryRecord, lang: Lang) {
  // Infer cropKey and diseaseKey if not explicitly stored
  let cropKey = item.cropKey || "tomato";
  let diseaseKey = item.diseaseKey || "early_blight";

  const lowerCrop = (item.crop || "").toLowerCase();
  const lowerDisease = (item.disease || "").toLowerCase();

  if (lowerCrop.includes("chilli") || lowerCrop.includes("మిరప") || lowerCrop.includes("मिर्च")) {
    cropKey = "chilli";
  } else if (
    lowerCrop.includes("paddy") ||
    lowerCrop.includes("rice") ||
    lowerCrop.includes("వరి") ||
    lowerCrop.includes("धान")
  ) {
    cropKey = "paddy";
  } else if (
    lowerCrop.includes("cotton") ||
    lowerCrop.includes("పత్తి") ||
    lowerCrop.includes("कपास")
  ) {
    cropKey = "cotton";
  } else if (
    lowerCrop.includes("tomato") ||
    lowerCrop.includes("టమోటా") ||
    lowerCrop.includes("टमाटर")
  ) {
    cropKey = "tomato";
  }

  if (
    lowerDisease.includes("powdery") ||
    lowerDisease.includes("బూడిద") ||
    lowerDisease.includes("चूर्णिल")
  ) {
    diseaseKey = "powdery_mildew";
  } else if (
    lowerDisease.includes("blast") ||
    lowerDisease.includes("అగ్గి") ||
    lowerDisease.includes("ब्लास्ट")
  ) {
    diseaseKey = "blast";
  } else if (
    lowerDisease.includes("curl") ||
    lowerDisease.includes("ముడత") ||
    lowerDisease.includes("मरोड़िया")
  ) {
    diseaseKey = "leaf_curl";
  } else if (
    lowerDisease.includes("healthy") ||
    lowerDisease.includes("ఆరోగ్యం") ||
    lowerDisease.includes("स्वस्थ")
  ) {
    diseaseKey = "healthy";
  } else {
    diseaseKey = "early_blight";
  }

  try {
    const localized = getLocalizedCropDiagnosis(
      cropKey,
      diseaseKey,
      item.health,
      94,
      undefined,
      lang,
      item.field,
    );

    return {
      cropName: localized.cropName,
      diseaseName: localized.diseaseName,
      symptoms: localized.symptoms?.[0] || item.symptoms,
      recommendation: localized.organicRemedy.slice(0, 110) + "...",
      health: item.health,
      date: item.date,
      image: item.image,
    };
  } catch {
    return {
      cropName: item.crop,
      diseaseName: item.disease,
      symptoms: item.symptoms,
      recommendation: item.recommendation,
      health: item.health,
      date: item.date,
      image: item.image,
    };
  }
}

function HistoryPage() {
  const { lang } = useLang();
  const ui = historyUiTranslations[lang] ?? historyUiTranslations.te;

  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");

  useEffect(() => {
    setHistoryList(getStoredHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm(ui.clearConfirm)) {
      clearAllHistory();
      setHistoryList([]);
      toast.success(ui.clearedSuccess);
    }
  };

  const cropFilters = [
    { key: "All", label: ui.filterAll },
    { key: "Tomato", label: ui.filterTomato },
    { key: "Chilli", label: ui.filterChilli },
    { key: "Paddy", label: ui.filterPaddy },
    { key: "Cotton", label: ui.filterCotton },
  ];

  const filteredHistory = historyList.filter((h) => {
    const localized = resolveLocalizedRecord(h, lang);
    const matchesCrop =
      selectedCrop === "All" ||
      (h.cropKey && h.cropKey.toLowerCase() === selectedCrop.toLowerCase()) ||
      h.crop.toLowerCase().includes(selectedCrop.toLowerCase()) ||
      localized.cropName.toLowerCase().includes(selectedCrop.toLowerCase());

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      h.disease.toLowerCase().includes(searchLower) ||
      h.crop.toLowerCase().includes(searchLower) ||
      localized.cropName.toLowerCase().includes(searchLower) ||
      localized.diseaseName.toLowerCase().includes(searchLower) ||
      localized.recommendation.toLowerCase().includes(searchLower) ||
      (h.symptoms && h.symptoms.toLowerCase().includes(searchLower));

    return matchesCrop && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <LineChart className="size-3.5" />
              <span>{ui.badge}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {ui.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{ui.subTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/crop-doctor"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-all active:scale-95"
            >
              <Camera className="size-4" />
              <span>{ui.newScan}</span>
            </Link>

            {historyList.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Clear all past records"
              >
                <Trash2 className="size-4" />
                <span>{ui.clearRecords}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full rounded-2xl border border-border bg-muted/40 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="size-4 text-muted-foreground" />
            {cropFilters.map((crop) => (
              <button
                key={crop.key}
                onClick={() => setSelectedCrop(crop.key)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedCrop === crop.key
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {crop.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic History Table / Cards */}
        <SectionCard title={ui.tableSectionTitle} icon={Calendar}>
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-bold">
                    <th className="py-3 px-3">{ui.colDate}</th>
                    <th className="py-3 px-3">{ui.colCrop}</th>
                    <th className="py-3 px-3">{ui.colDisease}</th>
                    <th className="py-3 px-3">{ui.colStatus}</th>
                    <th className="py-3 px-3">{ui.colRemedy}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredHistory.map((rawItem) => {
                    const item = resolveLocalizedRecord(rawItem, lang);
                    return (
                      <tr key={rawItem.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-foreground whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {item.cropName}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-foreground">{item.diseaseName}</p>
                          {item.symptoms && (
                            <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                              {item.symptoms}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <StatusPill
                            status={item.health}
                            label={getStatusLabel(item.health, lang)}
                          />
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground text-xs max-w-sm">
                          {item.recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
                <FileText className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">{ui.emptyTitle}</h3>
              <p className="text-xs text-muted-foreground max-w-md mt-1 mb-5">{ui.emptySub}</p>
              <Link
                to="/crop-doctor"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
              >
                <Camera className="size-4" />
                <span>{ui.scanNow}</span>
              </Link>
            </div>
          )}

          <div className="mt-5">
            <AiNote>{ui.aiNote}</AiNote>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
