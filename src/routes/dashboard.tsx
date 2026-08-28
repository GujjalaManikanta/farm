import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Thermometer,
  Droplet,
  CloudRain,
  Wind,
  Leaf,
  Camera,
  Upload,
  ImageIcon,
  Stethoscope,
  Sprout,
  CloudSun,
  Bug,
  ShieldAlert,
  Wheat,
  Droplets,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Mic,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  AiNote,
  GaugeBar,
  ListenButton,
  SectionCard,
  StatTile,
  StatusPill,
} from "@/components/farm-ui";
import { farm, forecast, getLocalizedAdvice, getStatusLabel, soil, weather } from "@/lib/farm-data";
import { useLang } from "@/lib/i18n";
import { useLocation } from "@/lib/location-context";
import { LiveFarmMapCard } from "@/components/farm-map";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farm Dashboard | AgriSmart AI" },
      {
        name: "description",
        content: "Today's crop health, weather, irrigation advice and soil status for your farm.",
      },
      { property: "og:title", content: "Farm Dashboard | AgriSmart AI" },
      {
        property: "og:description",
        content: "Crop health, weather, irrigation and soil advice in one simple farmer dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const adviceIcons: Record<string, typeof Bug> = {
  bug: Bug,
  droplets: Droplets,
  sprout: Sprout,
  "cloud-rain": CloudRain,
  "shield-alert": ShieldAlert,
  wheat: Wheat,
};

