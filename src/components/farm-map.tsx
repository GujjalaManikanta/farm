import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Crosshair,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import { useLocation, AP_TELANGANA_PRESETS, type PresetLocation } from "@/lib/location-context";
import { useLang } from "@/lib/i18n";

export function LiveFarmMapCard() {
  const {
    latitude,
    longitude,
    accuracy,
    formattedAddress,
    village,
    district,
    state,
    soilMoisture,
    temperature,
    status,
    mapEmbedUrl,
    osmLink,
    requestLocation,
    setManualLocation,
  } = useLocation();
  const { lang } = useLang();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 bg-gradient-to-r from-emerald-500/10 via-card to-sky-500/10 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600">
            <MapPin className="size-5" />
            {status === "granted" && (
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-foreground">
                {lang === "te"
                  ? "లైవ్ పొలం లొకేషన్ & మ్యాప్ (Live Farm GPS)"
                  : "Live Farm GPS & Radar Map"}
              </h3>
              {status === "granted" ? (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                  GPS Active (±{accuracy}m)
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
                  {status === "requesting" ? "Locating..." : "Select Farm Zone"}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{formattedAddress}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Change District Button */}
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
          >
            <MapPin className="size-3.5 text-emerald-600" />
            <span>{lang === "te" ? "జిల్లా మార్చండి" : "Change Region"}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>

          {/* Direct GPS Button */}
          <button
            onClick={() => requestLocation()}
            disabled={status === "requesting"}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Navigation className={`size-3.5 ${status === "requesting" ? "animate-spin" : ""}`} />
            <span>
              {status === "requesting"
                ? lang === "te"
                  ? "గుర్తిస్తోంది..."
                  : "Locating..."
                : lang === "te"
                  ? "GPS లైవ్ లొకేషన్"
                  : "Detect Live GPS"}
            </span>
          </button>

          <a
            href={osmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center size-9 rounded-2xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Open full map in OpenStreetMap"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Preset District Selection Drawer (if open) */}
      {showPicker && (
        <div className="border-b border-border/80 bg-muted/40 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              {lang === "te"
                ? "మీ పొలం ఉన్న జిల్లాను ఎంచుకోండి:"
                : "Select your Farm District / Mandal:"}
            </p>
            <button
              onClick={() => setShowPicker(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {AP_TELANGANA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setManualLocation(preset);
                  setShowPicker(false);
                }}
                className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${
                  district.includes(preset.district)
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                    : "border-border/70 bg-card text-foreground hover:bg-muted"
                }`}
              >
                <p className="truncate">{lang === "te" ? preset.nameTe : preset.name}</p>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                  {preset.state}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Map Embed */}
      <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-muted/50 overflow-hidden">
        <iframe
          title="Live Farm OpenStreetMap"
          src={mapEmbedUrl}
          className="h-full w-full border-0 pointer-events-auto"
          loading="lazy"
        />

        {/* Live Coordinate Overlay HUD */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 rounded-2xl bg-background/90 backdrop-blur-md px-3.5 py-2 border border-border/80 shadow-md pointer-events-auto">
            <Crosshair className="size-4 text-emerald-600 shrink-0" />
            <div className="text-[11px] font-bold text-foreground">
              <span>
                {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
              </span>
              <span className="text-muted-foreground ml-2 font-normal">
                ({village}, {district})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-1.5 rounded-2xl bg-background/90 backdrop-blur-md px-3 py-1.5 border border-sky-500/40 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-md">
              <Droplets className="size-3.5 text-sky-600" />
              <span>
                {lang === "te" ? "నేల తేమ:" : "Soil:"} {soilMoisture}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-background/90 backdrop-blur-md px-3 py-1.5 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-md">
              <Thermometer className="size-3.5 text-amber-600" />
              <span>{temperature}°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Top Site Banner / Permission Prompt with direct click handler
 */
export function LocationBannerPrompt() {
  const { status, requestLocation, setManualLocation, village, district, state } = useLocation();
  const { lang } = useLang();
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 text-white px-4 py-2.5 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-white/20">
            <MapPin className="size-4 animate-bounce" />
          </div>
          <div>
            <span className="font-extrabold">
              {lang === "te" ? "మీ పొలం లైవ్ GPS లొకేషన్:" : "Live Farm GPS Location:"}
            </span>{" "}
            <span className="opacity-95 font-medium">
              {status === "granted"
                ? `📍 ${village}, ${district} (${state})`
                : lang === "te"
                  ? "ఖచ్చితమైన నేల తేమ & వాతావరణం కోసం లొకేషన్ అనుమతించండి లేదా ఎంచుకోండి."
                  : "Allow GPS or choose your district for accurate soil & weather."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => requestLocation()}
            className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-black text-emerald-800 shadow-sm hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
          >
            {lang === "te" ? "📍 GPS అనుమతించండి (Allow GPS)" : "📍 Allow Live GPS"}
          </button>

          <button
            onClick={() => setShowPresets(!showPresets)}
            className="rounded-xl border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            {lang === "te" ? "జిల్లా ఎంచుకోండి ▾" : "Select District ▾"}
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="mx-auto max-w-7xl pt-3 pb-1 border-t border-white/20 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
            {AP_TELANGANA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setManualLocation(preset);
                  setShowPresets(false);
                }}
                className="rounded-lg bg-black/20 hover:bg-white/20 p-2 text-left text-xs font-bold text-white transition-all"
              >
                <p className="truncate">{lang === "te" ? preset.nameTe : preset.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
