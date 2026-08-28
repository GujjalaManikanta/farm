export type Status = "good" | "attention" | "risk";

export const statusLabel: Record<Status, string> = {
  good: "Healthy",
  attention: "Attention Needed",
  risk: "High Risk",
};

export const farm = {
  farmerName: "Ramesh",
  location: "Srikakulam, Andhra Pradesh",
  field: "Field A – 2.5 acres",
  crop: "Tomato",
  growthStage: "Fruiting",
  cropHealth: "attention" as Status,
  diseaseRisk: "High",
  disease: "Early Blight",
  confidence: 93,
  lastAnalyzed: "Today, 8:20 AM",
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

export const advice = [
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

export const alerts = [
  {
    id: 1,
    severity: "High",
    icon: "bug",
    title: "High Disease Risk",
    text: "High humidity and rainfall in your area may increase fungal disease risk in tomato crops.",
    time: "2 hours ago",
  },
  {
    id: 2,
    severity: "Moderate",
    icon: "cloud-rain",
    title: "Heavy Rain Alert",
    text: "Around 12 mm of rain expected today evening. Avoid irrigation and spraying.",
    time: "4 hours ago",
  },
  {
    id: 3,
    severity: "Moderate",
    icon: "bug",
    title: "Pest Risk Alert",
    text: "Whitefly activity reported in nearby villages. Inspect leaf undersides.",
    time: "Yesterday",
  },
  {
    id: 4,
    severity: "Low",
    icon: "droplets",
    title: "Irrigation Alert",
    text: "Next irrigation likely needed on Monday if no rain occurs.",
    time: "Yesterday",
  },
  {
    id: 5,
    severity: "Low",
    icon: "flame",
    title: "Heat Stress Alert",
    text: "Temperature may cross 35°C on Tuesday. Irrigate in the early morning.",
    time: "2 days ago",
  },
];

export const history = [
  {
    id: 1,
    date: "28 Aug 2026",
    crop: "Tomato",
    field: "Field A",
    disease: "Early Blight",
    health: "attention" as Status,
    weather: "Humid, showers",
    recommendation: "Remove affected leaves, skip irrigation.",
    outcome: "In progress",
  },
  {
    id: 2,
    date: "14 Aug 2026",
    crop: "Tomato",
    field: "Field A",
    disease: "None detected",
    health: "good" as Status,
    weather: "Sunny",
    recommendation: "Continue normal irrigation schedule.",
    outcome: "Resolved",
  },
  {
    id: 3,
    date: "02 Aug 2026",
    crop: "Chilli",
    field: "Field B",
    disease: "Leaf Curl",
    health: "risk" as Status,
    weather: "Hot and dry",
    recommendation: "Control whitefly, remove curled leaves.",
    outcome: "Recovered",
  },
  {
    id: 4,
    date: "19 Jul 2026",
    crop: "Paddy",
    field: "Field C",
    disease: "None detected",
    health: "good" as Status,
    weather: "Rainy",
    recommendation: "Maintain field water level.",
    outcome: "Healthy",
  },
];

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
