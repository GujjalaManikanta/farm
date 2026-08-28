import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const STORAGE_KEYS = {
  URL: "agrismart_supabase_url",
  KEY: "agrismart_supabase_anon_key",
};

// Default fallback demo credentials or environment variables
const ENV_URL = (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : "") || "";
const ENV_KEY = (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY : "") || "";

export function getStoredSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  if (typeof window === "undefined") {
    return { url: ENV_URL, anonKey: ENV_KEY, isConfigured: Boolean(ENV_URL && ENV_KEY) };
  }

  const url = localStorage.getItem(STORAGE_KEYS.URL) || ENV_URL;
  const anonKey = localStorage.getItem(STORAGE_KEYS.KEY) || ENV_KEY;
  const isConfigured = Boolean(url && anonKey && url.startsWith("https://"));

  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.KEY, anonKey.trim());
  _supabaseInstance = null; // Reset instance to recreate
}

let _supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseInstance) return _supabaseInstance;

  const { url, anonKey, isConfigured } = getStoredSupabaseConfig();
  if (!isConfigured || !url || !anonKey) {
    return null;
  }

  try {
    _supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return _supabaseInstance;
  } catch (err) {
    console.warn("Could not initialize Supabase client:", err);
    return null;
  }
}

/**
 * Test connectivity with Supabase Cloud
 */
export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = url || getStoredSupabaseConfig().url;
  const targetKey = key || getStoredSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: "Please provide both Supabase Project URL and Anon Public Key.",
    };
  }

  if (!targetUrl.startsWith("https://")) {
    return {
      success: false,
      message: "Project URL must begin with https:// (e.g. https://xyz.supabase.co)",
    };
  }

  try {
    const tempClient = createClient(targetUrl, targetKey);
    // Simple ping to check if credentials are valid
    const { error } = await tempClient.from("farmers").select("id").limit(1);

    if (error && error.code !== "PGRST116" && !error.message.includes("relation") && !error.message.includes("does not exist")) {
      return {
        success: false,
        message: error.message || "Failed to authenticate with Supabase.",
      };
    }

    return {
      success: true,
      message: "Successfully connected to your Supabase Cloud Database! 🚀",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: (err as Error)?.message || "Network error connecting to Supabase.",
    };
  }
}
