import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  MapPin,
  Globe,
  Volume2,
  Bell,
  Sparkles,
  Save,
  Shield,
  Smartphone,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, SectionCard } from "@/components/farm-ui";
import { farm } from "@/lib/farm-data";
import { useLang, languages } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Farmer Profile & Settings | AgriSmart AI" },
      {
        name: "description",
        content: "Configure farm location, language, speech preferences, and crop telemetry.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, t, currentLangInfo } = useLang();
  const { theme, setTheme } = useTheme();
  const [farmerName, setFarmerName] = useState(farm.farmerName);
  const [location, setLocation] = useState(farm.location);
  const [fieldSize, setFieldSize] = useState("2.5");
  const [primaryCrop, setPrimaryCrop] = useState(farm.crop);
  const [speechSpeed, setSpeechSpeed] = useState("normal");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success("Settings Saved Successfully!");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              <User className="size-3.5" />
              <span>Personalized Farm Profile</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t("settings")} & Preferences
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your theme (Light / Dark), language, farm details, and outbreak alerts.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
          >
            <Save className="size-4" />
            <span>{t("saveChanges")}</span>
          </button>
        </div>

        {/* Theme Appearance Selector (Light vs. Dark) */}
        <SectionCard title="Theme & Display Appearance / థీమ్ & రూపం" icon={Sun}>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Switch between Light Mode (optimal for daytime farm use) and Dark Mode (battery saving & night mode):
            </p>

            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  toast.success("Light Mode Activated ☀️");
                }}
                className={`flex items-center justify-between rounded-2xl border p-4 text-xs transition-all cursor-pointer ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 shadow-xs scale-102 ring-2 ring-emerald-500/20"
                    : "border-border bg-card text-muted-foreground hover:bg-muted font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                    <Sun className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">Light Mode</p>
                    <p className="text-[10px] text-muted-foreground">Daytime Farm Clarity</p>
                  </div>
                </div>
                {theme === "light" && <span className="size-2 rounded-full bg-emerald-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  toast.success("Dark Mode Activated 🌙");
                }}
                className={`flex items-center justify-between rounded-2xl border p-4 text-xs transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 shadow-xs scale-102 ring-2 ring-emerald-500/20"
                    : "border-border bg-card text-muted-foreground hover:bg-muted font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <Moon className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">Dark Mode</p>
                    <p className="text-[10px] text-muted-foreground">Night & Battery Saver</p>
                  </div>
                </div>
                {theme === "dark" && <span className="size-2 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Preferred Language Selection Section */}
        <SectionCard title="Preferred Language & Voice Engine" icon={Globe}>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Select your native Indian language. This automatically translates the entire website,
              mobile interface, AI diagnostics, and audio voice responses:
            </p>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {languages.map((l) => {
                const active = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      toast.success(`Language set to ${l.label} (${l.native})`);
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-xs transition-all ${
                      active
                        ? "border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs scale-102"
                        : "border-border bg-card text-foreground hover:bg-muted font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <div className="text-left">
                        <p className="font-bold">{l.native}</p>
                        <p className="text-[10px] text-muted-foreground">{l.label}</p>
                      </div>
                    </div>
                    {active && <span className="size-2 rounded-full bg-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* Farmer Details & Farm Configuration */}
        <SectionCard title="Farmer Details & Plot Specs" icon={Layers}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Farmer Name
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Mandal / District Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Primary Crop
              </label>
              <select
                value={primaryCrop}
                onChange={(e) => setPrimaryCrop(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground"
              >
                <option value="Tomato">Tomato (టమోటా)</option>
                <option value="Chilli">Chilli (మిరప)</option>
                <option value="Paddy">Paddy (వరి)</option>
                <option value="Cotton">Cotton (ప్రత్తి)</option>
                <option value="Maize">Maize (మొక్కజొన్న)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Total Plot Area (Acres)
              </label>
              <input
                type="text"
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground"
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
