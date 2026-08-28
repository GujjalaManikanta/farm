import { farm, weather, soil } from "@/lib/farm-data";
import type { Lang } from "@/lib/i18n";

/**
 * Domain Boundary Keywords & Patterns (English, Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi)
 */
const AGRI_PATTERNS = [
  // Crops & Plants
  /\b(crop|plant|leaf|leaves|root|stem|flower|fruit|seed|seedling|nursery|sowing|harvest|yield|canopy|spad|growth|paddy|rice|wheat|cotton|tomato|chilli|maize|corn|sugarcane|groundnut|peanut|potato|onion|brinjal|eggplant|soybean|pulses|gram|turmeric|ginger|mustard|mango|banana|citrus|vegetable|orchard)\b/i,
  // Diseases, Symptoms, Pests
  /\b(disease|pest|insect|bug|worm|caterpillar|borer|armyworm|bollworm|whitefly|aphid|thrips|mite|blight|mildew|rust|blast|curl|spot|yellow|rot|wilt|fungus|fungal|virus|bacterial|infection|deficiency|necro|chlorosis|damage|symptom|cure|treat|remedy|medicine|spray|chemical|organic|pesticide|fungicide|insecticide|neem|mancozeb|imidacloprid|fipronil|chlorpyrifos|copper|carbendazim|traps|pheromone)\b/i,
  // Soil, Fertilizer, Water, Climate
  /\b(soil|land|field|acre|hectare|fertilizer|manure|compost|npk|nitrogen|urea|dap|potash|mop|zinc|boron|calcium|magnesium|ph|nutrient|vermicompost|dung|jeevamrut|panchagavya|water|irrigate|irrigation|moisture|drip|sprinkler|drainage|rain|weather|temperature|forecast|humidity|monsoon|climate|spray window|mandi|market|price|msp|subsidy|scheme|pm kisan|kisan|farmer|farming|agriculture)\b/i,
  // Telugu (తెలుగు)
  /(పంట|ఆకు|వేరు|కాండం|పువ్వు|కాయ|విత్తనం|విత్తనాలు|నాటు|కోత|దిగుబడి|టమోటా|మిరప|వరి|పత్తి|మొక్కజొన్న|చెరకు|వేరుశనగ|బంగాళాదుంప|ఉల్లిపాయ|వంకాయ|సోయాబీన్|పప్పుధాన్యాలు|పసుపు|అల్లం|మామిడి|అరటి|కూరగాయలు|తెగులు|వ్యాధి|పురుగు|పురుగులు|తెల్లదోమ|తామర|పేనుబంక|లద్దెపురుగు|కాయతొలిచే|ఎర్లీ బ్లైట్|లేట్ బ్లైట్|ఆకుముడత|మచ్చలు|పసుపుపచ్చ|కుళ్లు|వాడిపోవడం|శిలీంద్రం|నివారణ|మందు|పిచికారీ|వేప నూనె|మాంకోజెబ్|ఎరువులు|యూరియా|పొటాష్|భాస్వరం|నత్రజని|నేల|భూమి|నీరు|నీటిపారుదల|తేమ|డ్రిప్|వర్షం|వాతావరణం|ఉష్ణోగ్రత|మార్కెట్|ధర|రైతు|వ్యవసాయం|సాగు)/,
  // Hindi (हिन्दी)
  /(फसल|पौधा|पत्ती|जड़|तना|फूल|फल|बीज|बुवाई|कटाई|पैदावार|टमाटर|मिर्च|धान|चावल|कपास|गेहूं|मक्का|गन्ना|मूंगफली|आलू|प्याज|बैंगन|सोयाबीन|दालें|हल्दी|अदरक|सब्जी|रोग|कीट|कीड़े|सफेद मक्खी|थ्रिप्स|माहू|इल्ली|सुंडी|झुलसा|मरोड़िया|धब्बे|पीलापन|सड़न|फफूंद|उपचार|दवा|छिड़काव|नीम तेल|मैंकोजेब|खाद|उर्वरक|यूरिया|पोटाश|फास्फोरस|नाइट्रोजन|मिट्टी|खेत|पानी|सिंचाई|नमी|ड्रिप|बारिश|मौसम|तापमान|मंडी|भाव|किसान|खेती|कृषि)/,
  // Tamil (தமிழ்)
  /(பயிர்|இலை|வேர்|விதை|அறுவடை|மகசூல்|தக்காளி|மிளகாய்|நெல்|பருத்தி|கோதுமை|மக்காச்சோளம்|கரும்பு|நிலக்கடலை|உருளைக்கிழங்கு|வெங்காயம்|கத்தரிக்காய்|மஞ்சள்|நோய்|பூச்சி|வெள்ளை ஈ|அசுவிணி|கருகல்|புள்ளி|மருந்து|தெளிப்பு|வேப்ப எண்ணெய்|உரம்|யூரியா|பொட்டாஷ்|மண்|பாசனம்|ஈரப்பதம்|மழை|வானிலை|விவசாயம்)/,
  // Kannada (ಕನ್ನಡ)
  /(ಬೆಳೆ|ಎಲೆ|ಬೇರು|ಬೀಜ|ಕೊಯ್ಲು|ಇಳುವರಿ|ಟೊಮೆಟೊ|ಮೆಣಸಿನಕಾಯಿ|ಭತ್ತ|ಹತ್ತಿ|ಗೋಧಿ|ಮೆಕ್ಕೆಜೋಳ|ಕಬ್ಬು|ಕಡಲೆಕಾಯಿ|ಆಲೂಗಡ್ಡೆ|ಈರುಳ್ಳಿ|ಬದನೆಕಾಯಿ|ರೋಗ|ಕೀಟ|ಹುಳು|ಬಿಳಿ ನೊಣ|ಚುಕ್ಕೆ|ಮದ್ದು|ಸಿಂಪಡಣೆ|ಬೇವಿನ ಎಣ್ಣೆ|ಗೊಬ್ಬರ|ಯೂರಿಯಾ|ಪೊಟ್ಯಾಶ್|ಮಣ್ಣು|ನೀರಾವರಿ|ತೇವಾಂಶ|ಮಳೆ|ಹವಾಮಾನ|ರೈತ|ಕೃಷಿ)/,
  // Marathi (मराठी)
  /(पीक|पान|मूळ|बियाणे|कापणी|उत्पादन|टोमॅटो|मिरची|भात|कापूस|गहू|मका|ऊस|भुईमूग|बटाटा|कांदा|वांगी|रोग|कीड|अळी|पांढरी माशी|करपा|डाग|औषध|फवारणी|कडुलिंब तेल|खत|युरिया|पोटॅश|माती|शेत|सिंचन|ओलावा|पाऊस|हवामान|शेतकरी|शेती)/,
  // Bengali (বাংলা)
  /(ফসল|পাতা|মূল|বীজ|কাটা|ফলন|টমেটো|লঙ্কা|ধান|তুলা|গম|ভুট্টা|আখ|চিনাবাদাম|আলু|পেঁয়াজ|বেগুন|রোগ|পোকা|সাদা মাছি|ব্লাইট|দাগ|ওষুধ|স্প্রে|নিম তেল|সার|ইউরিয়া|পটাশ|মাটি|সেচ|আর্দ্রতা|বৃষ্টি|আবহাওয়া|কৃষক|কৃষি)/,
  // Gujarati (ગુજરાતી)
  /(પાક|પાન|મૂળ|બીજ|લણણી|ઉત્પાદન|ટામેટાં|મરચાં|ડાંગર|કપાસ|ઘઉં|મકાઈ|શેરડી|મગફળી|બટાટા|ડુંગળી|રીંગણ|રોગ|જીવાત|ઈયળ|સફેદ માખી|સુકારો|ડાઘ|દવા|છંટકાવ|લીમડાનું તેલ|ખાતર|યુરિયા|પોટાશ|જમીન|પિયત|ભેજ|વરસાદ|હવામાન|ખેડૂત|ખેતી)/,
  // Punjabi (ਪੰਜਾਬੀ)
  /(ਫ਼ਸਲ|ਪੱਤਾ|ਜੜ੍ਹ|ਬੀਜ|ਵਾਢੀ|ਝਾੜ|ਟਮਾਟਰ|ਮਿਰਚ|ਝੋਨਾ|ਨਰਮਾ|ਕਣਕ|ਮੱਕੀ|ਕਮਾਦ|ਮੂੰਗਫਲੀ|ਆਲੂ|ਪਿਆਜ਼|ਬੈਂਗਣ|ਬਿਮਾਰੀ|ਕੀੜੇ|ਸੁੰਡੀ|ਚਿੱਟੀ ਮੱਖੀ|ਝੁਲਸ|ਦਾਗ਼|ਦਵਾਈ|ਸਪਰੇਅ|ਨਿੰਮ ਦਾ ਤੇਲ|ਖਾਦ|ਯੂਰੀਆ|ਪੋਟਾਸ਼|ਮਿੱਟੀ|ਸਿੰਚਾਈ|ਨਮੀ|ਮੀਂਹ|ਮੌਸਮ|ਕਿਸਾਨ|ਖੇਤੀ)/,
];

