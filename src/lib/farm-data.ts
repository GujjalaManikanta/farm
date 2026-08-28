import type { Lang } from "./i18n";

export type Status = "good" | "attention" | "risk";

export const getStatusLabel = (status: Status, lang: Lang = "te"): string => {
  const map: Record<Lang, Record<Status, string>> = {
    te: { good: "ఆరోగ్యంగా ఉంది", attention: "శ్రద్ధ అవసరం", risk: "అధిక ప్రమాదం" },
    en: { good: "Healthy", attention: "Attention Needed", risk: "High Risk" },
    hi: { good: "स्वस्थ", attention: "ध्यान देने योग्य", risk: "उच्च जोखिम" },
    ta: { good: "ஆரோக்கியமானது", attention: "கவனம் தேவை", risk: "அதிக ஆபத்து" },
    kn: { good: "ಆರೋಗ್ಯಕರ", attention: "ಗಮನ ಅಗತ್ಯ", risk: "ಹೆಚ್ಚಿನ ಅಪಾಯ" },
    mr: { good: "निरोगी", attention: "लक्ष देणे गरजेचे", risk: "जास्त धोका" },
    bn: { good: "সুস্থ", attention: "মনোযোগ প্রয়োজন", risk: "উচ্চ ঝুঁকি" },
    gu: { good: "સ્વસ્થ", attention: "ધ્યાન આપવાની જરૂર", risk: "ઉચ્ચ જોખમ" },
    pa: { good: "ਸਿਹਤਮੰਦ", attention: "ਧਿਆਨ ਦੇਣ ਦੀ ਲੋੜ", risk: "ਉੱਚ ਜੋਖਮ" },
  };
  return map[lang]?.[status] ?? map.te[status] ?? map.en[status];
};

export const statusLabel: Record<Status, string> = {
  good: "Healthy",
  attention: "Attention Needed",
  risk: "High Risk",
};

export const farm = {
  farmerName: "రమేష్ (Ramesh)",
  location: "Srikakulam, Andhra Pradesh",
  field: "Field A – 2.5 acres",
  crop: "Tomato",
  growthStage: "Fruiting",
  cropHealth: "attention" as Status,
  diseaseRisk: "High",
  disease: "Early Blight",
  confidence: 93,
  lastAnalyzed: "Just Now",
};

export const weather = {
  temp: 32,
  feelsLike: 35,
  condition: "Cloudy with showers",
  humidity: 81,
  rainProbability: 75,
  rainfall: 12,
  wind: 14,
  sunrise: "5:52 AM",
  sunset: "6:14 PM",
  summary: "Showers likely by late afternoon. Humid through the evening.",
};

export const forecast = [
  { day: "Today", icon: "rain", high: 32, low: 25, rain: 75, humidity: 81 },
  { day: "Sat", icon: "rain", high: 30, low: 24, rain: 85, humidity: 86 },
  { day: "Sun", icon: "cloud", high: 31, low: 25, rain: 45, humidity: 78 },
  { day: "Mon", icon: "sun", high: 34, low: 26, rain: 10, humidity: 62 },
  { day: "Tue", icon: "sun", high: 35, low: 26, rain: 5, humidity: 58 },
  { day: "Wed", icon: "cloud", high: 33, low: 25, rain: 25, humidity: 66 },
  { day: "Thu", icon: "rain", high: 31, low: 24, rain: 60, humidity: 74 },
];

export const soil = {
  estimated: true,
  moisture: { value: 62, label: "Moderate", status: "good" as Status },
  ph: { value: 6.4, label: "Slightly acidic – good for tomato", status: "good" as Status },
  nitrogen: { value: 45, label: "Moderate", status: "attention" as Status },
  phosphorus: { value: 72, label: "Good", status: "good" as Status },
  potassium: { value: 30, label: "Low", status: "risk" as Status },
  organic: { value: 55, label: "Moderate", status: "attention" as Status },
};

