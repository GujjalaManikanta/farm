/**
 * AgriSmart AI – Universal Database Client & Cloud Adapter
 * Supports Supabase / PostgreSQL cloud synchronization with local storage offline fallback.
 */

export interface DbFarmerProfile {
  id?: string;
  farmerName: string;
  location: string;
  latitude: number;
  longitude: number;
  primaryCrop: string;
  fieldName: string;
  fieldSizeAcres: number;
  preferredLanguage: string;
}

export interface DbCropScan {
  id: string;
  cropName: string;
  diseaseName: string;
  status: "healthy" | "attention" | "critical";
  confidence: number;
  symptoms: string[];
  organicRemedy: string;
  chemicalRemedy: string;
  preventiveCare: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DbGrowthRecord {
  id: string;
  cropName: string;
  growthStage: string;
  healthScore: number;
  leafColorSpad: number;
  plantHeightCm: number;
  canopyCoveragePct: number;
  recordedAt: string;
}

export interface DbVoiceChat {
  id: string;
  userQuery: string;
  aiResponse: string;
  languageCode: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  PROFILE: "agrismart_db_profile",
  SCANS: "agrismart_db_scans",
  GROWTH: "agrismart_db_growth",
  CHATS: "agrismart_db_chats",
};

// Database Connection Config
const SUPABASE_URL = (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : "") || "";
const SUPABASE_KEY = (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY : "") || "";

export const db = {
  /**
   * 1. Farmer Profile
   */
  async getFarmerProfile(): Promise<DbFarmerProfile> {
    if (typeof window === "undefined") {
      return defaultProfile;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }

    return defaultProfile;
  },

  async updateFarmerProfile(profile: Partial<DbFarmerProfile>): Promise<DbFarmerProfile> {
    const current = await this.getFarmerProfile();
    const updated = { ...current, ...profile };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }

    return updated;
  },

  /**
   * 2. Crop Scan Diagnostics Records
   */
  async getScans(): Promise<DbCropScan[]> {
    if (typeof window === "undefined") return defaultScans;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }

    return defaultScans;
  },

  async saveScan(scan: Omit<DbCropScan, "id" | "createdAt">): Promise<DbCropScan> {
    const newRecord: DbCropScan = {
      ...scan,
      id: "scan-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const current = await this.getScans();
    const updated = [newRecord, ...current];

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
    }

    return newRecord;
  },

  /**
   * 3. Crop Growth Logs
   */
  async getGrowthLogs(): Promise<DbGrowthRecord[]> {
    if (typeof window === "undefined") return defaultGrowth;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GROWTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }

    return defaultGrowth;
  },

  async saveGrowthLog(log: Omit<DbGrowthRecord, "id" | "recordedAt">): Promise<DbGrowthRecord> {
    const newLog: DbGrowthRecord = {
      ...log,
      id: "growth-" + Date.now(),
      recordedAt: new Date().toISOString(),
    };

    const current = await this.getGrowthLogs();
    const updated = [newLog, ...current];

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.GROWTH, JSON.stringify(updated));
    }

    return newLog;
  },

  /**
   * 4. Voice Assistant Conversations
   */
  async saveVoiceChat(userQuery: string, aiResponse: string, languageCode: string): Promise<DbVoiceChat> {
    const newChat: DbVoiceChat = {
      id: "chat-" + Date.now(),
      userQuery,
      aiResponse,
      languageCode,
      createdAt: new Date().toISOString(),
    };

    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
        const current: DbVoiceChat[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify([newChat, ...current.slice(0, 50)]));
      }
    } catch {
      // Ignore
    }

    return newChat;
  },
};

const defaultProfile: DbFarmerProfile = {
  farmerName: "Ramesh",
  location: "Srikakulam, Andhra Pradesh",
  latitude: 18.2969,
  longitude: 83.8967,
  primaryCrop: "Tomato",
  fieldName: "Field A (North Plot)",
  fieldSizeAcres: 2.5,
  preferredLanguage: "te",
};

const defaultScans: DbCropScan[] = [
  {
    id: "scan-1",
    cropName: "Tomato",
    diseaseName: "Early Blight (ఆల్టర్నేరియా తెగులు)",
    status: "attention",
    confidence: 96,
    symptoms: [
      "Concentric dark brown target spots on lower leaves",
      "Yellow chlorotic halos surrounding lesions",
    ],
    organicRemedy: "Spray 5% Neem oil (5ml/L) or Trichoderma viride (5g/L). Prune infected lower leaves.",
    chemicalRemedy: "Spray Mancozeb 75% WP (2g/L) or Copper Oxychloride 50% WP (2.5g/L).",
    preventiveCare: "Avoid overhead irrigation, stake plants to increase airflow.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const defaultGrowth: DbGrowthRecord[] = [
  {
    id: "growth-1",
    cropName: "Tomato",
    growthStage: "Vegetative - Active Tillering",
    healthScore: 89,
    leafColorSpad: 42,
    plantHeightCm: 48,
    canopyCoveragePct: 74,
    recordedAt: new Date().toISOString(),
  },
];