/**
 * Greetings & Polite conversational triggers
 */
const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|namaste|vanakkam|namaskaram|kem cho|sat sri akaal|good morning|good evening|who are you|what can you do|help me|how to use)/i,
  /(నమస్కారం|హలో|బాగున్నారా|ఎవరు మీరు|సహాయం)/,
  /(नमस्ते|प्रणाम|आप कौन हैं|मदद)/,
  /(வணக்கம்|யார் நீங்கள்|உதவி)/,
  /(ನಮಸ್ಕಾರ|ಯಾರು ನೀವು|ಸಹಾಯ)/,
  /(नमस्कार|तुम्ही कोण आहात|मदत)/,
  /(নমস্কার|আপনি কে|সাহায্য)/,
  /(નમસ્તે|તમે કોણ છો|મદદ)/,
  /(ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕੌਣ ਹੋ|ਮਦਦ)/,
];

/**
 * Check if the user query is within the agriculture domain
 */
export function isAgriQuery(query: string): boolean {
  const q = query.trim();
  if (!q) return false;

  // 1. Is it a greeting?
  if (GREETING_PATTERNS.some((pattern) => pattern.test(q))) {
    return true;
  }

  // 2. Is it matching agricultural patterns?
  if (AGRI_PATTERNS.some((pattern) => pattern.test(q))) {
    return true;
  }

  return false;
}

/**
 * Non-agriculture rejection message in all 9 languages
 */
export function getDomainRejectionMessage(lang: Lang): string {
  switch (lang) {
    case "te":
      return "క్షమించండి! నేను ప్రత్యేకంగా వ్యవసాయం మరియు పంటల సంరక్షణ కోసం రూపొందించబడిన AI సహాయకుడిని. దయచేసి పంటలు, తెగుళ్లు, నివారణ మందులు, ఎరువులు, వాతావరణం లేదా నీటిపారుదల వంటి వ్యవసాయ సంబంధిత ప్రశ్నలను మాత్రమే అడగండి.";
    case "hi":
      return "क्षमा करें! मैं केवल कृषि और फसल सलाह के लिए बनाया गया AI सहायक हूँ। कृपया खेती, फसल रोग, कीटनाशक, खाद, मौसम या सिंचाई से जुड़े कृषि सवाल ही पूछें।";
    case "ta":
      return "மன்னிக்கவும்! நான் விவசாயம் மற்றும் பயிர் பாதுகாப்புக்கான AI உதவியாளர். தயவுசெய்து பயிர்கள், பூச்சிகள், உரங்கள், வானிலை அல்லது பாசனம் பற்றிய விவசாயக் கேள்விகளை மட்டும் கேட்கவும்.";
    case "kn":
      return "ಕ್ಷಮಿಸಿ! ನಾನು ಕೇವಲ ಕೃಷಿ ಮತ್ತು ಬೆಳೆ ಸಂರಕ್ಷಣಾ AI ಸಹಾಯಕ. ದಯವಿಟ್ಟು ಬೆಳೆಗಳು, ರೋಗಗಳು, ಗೊಬ್ಬರ, ಹವಾಮಾನ ಅಥವಾ ನೀರಾವರಿ ಕುರಿತಾದ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾತ್ರ ಕೇಳಿ.";
    case "mr":
      return "माफ करा! मी फक्त शेती व पीक संरक्षणासाठी समर्पित AI सहाय्यक आहे. कृपया पीक रोग, कीडनाशके, खते, हवामान किंवा सिंचनाशी संबंधित शेतीचे प्रश्न विचारा.";
    case "bn":
      return "দুঃখিত! আমি শুধুমাত্র কৃষি ও ফসল সুরক্ষার জন্য নিবেদিত AI সহকারী। অনুগ্রহ করে ফসল, রোগবালাই, সার, আবহাওয়া বা সেচ সংক্রান্ত কৃষি বিষয়ক প্রশ্ন জিজ্ঞাসা করুন।";
    case "gu":
      return "માફ કરશો! હું માત્ર ખેતી અને પાક સંરક્ષણ માટેનો AI સહાયક છું. કૃપા કરીને પાક, રોગ, ખાતર, હવામાન અથવા સિંચાઈ સંબંધિત ખેતીના પ્રશ્નો પૂછો.";
    case "pa":
      return "ਮਾਫ਼ ਕਰਨਾ! ਮੈਂ ਸਿਰਫ਼ ਖੇਤੀਬਾੜੀ ਅਤੇ ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਲਈ ਬਣਾਇਆ ਗਿਆ AI ਸਹਾਇਕ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਖੇਤੀ, ਫ਼ਸਲੀ ਬਿਮਾਰੀਆਂ, ਖਾਦ, ਮੌਸਮ ਜਾਂ ਸਿੰਚਾਈ ਬਾਰੇ ਹੀ ਸਵਾਲ ਪੁੱਛੋ।";
    default:
      return "I specialize exclusively in agriculture and crop management. Please ask farming-related questions such as crop diseases, pest control remedies, fertilizer dosage, weather advisories, irrigation planning, or soil health.";
  }
}

/**
 * ChatGPT-grade Intelligent Agricultural Reasoning & Doubt Clarification Engine
 */