export const getLocalizedAdvice = (lang: Lang = "te") => {
  switch (lang) {
    case "te":
      return [
        {
          icon: "cloud-rain",
          title: "వాతావరణ సలహా",
          text: "ఈ రోజు వర్షం పడే అవకాశం ఉంది. మందుల పిచికారీ మరియు ఎరువుల వాడకం వాయిదా వేయండి.",
          tone: "sky" as const,
        },
        {
          icon: "droplets",
          title: "నీటిపారుదల సలహా",
          text: "ఈ రోజు నీరు పెట్టవద్దు. నేల తేమ మరియు వర్షం పంటకు సరిపోతాయి.",
          tone: "sky" as const,
        },
        {
          icon: "bug",
          title: "తెగులు నివారణ సలహా",
          text: "అధిక తేమ వల్ల శిలీంద్ర తెగులు ప్రమాదం ఉంది. టమోటా ఆకులపై మచ్చలను పరిశీలించండి.",
          tone: "warning" as const,
        },
        {
          icon: "sprout",
          title: "నేల పోషకాల సలహా",
          text: "పొటాషియం లోపం ఉంది. వర్షం తగ్గిన తర్వాత ఎకరాకు 25 కిలోల పొటాష్ వేయండి.",
          tone: "success" as const,
        },
        {
          icon: "shield-alert",
          title: "కీటకాల హెచ్చరిక",
          text: "ఈ వారం తెల్లదోమ ప్రభావం ఉండవచ్చు. ఆకుల అడుగు భాగాన్ని తనిఖీ చేయండి.",
          tone: "warning" as const,
        },
        {
          icon: "wheat",
          title: "సాధారణ పంట సలహా",
          text: "కాయ కాసే దశ: పొలంలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలను శుభ్రం చేయండి.",
          tone: "success" as const,
        },
      ];
    case "hi":
      return [
        {
          icon: "cloud-rain",
          title: "मौसम सलाह",
          text: "आज बारिश की संभावना है। कीटनाशक छिड़काव और खाद डालना स्थगित करें।",
          tone: "sky" as const,
        },
        {
          icon: "droplets",
          title: "सिंचाई सलाह",
          text: "आज सिंचाई न करें। मिट्टी की नमी और बारिश फसल के लिए पर्याप्त है।",
          tone: "sky" as const,
        },
        {
          icon: "bug",
          title: "रोग प्रबंधन",
          text: "हवा में अधिक नमी से फफूंद रोग का खतरा है। टमाटर की पत्तियों पर धब्बे देखें।",
          tone: "warning" as const,
        },
        {
          icon: "sprout",
          title: "मिट्टी पोषक सलाह",
          text: "पोटाश की कमी है। बारिश रुकने के बाद प्रति एकड़ 25 किलो पोटाश डालें।",
          tone: "success" as const,
        },
        {
          icon: "shield-alert",
          title: "कीट चेतावनी",
          text: "इस सप्ताह सफेद मक्खी का खतरा है। पत्तियों के नीचे नियमित जांच करें।",
          tone: "warning" as const,
        },
        {
          icon: "wheat",
          title: "फसल देखभाल",
          text: "फल लगने की अवस्था: खेत में पानी जमा न होने दें, जल निकासी साफ रखें।",
          tone: "success" as const,
        },
      ];
    default:
      return [
        {
          icon: "cloud-rain",
          title: "Weather Advice",
          text: "Rain expected today. Postpone spraying and fertilizer application.",
          tone: "sky" as const,
        },
        {
          icon: "droplets",
          title: "Irrigation Advice",
          text: "Do not irrigate today. Soil moisture plus expected rain is enough.",
          tone: "sky" as const,
        },
        {
          icon: "bug",
          title: "Disease Advice",
          text: "High humidity raises fungal risk. Check tomato leaves for dark spots.",
          tone: "warning" as const,
        },
        {
          icon: "sprout",
          title: "Soil Advice",
          text: "Potassium is low. Plan a potash application after the rain stops.",
          tone: "success" as const,
        },
        {
          icon: "shield-alert",
          title: "Pest Risk",
          text: "Moderate whitefly risk this week. Inspect the underside of leaves.",
          tone: "warning" as const,
        },
        {
          icon: "wheat",
          title: "General Crop Advice",
          text: "Fruiting stage: keep drainage clear so water does not stand in rows.",
          tone: "success" as const,
        },
      ];
  }
};

export const advice = getLocalizedAdvice("te");

export interface FarmAlertItem {
  id: number;
  severity: "High" | "Moderate" | "Low";
  severityLabel: string;
  icon: string;
  title: string;
  text: string;
  time: string;
}

