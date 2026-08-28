/**
 * AgriSmart AI – Universal Database Client & Cloud Adapter
 * Supports Supabase / PostgreSQL cloud synchronization with local storage offline fallback.
 */
import { getSupabaseClient } from "@/lib/supabase";

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

export const db = {
  /**
   * 1. Farmer Profile
   */
  async getFarmerProfile(): Promise<DbFarmerProfile> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("farmers").select("*").limit(1).single();
        if (data && !error) {
          return {
            id: data.id,
            farmerName: data.farmer_name,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
            primaryCrop: data.primary_crop,
            fieldName: data.field_name,
            fieldSizeAcres: data.field_size_acres,
            preferredLanguage: data.preferred_language,
          };
        }
      } catch {
        // Fallback to local
      }
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }

    return defaultProfile;
  },

  async updateFarmerProfile(profile: Partial<DbFarmerProfile>): Promise<DbFarmerProfile> {
    const current = await this.getFarmerProfile();
    const updated = { ...current, ...profile };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from("farmers").upsert({
          farmer_name: updated.farmerName,
          location: updated.location,
          latitude: updated.latitude,
          longitude: updated.longitude,
          primary_crop: updated.primaryCrop,
          field_name: updated.fieldName,
          field_size_acres: updated.fieldSizeAcres,
          preferred_language: updated.preferredLanguage,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Could not sync profile to Supabase:", err);
      }
    }

    return updated;
  },

  /**
   * 2. Crop Scan Diagnostics Records
   */
  async getScans(): Promise<DbCropScan[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("crop_scans")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            cropName: d.crop_name,
            diseaseName: d.disease_name,
            status: d.status,
            confidence: d.confidence,
            symptoms: Array.isArray(d.symptoms) ? d.symptoms : [],
            organicRemedy: d.organic_remedy,
            chemicalRemedy: d.chemical_remedy,
            preventiveCare: d.preventive_care,
            imageUrl: d.image_url,
            createdAt: d.created_at,
          }));
        }
      } catch {
        // Fallback to local
      }
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
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

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from("crop_scans").insert({
          crop_name: scan.cropName,
          disease_name: scan.diseaseName,
          status: scan.status,
          confidence: scan.confidence,
          symptoms: scan.symptoms,
          organic_remedy: scan.organicRemedy,
          chemical_remedy: scan.chemicalRemedy,
          preventive_care: scan.preventiveCare,
          image_url: scan.imageUrl,
          created_at: newRecord.createdAt,
        });
      } catch (err) {
        console.warn("Could not sync scan to Supabase:", err);
      }
    }

    return newRecord;
  },

  /**
   * 3. Crop Growth Logs
   */
  async getGrowthLogs(): Promise<DbGrowthRecord[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("crop_growth_logs")
          .select("*")
          .order("recorded_at", { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            cropName: d.crop_name,
            growthStage: d.growth_stage,
            healthScore: d.health_score,
            leafColorSpad: d.leaf_color_spad,
            plantHeightCm: d.plant_height_cm,
            canopyCoveragePct: d.canopy_coverage_pct,
            recordedAt: d.recorded_at,
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.GROWTH);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
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

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from("crop_growth_logs").insert({
          crop_name: log.cropName,
          growth_stage: log.growthStage,
          health_score: log.healthScore,
          leaf_color_spad: log.leafColorSpad,
          plant_height_cm: log.plantHeightCm,
          canopy_coverage_pct: log.canopyCoveragePct,
          recorded_at: newLog.recordedAt,
        });
      } catch (err) {
        console.warn("Could not sync growth log to Supabase:", err);
      }
    }

    return newLog;
  },

  /**
   * 4. Voice Assistant Conversations
   */
  async saveVoiceChat(
    userQuery: string,
    aiResponse: string,
    languageCode: string,
  ): Promise<DbVoiceChat> {
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
        localStorage.setItem(
          STORAGE_KEYS.CHATS,
          JSON.stringify([newChat, ...current.slice(0, 50)]),
        );
      }
    } catch {
      // Ignore
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from("voice_conversations").insert({
          user_query: userQuery,
          ai_response: aiResponse,
          language_code: languageCode,
          created_at: newChat.createdAt,
        });
      } catch (err) {
        console.warn("Could not sync voice conversation to Supabase:", err);
      }
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
    organicRemedy:
      "Spray 5% Neem oil (5ml/L) or Trichoderma viride (5g/L). Prune infected lower leaves.",
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