export function generateAgriResponse(query: string, lang: Lang): string {
  const q = query.trim();
  const qLower = q.toLowerCase();

  // 1. Guardrail: If non-agri, return strict domain boundary response
  if (!isAgriQuery(q)) {
    return getDomainRejectionMessage(lang);
  }

  // 2. Greetings & Persona Introduction
  if (GREETING_PATTERNS.some((pattern) => pattern.test(q))) {
    switch (lang) {
      case "te":
        return `నమస్కారం రైతు సోదరా! నేను మీ అగ్రిస్మార్ట్ AI వ్యవసాయ నిపుణుడిని. మీ పొలంలో ${farm.crop} పంట ఆరోగ్యం, ఈ రోజు వర్ష సూచన (${weather.rainProbability}%), నేల తేమ (${soil.moisture.value}%), తెగుళ్ల నివారణ మందులు (డోసేజ్), ఎరువుల మోతాదు లేదా పంట సాగు పద్ధతుల గురించి ఏదైనా సందేహం ఉంటే అడగండి!`;
      case "hi":
        return `नमस्ते किसान भाई! मैं आपका एग्रीस्मार्ट AI कृषि विशेषज्ञ हूँ। आपकी ${farm.crop} फसल की स्थिति, आज की बारिश (${weather.rainProbability}%), मिट्टी की नमी (${soil.moisture.value}%), रोग-कीट रोकथाम, कीटनाशक की सही मात्रा या खाद के बारे में कोई भी सवाल पूछें!`;
      case "ta":
        return `வணக்கம் விவசாய தோழரே! நான் உங்கள் அக்ரிஸ்மார்ட் AI வேளாண்மை ஆலோசகர். உங்கள் பண்ணை பயிர் ${farm.crop}, வானிலை, உரம் மற்றும் பூச்சி மேலாண்மை பற்றி உங்கள் சந்தேகங்களை கேளுங்கள்!`;
      case "kn":
        return `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಸ್ಮಾರ್ಟ್ AI ಕೃಷಿ ತಜ್ಞ. ಬೆಳೆ ರೋಗಗಳು, ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಹವಾಮಾನದ ಬಗ್ಗೆ ನಿಮ್ಮ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!`;
      case "mr":
        return `नमस्कार शेतकरी बंधूंनो! मी तुमचा अ‍ॅग्रीस्मार्ट AI कृषी तज्ज्ञ आहे. पीक रोग, फवारणीचे प्रमाण, खत व्यवस्थापन आणि हवामानाबद्दल आपल्या शंका विचारा!`;
      case "bn":
        return `নমস্কার কৃষক ভাই! আমি আপনার এগ্রিস্মার্ট AI কৃষি বিশেষজ্ঞ। ফসলের রোগ, কীটনাশকের মাত্রা, সার ও আবহাওয়া সম্পর্কে আপনার প্রশ্ন জিজ্ঞাসা করুন!`;
      case "gu":
        return `નમસ્તે ખેડૂત મિત્ર! હું તમારો એગ્રીસ્માર્ટ AI કૃષિ નિષ્ણાત છું. પાકના રોગ, દવાની માત્રા, ખાતર અને હવામાન વિશે તમારા પ્રશ્નો પૂછો!`;
      case "pa":
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਸਮਾਰਟ AI ਖੇਤੀ ਮਾਹਿਰ ਹਾਂ। ਫ਼ਸਲੀ ਬਿਮਾਰੀਆਂ, ਸਪਰੇਅ ਦੀ ਮਾਤਰਾ, ਖਾਦ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਆਪਣੇ ਸਵਾਲ ਪੁੱਛੋ!`;
      default:
        return `Hello Farmer! I am your AgriSmart AI Agronomist. I provide comprehensive farming solutions for your ${farm.crop} crop, including pest & disease treatments (exact dosages), soil NPK balancing, live weather alerts (${weather.temp}°C, ${weather.rainProbability}% rain), and irrigation advice. What doubt can I solve for you today?`;
    }
  }

  // 3. Fungal Diseases: Early Blight, Late Blight, Powdery Mildew, Rust, Blast, Leaf Spots, Wilting
  if (
    /blight|mildew|rust|blast|wilt|fungus|fungal|spot|yellow|rot|curl|damping|anthracnose/i.test(
      qLower,
    ) ||
    q.includes("తెగులు") ||
    q.includes("బ్లైట్") ||
    q.includes("మచ్చలు") ||
    q.includes("ఆకుముడత") ||
    q.includes("కుళ్లు") ||
    q.includes("వాడిపోవడం") ||
    q.includes("మచ్చ") ||
    q.includes("झुलसा") ||
    q.includes("फफूंद") ||
    q.includes("धब्बे") ||
    q.includes("मरोड़िया") ||
    q.includes("सड़न") ||
    q.includes("கருகல்") ||
    q.includes("புள்ளி") ||
    q.includes("ಚುಕ್ಕೆ") ||
    q.includes("ಕರಪಾ") ||
    q.includes("দাগ") ||
    q.includes("સુકારો") ||
    q.includes("ਝੁਲਸ")
  ) {
    switch (lang) {
      case "te":
        return `🔍 **సమస్య విశ్లేషణ**: ఆకులపై గోధుమ/నల్లటి మచ్చలు లేదా ఆకుముడత అనేది శిలీంద్ర తెగులు (Early/Late Blight లేదా Powdery Mildew).
🛠️ **తక్షణ నివారణ చర్యలు**:
1. **సేంద్రీయ పద్ధతి**: లీటరు నీటికి 5 మి.లీ వేప నూనె (10,000 PPM) లేదా ట్రైకోడెర్మా విరిడే (5 గ్రా/లీ) పిచికారీ చేయండి.
2. **రసాయన మందుల పిచికారీ**: లీటరు నీటికి 2 గ్రాముల మాంకోజెబ్ (Mancozeb 75% WP) లేదా 1.5 మి.లీ హెక్సాకొనాజోల్ కలిపి ఆకుల అడుగుభాగం తడిసేలా పిచికారీ చేయండి.
3. **పొలం యాజమాన్యం**: వ్యాధి సోకిన కింది ఆకులను తుంచి కాల్చివేయండి. నేడు వర్షం (${weather.rainProbability}%) ఉన్నందున వర్షం తగ్గాక మందులు కొట్టండి.`;
      case "hi":
        return `🔍 **रोग की पहचान**: पत्तियों पर गोल/भूरे धब्बे व पीलापन कवक जनित रोग (अगेती/पछेती झुलसा) का लक्षण है।
🛠️ **समाधान व उपचार**:
1. **जैविक उपचार**: 5 मिली नीम का तेल (10,000 PPM) प्रति लीटर पानी या ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) का छिड़काव करें।
2. **रासायनिक स्प्रे**: मैंकोजेब 75% WP (2 ग्राम/लीटर) या हेक्साकोनाज़ोल (1.5 मिली/लीटर) पानी में मिलाकर पत्तियों के नीचे अच्छी तरह छिड़कें।
3. **कृषि सलाह**: संक्रमित निचली पत्तियों को काटकर नष्ट करें। आज वर्षा संभावना (${weather.rainProbability}%) होने के कारण छिड़काव बारिश के बाद ही करें।`;
      case "ta":
        return `🔍 **நோய் அறிகுறி**: இலைகளில் கருகல் மற்றும் மஞ்சள் நிற புள்ளிகள் பூஞ்சை நோயாகும்.
🛠️ **தீர்வு**:
1. வேப்ப எண்ணெய் 5 மிலி/லிட்டர் அல்லது மேன்கோசெப் 75% WP 2 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.
2. பாதிக்கப்பட்ட இலைகளை அகற்றி அழிக்கவும். இன்று மழை வாய்ப்பு (${weather.rainProbability}%) உள்ளதால் மழை நின்றபின் தெளிக்கவும்.`;
      case "kn":
        return `🔍 **ರೋಗ ವಿಶ್ಲೇಷಣೆ**: ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಚುಕ್ಕೆಗಳು ಶಿಲೀಂಧ್ರ ರೋಗದ ಲಕ್ಷಣ.
🛠️ **ಪರಿಹಾರ**:
1. ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.
2. ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಪಡಿಸಿ. ಮಳೆ ಮುಗಿದ ನಂತರವೇ ಔಷಧಿ ಸಿಂಪಡಿಸಿ.`;
      case "mr":
        return `🔍 **रोग निदान**: पानांवर काळे/तपकिरी डाग पडणे हा बुरशीजन्य करपा रोग आहे.
🛠️ **उपाययोजना**:
1. ५ मिली कडुनिंब तेल किंवा २ ग्रॅम मँकोझेब प्रति लिटर पाण्यात मिसळून फवारा.
2. बाधित पाने काढून टाका. पाऊस संपल्यानंतरच फवारणी करा.`;
      case "bn":
        return `🔍 **রোগ নির্ণয়**: পাতায় বাদামী বা কালো দাগ ছত্রাকজনিত ব্লাইট রোগের লক্ষণ।
🛠️ **প্রতিকার**:
১. প্রতি লিটার জলে ৫ মিলি নিম তেল বা ২ গ্রাম ম্যানকোজেব স্প্রে করুন।
২. আক্রান্ত পাতা ছিঁড়ে ধ্বংস করুন। বৃষ্টির পরে স্প্রে করুন।`;
      case "gu":
        return `🔍 **રોગ ઓળખ**: પાન પર કાળા-બદામી ડાઘ ફૂગજન્ય સુકારો રોગ દર્શાવે છે.
🛠️ **ઉપચાર**:
૧. ૧ લીટર પાણીમાં ૫ મિલી લીમડાનું તેલ અથવા ૨ ગ્રામ મેન્કોઝેબ મિક્સ કરીને છાંટો.
૨. વરસાદ બંધ થયા પછી જ દવાનો છંટકાવ કરો.`;
      case "pa":
        return `🔍 **ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ**: ਪੱਤਿਆਂ 'ਤੇ ਕਾਲੇ-ਭੂਰੇ ਦਾਗ਼ ਉੱਲੀ (ਝੁਲਸ ਰੋਗ) ਦੇ ਲੱਛਣ ਹਨ।
🛠️ **ਇਲਾਜ**:
1. ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ 5 ਮਿਲੀ ਨਿੰਮ ਦਾ ਤੇਲ ਜਾਂ 2 ਗ੍ਰਾਮ ਮੈਨਕੋਜ਼ੇਬ ਘੋਲ ਕੇ ਛਿੜਕੋ।
2. ਮੀਂਹ ਰੁਕਣ ਤੋਂ ਬਾਅਦ ਹੀ ਸਪਰੇਅ ਕਰੋ।`;
      default:
        return `🔍 **Diagnosis**: Fungal Leaf Spot / Blight (Alternaria / Cercospora / Phytophthora).
🛠️ **Step-by-Step Action Plan**:
1. **Organic Option**: Spray cold-pressed Neem Oil 10,000 PPM @ 5ml/L with a wetting agent, or Trichoderma viride @ 5g/L.
2. **Chemical Control**: Spray Mancozeb 75% WP @ 2g/L or Hexaconazole 5% EC @ 1.5ml/L. Ensure complete canopy coverage.
3. **Cultural Practice**: Prune infected lower leaves to restrict spore splash. Since rainfall probability is ${weather.rainProbability}%, postpone spraying until the rain clears.`;
    }
  }

  // 4. Pests & Insects: Whitefly, Aphids, Thrips, Caterpillars, Stem Borer, Bollworm, Mites
  if (
    /pest|insect|bug|whitefly|aphid|thrip|caterpillar|borer|bollworm|mite|worm|armyworm|larva|trap/i.test(
      qLower,
    ) ||
    q.includes("పురుగు") ||
    q.includes("తెల్లదోమ") ||
    q.includes("తామర") ||
    q.includes("పేనుబంక") ||
    q.includes("లద్దెపురుగు") ||
    q.includes("కీటకాలు") ||
    q.includes("कीट") ||
    q.includes("कीड़े") ||
    q.includes("सफेद मक्खी") ||
    q.includes("थ्रिप्स") ||
    q.includes("माहू") ||
    q.includes("इल्ली") ||
    q.includes("सुंडी") ||
    q.includes("பூச்சி") ||
    q.includes("வெள்ளை ஈ") ||
    q.includes("ಕೀಟ") ||
    q.includes("ಹುಳು") ||
    q.includes("कीड") ||
    q.includes("पोका") ||
    q.includes("જીવાત") ||
    q.includes("ਕੀੜੇ")
  ) {
    switch (lang) {
      case "te":
        return `🔍 **కీటక సమస్య**: రసం పీల్చే పురుగులు (తెల్లదోమ, తామర పురుగులు, పేనుబంక) లేదా కాయ తొలిచే పురుగులు.
🛠️ **సమగ్ర నివారణ ప్రణాళిక**:
1. **పసుపు/నీలి జిగురు అట్టలు**: ఎకరానికి 20-25 పసుపు మరియు నీలి జిగురు అట్టలు అమర్చి పురుగులను బంధించండి.
2. **సేంద్రీయ పిచికారీ**: లీటరు నీటికి 5 మి.లీ వేప నూనెను ఆకుల అడుగుభాగం తడిసేలా పిచికారీ చేయండి.
3. **రసాయన మందులు**:
   - తెల్లదోమ / పేనుబంక కోసం: ఇమిడాక్లోప్రిడ్ 17.8% SL (0.3 మి.లీ/లీటర్) లేదా ఎసిటామిప్రిడ్ 20% SP (0.5 గ్రా/లీటర్).
   - లద్దెపురుగు / కాయ తొలిచే పురుగుల కోసం: క్లోరాంట్రానిలిప్రోల్ 18.5% SC (0.3 మి.లీ/లీటర్) లేదా ప్రొఫెనోఫాస్ (2 మి.లీ/లీటర్).`;
      case "hi":
        return `🔍 **कीट की पहचान**: रस चूसक कीट (सफेद मक्खी, थ्रिप्स, माहू) अथवा तना/फल छेदक इल्ली।
🛠️ **नियंत्रण उपाय**:
1. **स्टिकी ट्रैप**: प्रति एकड़ 20 पीले व नीले चिपचिपे ट्रैप लगाएं।
2. **जैविक नियंत्रण**: 5 मिली नीम तेल प्रति लीटर पानी का छिड़काव पत्तियों के नीचे करें।
3. **कीटनाशक स्प्रे**:
   - सफेद मक्खी/थ्रिप्स: इमिडाक्लोप्रिड 17.8% SL (0.3 मिली/लीटर) या एसिटामिप्रिड (0.5 ग्राम/लीटर)।
   - इल्ली/सुंडी: क्लोरेंट्रानिलीप्रोल 18.5% SC (0.3 मिली/लीटर) या प्रोफेनोफॉस (2 मिली/लीटर)।`;
      case "ta":
        return `🔍 **பூச்சி மேலாண்மை**: சாறு உறிஞ்சும் வெள்ளை ஈ, அசுவிணி அல்லது காய் துளைப்பான் புழுக்கள்.
🛠️ **கட்டுப்பாடு**:
1. ஏக்கருக்கு 20 மஞ்சள்/நீல ஒட்டும் பொறிகளை அமைக்கவும்.
2. இமிடாக்ளோபிரிட் 0.3 மிலி/லிட்டர் அல்லது வேப்ப எண்ணெய் 5 மிலி/லிட்டர் தெளிக்கவும்.`;
      case "kn":
        return `🔍 **ಕೀಟ ನಿರ್ವಹಣೆ**: ಬಿಳಿ ನೊಣ, ಅಫಿಡ್ಸ್ ಅಥವಾ ಕಾಯಿಕೊರೆಯುವ ಹುಳು.
🛠️ **ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು**:
1. ಎಕರೆಗೆ 20 ಹಳದಿ ಅಂಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.
2. ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 0.3 ಮಿಲಿ/ಲೀಟರ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 5 ಮಿಲಿ ಸಿಂಪಡಿಸಿ.`;
      case "mr":
        return `🔍 **कीड नियंत्रण**: पांढरी माशी, थ्रिप्स किंवा बोंडअळी/खोडकीड.
🛠️ **उपाय**:
1. एकरी २० पिवळे/निळे चिकट सापळे लावा.
2. इमिडाक्लोप्रिड ०.३ मिली किंवा कडुनिंब तेल ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.`;
      case "bn":
        return `🔍 **কীটপতঙ্গ নিয়ন্ত্রণ**: সাদা মাছি, জাবপোকা বা লেদা পোকার আক্রমণ।
🛠️ **ব্যবস্থাপনা**:
১. একরে ২০টি হলুদ স্টিকি ট্র্যাপ বসান।
২. ইমিডাক্লোপ্রিড ০.৩ মিলি/লিটার অথবা নিম তেল ৫ মিলি স্প্রে করুন।`;
      case "gu":
        return `🔍 **જીવાત નિયંત્રણ**: સફેદ માખી, થ્રીપ્સ અથવા ઈયળનો ઉપદ્રવ.
🛠️ **ઉપાયો**:
૧. એકરે ૨૦ પીળા સ્ટીકી ટ્રેપ લગાવો.
૨. ઈમિડાક્લોપ્રિડ ૦.૩ મિલી અથવા લીમડાનું તેલ ૫ મિલી છાંટો.`;
      case "pa":
        return `🔍 **ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ**: ਚਿੱਟੀ ਮੱਖੀ, ਤੇਲਾ ਜਾਂ ਸੁੰਡੀ ਦਾ ਹਮਲਾ।
🛠️ **ਕੰਟਰੋਲ**:
1. ਪ੍ਰਤੀ ਏਕੜ 20 ਪੀਲੇ ਸਟਿੱਕੀ ਟਰੈਪ ਲਗਾਓ।
2. ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 0.3 ਮਿਲੀ ਜਾਂ ਨਿੰਮ ਦਾ ਤੇਲ 5 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਸਪਰੇਅ ਕਰੋ।`;
      default:
        return `🔍 **Pest Diagnostic**: Sucking Pests (Whitefly, Thrips, Aphids) or Chewing Caterpillars (Helicoverpa/Spodoptera).
🛠️ **Comprehensive IPM Strategy**:
1. **Physical Control**: Install 20-25 Yellow & Blue Sticky Traps per acre + Pheromone traps.
2. **Bio-Control**: Spray Neem Oil 10,000 PPM @ 5ml/L or Beauveria bassiana @ 5g/L.
3. **Chemical Knockdown**:
   - For Sucking Pests: Imidacloprid 17.8% SL @ 0.3ml/L OR Acetamiprid 20% SP @ 0.5g/L.
   - For Caterpillars/Borers: Chlorantraniliprole 18.5% SC @ 0.3ml/L OR Emamectin Benzoate 5% SG @ 0.4g/L.`;
    }
  }

  // 5. Fertilizers, Soil Nutrients, NPK, Urea, Potash, DAP, Micro-nutrients
  if (
    /fertilizer|npk|potash|mop|urea|dap|nutrient|zinc|boron|calcium|magnesium|soil|ph|manure|compost|dung/i.test(
      qLower,
    ) ||
    q.includes("ఎరువు") ||
    q.includes("ఎరువులు") ||
    q.includes("యూరియా") ||
    q.includes("పొటాష్") ||
    q.includes("నేల") ||
    q.includes("పోషకాలు") ||
    q.includes("खाद") ||
    q.includes("उर्वरक") ||
    q.includes("यूरिया") ||
    q.includes("पोटाश") ||
    q.includes("मिट्टी") ||
    q.includes("உரம்") ||
    q.includes("பொட்டாஷ்") ||
    q.includes("மண்") ||
    q.includes("ಗೊಬ್ಬರ") ||
    q.includes("ಯೂರಿಯಾ") ||
    q.includes("ಖತ") ||
    q.includes("সার") ||
    q.includes("ખાતર") ||
    q.includes("ਖਾਦ")
  ) {
    switch (lang) {
      case "te":
        return `🌱 **నేల & ఎరువుల యాజమాన్యం**:
📊 **పొలం పరీక్ష నివేదిక**: నేల pH ${soil.ph.value} (సరిపడా ఉంది). నత్రజని, భాస్వరం బాగున్నాయి, కానీ పొటాషియం 30% తో లోపించింది.
⚖️ **ఎరువుల సిఫార్సు మోతాదు**:
1. **పొటాషియం భర్తీ**: వర్షం తగ్గిన తర్వాత ఎకరానికి 25 కిలోల మ్యూరియేట్ ఆఫ్ పొటాష్ (MOP) ను తేమ ఉన్నప్పుడు వేయండి.
2. **యూరియా మోతాదు**: ఒకేసారి కాకుండా 3 దఫాలుగా విభజించి వేయండి (మొక్క ఎదుగుదల, పూత దశలలో).
3. **సూక్ష్మ పోషకాలు**: ఆకులు పచ్చగా ఉండటానికి లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ + 1 గ్రాము బోరాన్ కలిపి పిచికారీ చేయండి.`;
      case "hi":
        return `🌱 **मृदा स्वास्थ्य एवं उर्वरक प्रबंधन**:
📊 **खेत की रिपोर्ट**: मिट्टी का pH ${soil.ph.value} सामान्य है। नाइट्रोजन व फास्फोरस ठीक हैं, लेकिन पोटाश की कमी (30%) है।
⚖️ **खाद की सही खुराक**:
1. **पोटाश आपूर्ति**: बारिश के बाद प्रति एकड़ 25 किलोग्राम म्यूरेट ऑफ पोटाश (MOP) डालें।
2. **यूरिया का प्रयोग**: यूरिया को एक साथ न डालकर 3 बार में विभाजित करके दें।
3. **सूक्ष्म पोषक तत्व**: पत्तियों के विकास के लिए 2 ग्राम जिंक सल्फेट व 1 ग्राम बोरॉन प्रति लीटर पानी में मिलाकर स्प्रे करें।`;
      case "ta":
        return `🌱 **மண் மற்றும் உர மேலாண்மை**:
மண் pH ${soil.ph.value}. பொட்டாசியம் குறைவாக உள்ளது.
1. ஏக்கருக்கு 25 கிலோ பொட்டாஷ் உரமிடவும்.
2. துத்தநாகம் 2 கிராம்/லிட்டர் தெளிக்கவும்.`;
      case "kn":
        return `🌱 **ಮಣ್ಣು ಮತ್ತು ರಸಗೊಬ್ಬರ ಮಾಹಿತಿ**:
ಮಣ್ಣಿನ pH ${soil.ph.value}. ಪೊಟ್ಯಾಶಿಯಂ ಕೊರತೆಯಿದೆ.
1. ಎಕರೆಗೆ 25 ಕೆಜಿ ಪೊಟ್ಯಾಶ್ ಹಾಕಿ.
2. ಸತು ಮತ್ತು ಬೋರಾನ್ ಲಘು ಪೋಷಕಾಂಶಗಳನ್ನು ಸಿಂಪಡಿಸಿ.`;
      case "mr":
        return `🌱 **माती व खत व्यवस्थापन**:
मातीचा सामू ${soil.ph.value} योग्य आहे. पोटॅशची कमतरता आहे.
1. एकरी २५ किलो पोटॅश द्या.
2. सूक्ष्मअन्नद्रव्ये (झिंक व बोरॉन) फवारा.`;
      case "bn":
        return `🌱 **মাটি ও সার ব্যবস্থাপনা**:
মাটির pH ${soil.ph.value}। পটাশিয়ামের ঘাটতি রয়েছে।
১. একরে ২৫ কেজি পটাশ দিন।
২. জিংক ও বোরন স্প্রে করুন।`;
      case "gu":
        return `🌱 **જમીન અને ખાતર વ્યવસ્થાપન**:
જમીનનું pH ${soil.ph.value} છે. પોટાશ ઓછો છે.
૧. એકરે ૨૫ કિલો પોટાશ આપો.
૨. ઝિંક અને બોરોનનો છંટકાવ કરો.`;
      case "pa":
        return `🌱 **ਖਾਦ ਅਤੇ ਮਿੱਟੀ ਪ੍ਰਬੰਧਨ**:
ਮਿੱਟੀ ਦਾ pH ${soil.ph.value} ਠੀਕ ਹੈ। ਪੋਟਾਸ਼ ਦੀ ਕਮੀ ਹੈ।
1. 25 ਕਿਲੋ ਪੋਟਾਸ਼ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ।
2. ਜ਼ਿੰਕ ਅਤੇ ਬੋਰਾਨ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।`;
      default:
        return `🌱 **Soil Nutrition & Fertilizer Plan**:
📊 **Current Telemetry**: pH is ${soil.ph.value} (Optimal). Nitrogen & Phosphorus are balanced, but Potassium is deficient at 30%.
⚖️ **Customized Fertilizer Prescription**:
1. **Potash Supplement**: Apply 25 kg MOP (Muriate of Potash 60% K2O) per acre once the current rain spell clears.
2. **Nitrogen (Urea)**: Always split into 3 basal/top-dress doses to prevent leaching losses.
3. **Micronutrient Boost**: Foliar spray Zinc Sulphate (2g/L) + Boron 20% (1g/L) during active vegetative and flowering stages for enhanced fruit setting.`;
    }
  }

  // 6. Weather, Rain Forecast, Spray Windows & Temperature
  if (
    /rain|weather|temperature|forecast|climate|humidity|spray window|wind|frost/i.test(qLower) ||
    q.includes("వర్షం") ||
    q.includes("వాతావరణం") ||
    q.includes("ఉష్ణోగ్రత") ||
    q.includes("ఎండ") ||
    q.includes("बारिश") ||
    q.includes("मौसम") ||
    q.includes("तापमान") ||
    q.includes("மழை") ||
    q.includes("வானிலை") ||
    q.includes("ಮಳೆ") ||
    q.includes("हवामान") ||
    q.includes("বৃষ্টি") ||
    q.includes("વરસાદ") ||
    q.includes("ਮੀਂਹ")
  ) {
    switch (lang) {
      case "te":
        return `🌦️ **వాతావరణ సమాచారం & సూచనలు**:
🌡️ ఉష్ణోగ్రత: **${weather.temp}°C** | గాలి తేమ: **${weather.humidity}%** | వర్ష సూచన: **${weather.rainProbability}%** (12 మి.మీ వర్షం).
⚠️ **రైతులకు ముఖ్య హెచ్చరిక**: వర్షం పడే అవకాశం ఎక్కువగా ఉన్నందున ఈ రోజు మందుల పిచికారీని ఖచ్చితంగా వాయిదా వేయండి. వర్షం తగ్గాక గాలి వేగం 10 కి.మీ/గం కంటే తక్కువ ఉన్నప్పుడు ఉదయం వేళ పిచికారీ చేయండి.`;
      case "hi":
        return `🌦️ **मौसम की स्थिति व छिड़काव परामर्श**:
🌡️ तापमान: **${weather.temp}°C** | नमी: **${weather.humidity}%** | वर्षा संभावना: **${weather.rainProbability}%**।
⚠️ **महत्वपूर्ण सलाह**: आज बारिश की 75% संभावना है, इसलिए किसी भी कीटनाशक या खाद का छिड़काव तुरंत टालें। बारिश रुकने के बाद मौसम साफ होने पर ही स्प्रे करें।`;
      case "ta":
        return `🌦️ **வானிலை அறிக்கை**:
வெப்பநிலை: ${weather.temp}°C | மழை வாய்ப்பு: ${weather.rainProbability}%.
மழை வருவதால் மருந்து தெளிப்பதை ஒத்திவைக்கவும்.`;
      case "kn":
        return `🌦️ **ಹವಾಮಾನ ವರದಿ**:
ತಾಪಮಾನ: ${weather.temp}°C | ಮಳೆ ಸಂಭವ: ಶೇ. ${weather.rainProbability}.
ಮಳೆಯ ಸಂಭವವಿರುವುದರಿಂದ ಔಷಧಿ ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ.`;
      case "mr":
        return `🌦️ **हवामान अंदाज**:
तापमान: ${weather.temp}°C | पावसाची शक्यता: ${weather.rainProbability}%.
पावसामुळे फवारणी पुढे ढकला.`;
      case "bn":
        return `🌦️ **আবহাওয়ার পূর্বাভাস**:
তাপমাত্রা: ${weather.temp}°C | বৃষ্টির সম্ভাবনা: ${weather.rainProbability}%।
আজ স্প্রে করা বন্ধ রাখুন।`;
      case "gu":
        return `🌦️ **હવામાન અહેવાલ**:
તાપમાન: ${weather.temp}°C | વરસાદની શક્યતા: ${weather.rainProbability}%.
દવાનો છંટકાવ મુલતવી રાખો.`;
      case "pa":
        return `🌦️ **ਮੌਸਮ ਜਾਣਕਾਰੀ**:
ਤਾਪਮਾਨ: ${weather.temp}°C | ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ: ${weather.rainProbability}%।
ਸਪਰੇਅ ਕਰਨਾ ਮੁਲਤਵੀ ਕਰੋ।`;
      default:
        return `🌦️ **Hyperlocal Weather & Spraying Advisory**:
🌡️ Temperature: **${weather.temp}°C** | Humidity: **${weather.humidity}%** | Rain Probability: **${weather.rainProbability}%** (12mm expected).
⚠️ **Agronomist Recommendation**: Highly unfavorable spraying window today due to impending precipitation. Spraying now would wash away expensive chemicals. Resume foliar applications 24-36 hours after rain cessations during calm morning hours (<10 km/h wind).`;
    }
  }

  // 7. Irrigation, Water Management, Drip & Soil Moisture
  if (
    /irrigate|irrigation|water|watering|drip|moisture|dry|wet|flood|drainage/i.test(qLower) ||
    q.includes("నీరు") ||
    q.includes("నీటిపారుదల") ||
    q.includes("తేమ") ||
    q.includes("డ్రిప్") ||
    q.includes("पानी") ||
    q.includes("सिंचाई") ||
    q.includes("नमी") ||
    q.includes("பாசனம்") ||
    q.includes("ஈரப்பதம்") ||
    q.includes("ನೀರಾವರಿ") ||
    q.includes("सिंचन") ||
    q.includes("সেচ") ||
    q.includes("પિયત") ||
    q.includes("ਸਿੰਚਾਈ")
  ) {
    switch (lang) {
      case "te":
        return `💧 **నీటిపారుదల ప్రణాళిక**:
📊 నేల తేమ ప్రస్తుతం **${soil.moisture.value}%** (సరిపడా ఉంది).
🚫 **నేడు నీరు పెట్టవద్దు**: ఈ రోజు 12 మి.మీ వర్షం పడనుంది. ఇప్పుడు నీరు పెడితే వేరుకుళ్లు తెగులు వచ్చే ప్రమాదం ఉంది. వర్షం తర్వాత నేల తేమ 45% కి పడిపోయినప్పుడు మాత్రమే డ్రిప్ లేదా కాల్వ ద్వారా నీరు ఇవ్వండి.`;
      case "hi":
        return `💧 **सिंचाई परामर्श**:
📊 मिट्टी में नमी स्तर: **${soil.moisture.value}%** (पर्याप्त)।
🚫 **आज पानी न लगाएं**: आज 12 मिमी बारिश का अनुमान है। आज सिंचाई करने से खेत में जलभराव और जड़ सड़न हो सकती है। वर्षा के बाद जब नमी 45% से कम हो, तभी पानी दें।`;
      case "ta":
        return `💧 **பாசன ஆலோசனை**:
மண்ணில் ${soil.moisture.value}% ஈரப்பதம் உள்ளது. இன்று மழை வரவுள்ளதால் பாசனம் செய்ய வேண்டாம்.`;
      case "kn":
        return `💧 **ನೀರಾವರಿ ಸಲಹೆ**:
ಮಣ್ಣಿನಲ್ಲಿ ಶೇ. ${soil.moisture.value} ತೇವಾಂಶವಿದೆ. ಮಳೆ ನಿರೀಕ್ಷೆಯಿರುವುದರಿಂದ ಇಂದು ನೀರು ಹಾಯಿಸಬೇಡಿ.`;
      case "mr":
        return `💧 **सिंचन सल्ला**:
मातीत ${soil.moisture.value}% ओलावा आहे. आज पाणी देऊ नका.`;
      case "bn":
        return `💧 **সেচ পরামর্শ**:
মাটিতে ${soil.moisture.value}% আর্দ্রতা রয়েছে। আজ সেচ দেওয়ার প্রয়োজন নেই।`;
      case "gu":
        return `💧 **પિયત સલાહ**:
જમીનમાં ${soil.moisture.value}% ભેજ છે. આજે પાણી ન આપો.`;
      case "pa":
        return `💧 **ਸਿੰਚਾਈ ਸਲਾਹ**:
ਮਿੱਟੀ ਵਿੱਚ ${soil.moisture.value}% ਨਮੀ ਹੈ। ਅੱਜ ਪਾਣੀ ਨਾ ਲਗਾਓ।`;
      default:
        return `💧 **Smart Irrigation Advisory**:
📊 Current Root-Zone Moisture: **${soil.moisture.value}%** (Optimal).
🚫 **Recommendation**: HOLD OFF Irrigation. With ${weather.rainProbability}% rain forecasted today (12mm), withholding irrigation saves pumping electricity, conserves groundwater, and prevents anaerobic root suffocations and damping-off fungi. Resume drip cycles when moisture dips below 45%.`;
    }
  }

  // 8. Crop Growth, Canopy Score & Health Index
  if (
    /growth|height|canopy|score|health|leaf color|spad|greenness|stage|yield/i.test(qLower) ||
    q.includes("పెరుగుదల") ||
    q.includes("ఎత్తు") ||
    q.includes("పందిరి") ||
    q.includes("ఆరోగ్యం") ||
    q.includes("దిగుబడి") ||
    q.includes("वृद्धि") ||
    q.includes("स्वास्थ्य") ||
    q.includes("कैनोपी") ||
    q.includes("வளர்ச்சி") ||
    q.includes("ಬೆಳವಣಿಗೆ") ||
    q.includes("वाढ") ||
    q.includes("বৃদ্ধি") ||
    q.includes("વિકાસ") ||
    q.includes("ਵਾਧਾ")
  ) {
    switch (lang) {
      case "te":
        return `📈 **పంట పెరుగుదల & పందిరి విశ్లేషణ**:
⭐ పంట ఆరోగ్య స్కోర్: **89/100 (చాలా బాగుంది)**
🌿 పందిరి కవరేజీ: **74%** | ఆకు పచ్చదనం సూచిక (SPAD): **42** | ఎత్తు: **48 సెం.మీ**.
🌱 **సలహా**: మీ పంట ప్రస్తుతం ఏపుగా ఎదుగుతోంది. పూత రాలకుండా ఉండేందుకు 13-0-45 (పొటాషియం నైట్రేట్) 5 గ్రా/లీ పిచికారీ చేయండి.`;
      case "hi":
        return `📈 **फसल वृद्धि एवं कैनोपी रिपोर्ट**:
⭐ स्वास्थ्य स्कोर: **89/100 (उत्तम व स्वस्थ)**
🌿 कैनोपी फैलाव: **74%** | पत्ती हरापन सूचकांक (SPAD): **42** | ऊंचाई: **48 सेमी**।
🌱 **सलाह**: फसल की बढ़वार बहुत अच्छी है। फूल व फल झड़ने से रोकने के लिए 13-0-45 का छिड़काव करें।`;
      case "ta":
        return `📈 **பயிர் வளர்ச்சி அறிக்கை**:
சுகாதார மதிப்பீடு: 89/100 (மிக நன்று). வளர்ச்சி சீராக உள்ளது.`;
      case "kn":
        return `📈 **ಬೆಳೆ ಬೆಳವಣಿಗೆ ವರದಿ**:
ಆರೋಗ್ಯ ಸ್ಕೋರ್: 89/100 (ಉತ್ತಮ). ಬೆಳೆ ಆರೋಗ್ಯಕರವಾಗಿದೆ.`;
      case "mr":
        return `📈 **पीक वाढ अहवाल**:
आरोग्य स्कोअर: ८९/१०० (उत्तम). वाढ जोमदार आहे.`;
      case "bn":
        return `📈 **ফসল বৃদ্ধি রিপোর্ট**:
স্বাস্থ্য স্কোর: ৮৯/১০০ (চমৎকার)। বৃদ্ধি ভালো হচ্ছে।`;
      case "gu":
        return `📈 **પાક વિકાસ અહેવાલ**:
હેલ્થ સ્કોર: ૮૯/૧૦૦ (ઉત્તમ). પાકનો વિકાસ સારો છે.`;
      case "pa":
        return `📈 **ਫ਼ਸਲ ਵਾਧਾ ਰਿਪੋਰਟ**:
ਸਿਹਤ ਸਕੋਰ: 89/100 (ਬਹੁਤ ਵਧੀਆ)। ਵਾਧਾ ਤੰਦਰੁਸਤ ਹੈ।`;
      default:
        return `📈 **Continuous Growth & Health Index**:
⭐ Overall Crop Health Score: **89/100 (Thriving & Vigorous)**.
🌿 Ground Canopy Coverage: **74%** | Chlorophyll SPAD Index: **42** | Average Plant Height: **48 cm**.
🌱 **Agronomist Tip**: Vegetative vigor is strong. To promote uniform flowering and prevent bud drop, apply Potassium Nitrate (13-0-45) @ 5g/L during early morning hours.`;
    }
  }

  // 9. Specific Crop Knowledge Handling (Tomato, Chilli, Paddy, Cotton, etc.)
  if (/tomato|టమోటా|टमाटर|தக்காளி|ಟೊಮೆಟೊ|टोमॅटो|টমেটো|ટામેટાં|ਟਮਾਟਰ/i.test(qLower)) {
    switch (lang) {
      case "te":
        return `🍅 **టమోటా పంట సమగ్ర సలహా**:
- **ప్రధాన తెగుళ్లు**: ఎర్లీ బ్లైట్ మరియు తెల్లదోమ.
- **నివారణ**: లీటరు నీటికి 5 మి.లీ వేప నూనె లేదా 2 గ్రాముల మాంకోజెబ్ కలపండి.
- **ఎరువులు**: కాయ గట్టిదనం మరియు రంగు కోసం ఎకరానికి 25 కిలోల పొటాష్ వేయండి.`;
      case "hi":
        return `🍅 **टमाटर की फसल सलाह**:
- **प्रमुख समस्याएं**: अगेती झुलसा और सफेद मक्खी।
- **उपचार**: 5 मिली नीम तेल या 2 ग्राम मैंकोजेब प्रति लीटर पानी में छिड़कें।
- **खाद**: अच्छे फल व चमक के लिए 25 किलो पोटाश प्रति एकड़ दें।`;
      default:
        return `🍅 **Tomato Crop Management**:
- **Key Risks**: Early Blight and Whitefly vector transmissions.
- **Treatment**: Spray Neem oil @ 5ml/L or Mancozeb 75% WP @ 2g/L.
- **Fertilizer**: 25 kg MOP Potash/acre during flowering for firm, crack-resistant fruits.`;
    }
  }

  if (/chilli|pepper|మిరప|मिर्च|மிளகாய்|ಮೆಣಸಿನಕಾಯಿ|मिरची|লঙ্কা|મરચાં|ਮਿਰਚ/i.test(qLower)) {
    switch (lang) {
      case "te":
        return `🌶️ **మిరప పంట సమగ్ర సలహా**:
- **ప్రధాన సమస్య**: తామర పురుగులు మరియు ఆకు ముడత (Leaf Curl).
- **నివారణ**: ఎకరానికి 30 నీలి/పసుపు జిగురు అట్టలు పెట్టండి. ఫిప్రోనిల్ 5% SC (1.5 మి.లీ/లీటర్) లేదా ఎసిఫేట్ పిచికారీ చేయండి.
- **పోషకాలు**: పూత రాలకుండా జింక్ మరియు బోరాన్ పిచికారీ చేయండి.`;
      case "hi":
        return `🌶️ **मिर्च की फसल सलाह**:
- **प्रमुख समस्याएं**: थ्रिप्स और पत्ती मरोड़िया रोग।
- **उपचार**: नीले/पीले स्टिकी ट्रैप लगाएं। फिप्रोनिल (1.5 मिली/लीटर) का छिड़काव करें।
- **पोषण**: फूल झड़ने से रोकने के लिए बोरॉन और जिंक स्प्रे करें।`;
      default:
        return `🌶️ **Chilli Crop Advisory**:
- **Primary Concerns**: Thrips, Mites, and Chilli Leaf Curl Virus.
- **Control**: Erect 30 Blue & Yellow sticky traps/acre. Spray Fipronil 5% SC @ 1.5ml/L or Diafenthiuron 50% WP @ 1g/L.
- **Nutrients**: Foliar Boron (1g/L) + Zinc (2g/L) prevents flower drops.`;
    }
  }

  if (/paddy|rice|వరి|धान|चावल|நெல்|ಭತ್ತ|भात|ধান|ડાંગર|ਝੋਨਾ/i.test(qLower)) {
    switch (lang) {
      case "te":
        return `🌾 **వరి పంట సమగ్ర సలహా**:
- **ప్రధాన సమస్యలు**: అగ్గి తెగులు (బ్లాస్ట్) మరియు కాండం తొలిచే పురుగు.
- **నివారణ**: ట్రైసైక్లాజోల్ 75% WP (0.6 గ్రా/లీ) లేదా క్లోరాంట్రానిలిప్రోల్ వేయండి.
- **నీరు**: పిలకల దశలో 2-3 సెం.మీ నీటి మట్టం ఉంచండి.`;
      case "hi":
        return `🌾 **धान की फसल सलाह**:
- **प्रमुख समस्याएं**: झुलसा (ब्लास्ट) और तना छेदक।
- **उपचार**: ट्राइसाइक्लाजोल (0.6 ग्राम/लीटर) या क्लोरेंट्रानिलीप्रोल का उपयोग करें।
- **जल प्रबंधन**: कल्ले फूटते समय 2-3 सेमी पानी बनाए रखें।`;
      default:
        return `🌾 **Paddy / Rice Advisory**:
- **Key Threats**: Blast (Pyricularia oryzae) and Stem Borer.
- **Remedy**: Spray Tricyclazole 75% WP @ 0.6g/L for blast; Chlorantraniliprole 0.4% G for stem borer.
- **Water**: Maintain 2-3 cm standing water during active tillering.`;
    }
  }

  if (/cotton|పత్తి|कपास|பருத்தி|ಹತ್ತಿ|कापूस|তুলা|કપાસ|ਨਰਮਾ/i.test(qLower)) {
    switch (lang) {
      case "te":
        return `☁️ **పత్తి పంట సమగ్ర సలహా**:
- **ప్రధాన సమస్య**: గులాబీ రంగు కాయ తొలిచే పురుగు మరియు రసం పీల్చే పురుగులు.
- **నివారణ**: ఎకరానికి 5 లింగాకర్షక బుట్టలు పెట్టండి. ప్రొఫెనోఫాస్ 50% EC (2 మి.లీ/లీటర్) పిచికారీ చేయండి.
- **పోషకాలు**: కాయల సంఖ్య పెరగడానికి 13-0-45 (10 గ్రా/లీ) పిచికారీ చేయండి.`;
      case "hi":
        return `☁️ **कपास की फसल सलाह**:
- **प्रमुख समस्याएं**: गुलाबी सुंडी और रस चूसक कीट।
- **उपचार**: 5 फेरोमोन ट्रैप प्रति एकड़ लगाएं और प्रोफेनोफॉस (2 मिली/लीटर) का छिड़काव करें।
- **पोषण**: टिंडे की अच्छी बढ़वार के लिए 13-0-45 का छिड़काव करें।`;
      default:
        return `☁️ **Cotton Crop Management**:
- **Key Risks**: Pink Bollworm (PBW) and Sucking Pests.
- **Control**: Install 5 Pheromone Traps/acre. Spray Profenofos 50% EC @ 2ml/L.
- **Nutrition**: Spray 13-0-45 (10g/L) during boll swelling stage.`;
    }
  }

  // 10. Default Contextual Agronomic Response (If it matches agricultural context)
  switch (lang) {
    case "te":
      return `రైతు సోదరా, మీ ప్రశ్నను పరిశీలించాను. మీ ${farm.crop} పొలంలో ప్రస్తుత వాతావరణం: ఉష్ణోగ్రత ${weather.temp}°C, వర్ష సూచన ${weather.rainProbability}%, నేల తేమ ${soil.moisture.value}%. పంట సంరక్షణ, ఎరువుల మోతాదు లేదా పురుగు మందుల గురించి మరింత వివరంగా అడగండి, ఖచ్చితమైన పరిష్కారం తెలియజేస్తాను.`;
    case "hi":
      return `किसान भाई, आपका सवाल प्राप्त हुआ। आपके ${farm.crop} खेत का वर्तमान डेटा: तापमान ${weather.temp}°C, बारिश संभावना ${weather.rainProbability}%, नमी ${soil.moisture.value}%। फसल में कीट, रोग, खाद या सिंचाई के बारे में विस्तार से पूछें, मैं सटीक समाधान बताऊंगा।`;
    case "ta":
      return `விவசாய தோழரே, உங்கள் கேள்வி பெறப்பட்டது. உங்கள் பண்ணை விவரம்: பயிர் ${farm.crop}, வெப்பநிலை ${weather.temp}°C, ஈரப்பதம் ${soil.moisture.value}%. பயிர் பாதுகாப்பு குறித்து கேளுங்கள்.`;
    case "kn":
      return `ರೈತ ಮಿತ್ರರೇ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರ: ಬೆಳೆ ${farm.crop}, ತಾಪಮಾನ ${weather.temp}°C, ಮಣ್ಣಿನ ತೇವಾಂಶ ಶೇ. ${soil.moisture.value}. ಬೆಳೆ ರೋಗ ಅಥವಾ ಗೊಬ್ಬರದ ಬಗ್ಗೆ ವಿವರವಾಗಿ ಕೇಳಿ.`;
    case "mr":
      return `शेतकरी मित्रा, तुमचा प्रश्न मिळाला. शेत माहिती: पीक ${farm.crop}, तापमान ${weather.temp}°C, ओलावा ${soil.moisture.value}%. शेतीविषयक शंका विचारा.`;
    case "bn":
      return `কৃষক ভাই, আপনার প্রশ্ন পেয়েছি। খামারের তথ্য: ফসল ${farm.crop}, তাপমাত্রা ${weather.temp}°C, আর্দ্রতা ${soil.moisture.value}%। ফসলের যে কোনো বিষয়ে জিজ্ঞাসা করুন।`;
    case "gu":
      return `ખેડૂત મિત્ર, તમારો પ્રશ્ન મળ્યો. ખેતર સ્થિતિ: પાક ${farm.crop}, તાપમાન ${weather.temp}°C, ભેજ ${soil.moisture.value}%. પાક રોગ કે ખાતર વિશે પૂછો.`;
    case "pa":
      return `ਕਿਸਾਨ ਵੀਰ, ਤੁਹਾਡਾ ਸਵਾਲ ਮਿਲਿਆ। ਖੇਤ ਡਾਟਾ: ਫ਼ਸਲ ${farm.crop}, ਤਾਪਮਾਨ ${weather.temp}°C, ਨਮੀ ${soil.moisture.value}%। ਖੇਤੀ ਸੰਬੰਧੀ ਸਵਾਲ ਪੁੱਛੋ।`;
    default:
      return `Understood your farming query for ${farm.crop}. Current Field Telemetry: Temperature is ${weather.temp}°C, Rain Probability is ${weather.rainProbability}%, and Soil Moisture is ${soil.moisture.value}%. Please specify your exact question regarding disease symptoms, fertilizer dose, or pest control for detailed step-by-step guidance.`;
  }
}