export const getLocalizedAlerts = (lang: Lang = "te"): FarmAlertItem[] => {
  switch (lang) {
    case "te":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "తీవ్రం",
          icon: "bug",
          title: "తీవ్ర తెగులు ప్రమాదం",
          text: "మీ ప్రాంతంలో అధిక తేమ మరియు వర్షపాతం కారణంగా టమోటా పంటలో శిలీంద్ర తెగులు వచ్చే ప్రమాదం ఎక్కువగా ఉంది.",
          time: "2 గంటల క్రితం",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "మధ్యస్థం",
          icon: "cloud-rain",
          title: "భారీ వర్షపు హెచ్చరిక",
          text: "ఈ రోజు సాయంత్రం సుమారు 12 మి.మీ వర్షం పడే అవకాశం ఉంది. నీటిపారుదల మరియు మందుల పిచికారీని నివారించండి.",
          time: "4 గంటల క్రితం",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "మధ్యస్థం",
          icon: "bug",
          title: "కీటకాల దాడి హెచ్చరిక",
          text: "పక్క మండలాల్లో తెల్లదోమల ఉనికి నమోదైంది. ఆకుల అడుగు భాగాన్ని నిశితంగా పరిశీలించండి.",
          time: "ఈ రోజు",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "తక్కువ",
          icon: "droplets",
          title: "నీటిపారుదల సలహా",
          text: "వర్షం పడకపోతే సోమవారం నాడు తదుపరి నీరు పెట్టాల్సి ఉంటుంది.",
          time: "ఈ రోజు",
        },
      ];
    case "hi":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "उच्च",
          icon: "bug",
          title: "उच्च रोग जोखिम",
          text: "आपके क्षेत्र में अधिक आर्द्रता और बारिश के कारण टमाटर की फसल में फफूंद रोग का खतरा बढ़ सकता है।",
          time: "2 घंटे पहले",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "मध्यम",
          icon: "cloud-rain",
          title: "भारी बारिश की चेतावनी",
          text: "आज शाम लगभग 12 मिमी बारिश की संभावना है। सिंचाई और कीटनाशक छिड़काव से बचें।",
          time: "4 घंटे पहले",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "मध्यम",
          icon: "bug",
          title: "कीट प्रकोप चेतावनी",
          text: "निकटवर्ती गांवों में सफेद मक्खी की सक्रियता देखी गई है। पत्तियों के नीचे नियमित जांच करें।",
          time: "आज",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "कम",
          icon: "droplets",
          title: "सिंचाई चेतावनी",
          text: "यदि बारिश नहीं होती है तो सोमवार को अगली सिंचाई की आवश्यकता होगी।",
          time: "आज",
        },
      ];
    case "ta":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "அதிகம்",
          icon: "bug",
          title: "அதிக நோய் ஆபத்து",
          text: "உங்கள் பகுதியில் அதிக ஈரப்பதம் காரணமாக தக்காளி பயிரில் பூஞ்சை நோய் பரவும் அபாயம் உள்ளது.",
          time: "2 மணி நேரத்திற்கு முன்",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "மிதமான",
          icon: "cloud-rain",
          title: "கனமழை எச்சரிக்கை",
          text: "இன்று மாலை சுமார் 12 மி.மீ மழை பெய்ய வாய்ப்புள்ளது. பாசனம் மற்றும் மருந்து தெளிப்பை தவிர்க்கவும்.",
          time: "4 மணி நேரத்திற்கு முன்",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "மிதமான",
          icon: "bug",
          title: "பூச்சி தாக்குதல் எச்சரிக்கை",
          text: "அருகிலுள்ள கிராமங்களில் வெள்ளை ஈ தாக்குதல் பதிவாகியுள்ளது. இலைகளின் அடிப்பகுதியை ஆய்வு செய்யவும்.",
          time: "இன்று",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "குறைவு",
          icon: "droplets",
          title: "பாசன எச்சரிக்கை",
          text: "மழை பெய்யாவிட்டால் திங்கட்கிழமை அடுத்த பாசனம் தேவைப்படலாம்.",
          time: "இன்று",
        },
      ];
    case "kn":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "ಹೆಚ್ಚು",
          icon: "bug",
          title: "ಹೆಚ್ಚಿನ ರೋಗ ಅಪಾಯ",
          text: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಚ್ಚಿನ ತೇವಾಂಶದಿಂದಾಗಿ ಟೊಮೆಟೊ ಬೆಳೆಯಲ್ಲಿ ಶಿಲೀಂಧ್ರ ರೋಗದ ಅಪಾಯ ಹೆಚ್ಚಾಗಬಹುದು.",
          time: "2 ಗಂಟೆಗಳ ಹಿಂದೆ",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "ಮಧ್ಯಮ",
          icon: "cloud-rain",
          title: "ಭಾರೀ ಮಳೆ ಎಚ್ಚರಿಕೆ",
          text: "ಇಂದು ಸಂಜೆ ಸುಮಾರು 12 ಮಿ.ಮೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ನೀರಾವರಿ ಮತ್ತು ಸಿಂಪಡಣೆಯನ್ನು ತಪ್ಪಿಸಿ.",
          time: "4 ಗಂಟೆಗಳ ಹಿಂದೆ",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "ಮಧ್ಯಮ",
          icon: "bug",
          title: "ಕೀಟ ಬಾಧೆ ಎಚ್ಚರಿಕೆ",
          text: "ಹತ್ತಿರದ ಹಳ್ಳಿಗಳಲ್ಲಿ ಬಿಳಿ ನೊಣದ ಚಟುವಟಿಕೆ ವರದಿಯಾಗಿದೆ. ಎಲೆಗಳ ಕೆಳಭಾಗವನ್ನು ಪರೀಕ್ಷಿಸಿ.",
          time: "ಇಂದು",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "ಕಡಿಮೆ",
          icon: "droplets",
          title: "ನೀರಾವರಿ ಎಚ್ಚರಿಕೆ",
          text: "ಮಳೆಯಾಗದಿದ್ದರೆ ಸೋಮವಾರ ಮುಂದಿನ ನೀರಾವರಿ ಅಗತ್ಯವಿರುತ್ತದೆ.",
          time: "ಇಂದು",
        },
      ];
    case "mr":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "उच्च",
          icon: "bug",
          title: "उच्च रोग धोका",
          text: "आपल्या भागात जास्त आर्द्रतेमुळे टोमॅटो पिकावर बुरशीजन्य रोगाचा धोका वाढू शकतो.",
          time: "२ तासांपूर्वी",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "मध्यम",
          icon: "cloud-rain",
          title: "मुसळधार पाऊस इशारा",
          text: "आज संध्याकाळी सुमारे १२ मिमी पाऊस पडण्याची शक्यता आहे. पाणी देणे आणि फवारणी टाळा.",
          time: "४ तासांपूर्वी",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "मध्यम",
          icon: "bug",
          title: "कीड प्रादुर्भाव इशारा",
          text: "जवळच्या गावांमध्ये पांढऱ्या माशीचा प्रादुर्भाव आढळला आहे. पानांखाली तपासणी करा.",
          time: "आज",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "कमी",
          icon: "droplets",
          title: "सिंचन इशारा",
          text: "पाऊस न पडल्यास सोमवारी पुढील सिंचनाची आवश्यकता असेल.",
          time: "आज",
        },
      ];
    case "bn":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "উচ্চ",
          icon: "bug",
          title: "উচ্চ রোগের ঝুঁকি",
          text: "আপনার এলাকায় অতিরিক্ত আর্দ্রতার কারণে টমেটো ফসলে ছত্রাকজনিত রোগের ঝুঁকি বাড়তে পারে।",
          time: "২ ঘন্টা আগে",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "মাঝারি",
          icon: "cloud-rain",
          title: "ভারী বৃষ্টির সতর্কতা",
          text: "আজ সন্ধ্যায় প্রায় ১২ মিমি বৃষ্টির সম্ভাবনা রয়েছে। সেচ এবং স্প্রে করা এড়িয়ে চলুন।",
          time: "৪ ঘন্টা আগে",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "মাঝারি",
          icon: "bug",
          title: "কীটপতঙ্গ সতর্কতা",
          text: "নিকটবর্তী গ্রামে সাদা মাছির উপদ্রব দেখা গেছে। পাতার নিচের অংশ পরীক্ষা করুন।",
          time: "আজ",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "কম",
          icon: "droplets",
          title: "সেচ সতর্কতা",
          text: "বৃষ্টি না হলে সোমবার পরবর্তী সেচের প্রয়োজন হতে পারে।",
          time: "আজ",
        },
      ];
    case "gu":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "ઉચ્ચ",
          icon: "bug",
          title: "ઉચ્ચ રોગનું જોખમ",
          text: "તમારા વિસ્તારમાં વધુ ભેજને કારણે ટામેટાના પાકમાં ફૂગજન્ય રોગનું જોખમ વધી શકે છે.",
          time: "૨ કલાક પહેલાં",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "મધ્યમ",
          icon: "cloud-rain",
          title: "ભારે વરસાદની ચેતવણી",
          text: "આજે સાંજે આશરે ૧૨ મીમી વરસાદની શક્યતા છે. પિયત અને છંટકાવ ટાળો.",
          time: "૪ કલાક પહેલાં",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "મધ્યમ",
          icon: "bug",
          title: "જીવાત ચેતવણી",
          text: "નજીકના ગામોમાં સફેદ માખીની સક્રિયતા નોંધાઈ છે. પાંદડા નીચે તપાસ કરો.",
          time: "આજે",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "ઓછું",
          icon: "droplets",
          title: "પિયત ચેતવણી",
          text: "જો વરસાદ ન પડે તો સોમવારે આગામી પિયતની જરૂર પડશે.",
          time: "આજે",
        },
      ];
    case "pa":
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "ਉੱਚ",
          icon: "bug",
          title: "ਉੱਚ ਬਿਮਾਰੀ ਖ਼ਤਰਾ",
          text: "ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਵੱਧ ਨਮੀ ਕਾਰਨ ਟਮਾਟਰ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਉੱਲੀ ਰੋਗ ਦਾ ਖ਼ਤਰਾ ਵੱਧ ਸਕਦਾ ਹੈ।",
          time: "੨ ਘੰਟੇ ਪਹਿਲਾਂ",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "ਦਰਮਿਆਨਾ",
          icon: "cloud-rain",
          title: "ਭਾਰੀ ਮੀਂਹ ਦੀ ਚਿਤਾਵਨੀ",
          text: "ਅੱਜ ਸ਼ਾਮ ਲਗਭਗ ੧੨ ਮਿਲੀਮੀਟਰ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਸਿੰਚਾਈ ਅਤੇ ਸਪਰੇਅ ਤੋਂ ਬਚੋ।",
          time: "੪ ਘੰਟੇ ਪਹਿਲਾਂ",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "ਦਰਮਿਆਨਾ",
          icon: "bug",
          title: "ਕੀੜਿਆਂ ਦਾ ਖ਼ਤਰਾ",
          text: "ਨੇੜਲੇ ਪਿੰਡਾਂ ਵਿੱਚ ਚਿੱਟੀ ਮੱਖੀ ਦਾ ਹਮਲਾ ਦੇਖਿਆ ਗਿਆ ਹੈ। ਪੱਤਿਆਂ ਹੇਠ ਜਾਂਚ ਕਰੋ।",
          time: "ਅੱਜ",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "ਘੱਟ",
          icon: "droplets",
          title: "ਸਿੰਚਾਈ ਚਿਤਾਵਨੀ",
          text: "ਜੇਕਰ ਮੀਂਹ ਨਾ ਪਿਆ ਤਾਂ ਸੋਮਵਾਰ ਨੂੰ ਅਗਲੀ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਹੋਵੇਗੀ।",
          time: "ਅੱਜ",
        },
      ];
    default:
      return [
        {
          id: 1,
          severity: "High",
          severityLabel: "High",
          icon: "bug",
          title: "High Disease Risk",
          text: "High humidity and rainfall in your area may increase fungal disease risk in tomato crops.",
          time: "2 hours ago",
        },
        {
          id: 2,
          severity: "Moderate",
          severityLabel: "Moderate",
          icon: "cloud-rain",
          title: "Heavy Rain Alert",
          text: "Around 12 mm of rain expected today evening. Avoid irrigation and spraying.",
          time: "4 hours ago",
        },
        {
          id: 3,
          severity: "Moderate",
          severityLabel: "Moderate",
          icon: "bug",
          title: "Pest Risk Alert",
          text: "Whitefly activity reported in nearby villages. Inspect leaf undersides.",
          time: "Today",
        },
        {
          id: 4,
          severity: "Low",
          severityLabel: "Low",
          icon: "droplets",
          title: "Irrigation Alert",
          text: "Next irrigation likely needed on Monday if no rain occurs.",
          time: "Today",
        },
      ];
  }
};