function Dashboard() {
  const { lang, t, currentLangInfo } = useLang();
  const {
    formattedAddress,
    village,
    district,
    soilMoisture,
    temperature,
    status: locationStatus,
    accuracy,
    requestLocation,
  } = useLocation();

  const currentAdvice = getLocalizedAdvice(lang);
  const healthLabel = getStatusLabel(farm.cropHealth, lang);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome & Farm Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {currentLangInfo.flag} {currentLangInfo.native} •{" "}
                {locationStatus === "granted"
                  ? `Live GPS Active (${village}, ${district})`
                  : "Live Telemetry Active"}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t("greeting")}, {farm.farmerName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {locationStatus === "granted" ? formattedAddress : t("greetingSub")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ListenButton
              text={`${t("greeting")}, ${farm.farmerName}. ${t("weatherVoiceSummary")} ${t("diseaseVoiceSummary")}`}
            />
            <Link
              to="/voice-assistant"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            >
              <Mic className="size-4 animate-pulse text-emerald-600" />
              <span>{t("askVoice")}</span>
            </Link>
            <Link
              to="/crop-doctor"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-xs transition-all hover:brightness-105"
            >
              <Camera className="size-4" />
              <span>{t("startScan")}</span>
            </Link>
          </div>
        </div>

        {/* Primary Metric Tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile
            icon={Leaf}
            label={t("cropHealth")}
            value={healthLabel}
            tone={
              farm.cropHealth === "good"
                ? "success"
                : farm.cropHealth === "risk"
                  ? "destructive"
                  : "warning"
            }
          />
          <StatTile
            icon={Thermometer}
            label={t("temperature")}
            value={`${temperature}°C`}
            subtext={`GPS Live Station`}
            tone="warning"
          />
          <StatTile
            icon={CloudRain}
            label={t("rainChance")}
            value={`${weather.rainProbability}%`}
            subtext="12 mm rain"
            tone="sky"
          />
          <StatTile
            icon={Droplet}
            label={t("humidity")}
            value={`${weather.humidity}%`}
            subtext="High"
            tone="sky"
          />
          <StatTile
            icon={Droplets}
            label={t("soilMoisture")}
            value={`${soilMoisture}%`}
            subtext="Optimal GPS Live"
            tone="success"
          />
          <StatTile
            icon={Wind}
            label={t("wind")}
            value={`${weather.wind} km/h`}
            subtext="From East"
            tone="neutral"
          />
        </div>

        {/* AI Crop Doctor Quick Launch Callout */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/5 p-5 shadow-xs sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="size-3.5" />
                <span>AI Leaf Doctor v2.4</span>
              </div>
              <h2 className="mt-2 text-xl font-black text-foreground sm:text-2xl">
                {t("analyzeCrop")} – 5 Sec Detection
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Notice discoloration or spots on {farm.crop}? Upload or snap a leaf photo now to
                receive instant remedies and voice instructions in {currentLangInfo.native}.
              </p>
            </div>

            <Link
              to="/crop-doctor"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-98"
            >
              <Camera className="size-5" />
              <span>{t("startScan")}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Quick upload drop targets */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/crop-doctor"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-500/40 bg-card/80 p-3.5 text-xs font-bold text-foreground transition-all hover:bg-emerald-500/10 hover:border-emerald-500"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <Camera className="size-4.5" />
              </div>
              <div>
                <p className="font-bold">Live Viewfinder</p>
                <p className="text-[11px] text-muted-foreground">Instant mobile camera</p>
              </div>
            </Link>
            <Link
              to="/crop-growth"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-500/40 bg-card/80 p-3.5 text-xs font-bold text-foreground transition-all hover:bg-emerald-500/10 hover:border-emerald-500"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <TrendingUp className="size-4.5" />
              </div>
              <div>
                <p className="font-bold">Growth Tracker</p>
                <p className="text-[11px] text-muted-foreground">89/100 Canopy Score</p>
              </div>
            </Link>
            <Link
              to="/crop-doctor"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-500/40 bg-card/80 p-3.5 text-xs font-bold text-foreground transition-all hover:bg-emerald-500/10 hover:border-emerald-500"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
                <Upload className="size-4.5" />
              </div>
              <div>
                <p className="font-bold">Upload Photo</p>
                <p className="text-[11px] text-muted-foreground">Gallery PNG / JPG</p>
              </div>
            </Link>
            <Link
              to="/crop-doctor"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-500/40 bg-card/80 p-3.5 text-xs font-bold text-foreground transition-all hover:bg-emerald-500/10 hover:border-emerald-500"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <ImageIcon className="size-4.5" />
              </div>
              <div>
                <p className="font-bold">Sample Leaves</p>
                <p className="text-[11px] text-muted-foreground">Test with presets</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 2x2 Grid: Health, Weather, Irrigation, Soil */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Crop Health Card */}
          <SectionCard
            title={t("fieldDiagnostics")}
            icon={Stethoscope}
            action={
              <Link to="/crop-doctor">
                <StatusPill status={farm.cropHealth} label={healthLabel} />
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {t("possibleDisease")}
                    </p>
                    <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                      {t("diseaseSub")}
                    </p>
                  </div>
                </div>
                <Link
                  to="/crop-doctor"
                  className="shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                >
                  {t("viewRemedy")}
                </Link>
              </div>

              <dl className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                <InfoItem label={t("primaryCrop")} value={farm.crop} />
                <InfoItem label={t("growthStage")} value={farm.growthStage} />
                <InfoItem label={t("fieldPlot")} value={farm.field} />
                <InfoItem label={t("diseaseRisk")} value={farm.diseaseRisk} alert />
                <InfoItem label={t("confidence")} value={`${farm.confidence}%`} />
                <InfoItem label={t("lastScan")} value={farm.lastAnalyzed} />
              </dl>
            </div>
          </SectionCard>

          {/* Today's Weather Card */}
          <SectionCard
            title={t("todaysWeather")}
            icon={CloudSun}
            action={
              <Link to="/weather" className="text-xs font-bold text-primary hover:underline">
                7-Day Forecast →
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-5xl font-black tracking-tight text-foreground">
                    {weather.temp}°C
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{weather.condition}</p>
                    <p className="text-xs text-muted-foreground">
                      Feels like {weather.feelsLike}°C • {weather.wind} km/h wind
                    </p>
                  </div>
                </div>
                <span className="text-4xl">🌦</span>
              </div>

              {/* 5-day mini forecast bar */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {forecast.slice(0, 5).map((f) => (
                  <div key={f.day} className="rounded-xl border border-border/60 bg-muted/40 p-2">
                    <p className="text-[11px] font-bold text-muted-foreground">{f.day}</p>
                    <p className="my-1 text-base">
                      {f.icon === "rain" ? "🌧" : f.icon === "cloud" ? "⛅" : "☀️"}
                    </p>
                    <p className="text-xs font-bold text-foreground">{f.high}°</p>
                    <p className="text-[10px] text-sky-600">{f.rain}%</p>
                  </div>
                ))}
              </div>

              <p className="rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                💡 <strong className="text-foreground">Spraying Window:</strong> Postpone chemical
                spraying today due to expected late afternoon rainfall.
              </p>
            </div>
          </SectionCard>

          {/* Irrigation Advice Card */}
          <SectionCard
            title={t("irrigationAdvice")}
            icon={Droplets}
            action={
              <Link to="/irrigation" className="text-xs font-bold text-primary hover:underline">
                Irrigation Plan →
              </Link>
            }
          >
            <div className="space-y-3.5">
              <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-sm sm:text-base">
                  <CloudRain className="size-5 text-sky-600 shrink-0" />
                  <span>{t("doNotIrrigate")}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {t("doNotIrrigateSub")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground font-semibold">{t("nextWatering")}</p>
                  <p className="mt-1 text-sm font-bold text-foreground">Monday Morning (6:00 AM)</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground font-semibold">{t("waterSaved")}</p>
                  <p className="mt-1 text-sm font-bold text-emerald-600">3,400 Liters (32%)</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Soil Health Card */}
          <SectionCard
            title={t("soilHealth")}
            icon={Sprout}
            action={
              <Link to="/soil" className="text-xs font-bold text-primary hover:underline">
                Full Soil Card →
              </Link>
            }
          >
            <div className="space-y-3">
              <GaugeBar
                label={t("soilMoisture")}
                value={soil.moisture.value}
                display={soil.moisture.label}
                status={soil.moisture.status}
                hint="Optimal: 55-70%"
              />
              <GaugeBar
                label="Soil pH Level (6.4)"
                value={64}
                display="Ideal for Tomato"
                status={soil.ph.status}
                hint="Slightly acidic"
              />
              <GaugeBar
                label="Nitrogen (N)"
                value={soil.nitrogen.value}
                display={soil.nitrogen.label}
                status={soil.nitrogen.status}
              />
              <GaugeBar
                label="Phosphorus (P)"
                value={soil.phosphorus.value}
                display={soil.phosphorus.label}
                status={soil.phosphorus.status}
              />
              <GaugeBar
                label="Potassium (K)"
                value={soil.potassium.value}
                display={soil.potassium.label}
                status={soil.potassium.status}
                hint="Deficit: Add Potash"
              />
            </div>
          </SectionCard>
        </div>

        {/* Live OpenStreetMap Farm Location & Telemetry Card */}
        <LiveFarmMapCard />

        {/* Today's Farm Advice Feed */}
        <SectionCard title={t("todaysAdvice")} icon={Leaf} action={<ListenButton />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentAdvice.map((a) => {
              const Icon = adviceIcons[a.icon] ?? Leaf;
              return (
                <div
                  key={a.title}
                  className="rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-emerald-500/40 hover:shadow-xs"
                >
                  <p className="flex items-center gap-2 font-bold text-foreground">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    {a.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <AiNote>
              AI assessments combine visual leaf computer vision with live India Meteorological
              Department (IMD) forecasts and regional ICAR soil benchmarks. For critical pesticide
              applications, always cross-verify with your local Mandal Agriculture Officer (MAO).
            </AiNote>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

function InfoItem({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
      <dt className="text-[11px] font-semibold text-muted-foreground">{label}</dt>
      <dd
        className={`mt-0.5 text-sm font-bold truncate ${alert ? "text-rose-600 dark:text-rose-400" : "text-foreground"}`}
      >
        {value}
      </dd>
    </div>
  );
}