export const alerts = getLocalizedAlerts("te");

export interface HistoryRecord {
  id: string;
  date: string;
  cropKey?: string;
  diseaseKey?: string;
  crop: string;
  field: string;
  disease: string;
  health: Status;
  symptoms: string;
  recommendation: string;
  outcome: string;
  image?: string;
}

export const defaultFarmHistory: HistoryRecord[] = [
  {
    id: "hist-1",
    date: "28 Aug • 04:30 PM",
    cropKey: "tomato",
    diseaseKey: "early_blight",
    crop: "Tomato",
    field: "Field A - 2.5 acres",
    disease: "Early Blight",
    health: "attention",
    symptoms: "Dark brown concentric rings on leaves",
    recommendation: "Spray 5% neem oil emulsion (5ml/L) or Mancozeb @ 2g/L",
    outcome: "AI Vision Detected & Analyzed",
  },
  {
    id: "hist-2",
    date: "27 Aug • 10:15 AM",
    cropKey: "chilli",
    diseaseKey: "powdery_mildew",
    crop: "Chilli",
    field: "Field B - 1.8 acres",
    disease: "Powdery Mildew",
    health: "risk",
    symptoms: "White powdery mycelium on leaf undersides",
    recommendation: "Spray wettable sulfur 80% WP @ 3g/L or Hexaconazole @ 1ml/L",
    outcome: "AI Vision Detected & Analyzed",
  },
  {
    id: "hist-3",
    date: "25 Aug • 02:45 PM",
    cropKey: "paddy",
    diseaseKey: "blast",
    crop: "Paddy",
    field: "Field C - 3.0 acres",
    disease: "Rice Blast",
    health: "risk",
    symptoms: "Spindle-shaped lesions with grey centers",
    recommendation: "Spray Tricyclazole 75% WP @ 0.6g/L or Pseudomonas @ 10g/L",
    outcome: "AI Vision Detected & Analyzed",
  },
];

export const getStoredHistory = (): HistoryRecord[] => {
  if (typeof window === "undefined") return defaultFarmHistory;
  try {
    const saved = localStorage.getItem("agri_farm_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as HistoryRecord[];
      }
    }
  } catch {
    // Ignore error
  }
  return defaultFarmHistory;
};

export const saveHistoryRecord = (record: HistoryRecord) => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredHistory();
    const updated = [record, ...current];
    localStorage.setItem("agri_farm_history", JSON.stringify(updated));
  } catch {
    // Ignore error
  }
};

export const clearAllHistory = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("agri_farm_history", JSON.stringify([]));
  } catch {
    // Ignore error
  }
};

export const healthTrend = [
  { month: "Apr", health: 88, diseases: 0 },
  { month: "May", health: 82, diseases: 1 },
  { month: "Jun", health: 74, diseases: 2 },
  { month: "Jul", health: 86, diseases: 1 },
  { month: "Aug", health: 68, diseases: 2 },
];

export const irrigationHistory = [
  { week: "W1", mm: 22 },
  { week: "W2", mm: 14 },
  { week: "W3", mm: 26 },
  { week: "W4", mm: 8 },
  { week: "W5", mm: 18 },
];

export const irrigationSchedule = [
  { day: "Fri", action: "Skip", reason: "Rain expected (75%)" },
  { day: "Sat", action: "Skip", reason: "Heavy rain expected" },
  { day: "Sun", action: "Check", reason: "Soil may still be wet" },
  { day: "Mon", action: "Irrigate", reason: "Dry and hot, 25 mm" },
  { day: "Tue", action: "Skip", reason: "Watered on Monday" },
  { day: "Wed", action: "Check", reason: "Light showers possible" },
  { day: "Thu", action: "Irrigate", reason: "Fruiting stage demand" },
];
