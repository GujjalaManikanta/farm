import { createFileRoute } from "@tanstack/react-router";
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplet,
  Sun,
  Thermometer,
  ShieldAlert,
  Calendar,
  Sparkles,
  Compass,
  Eye,
  Umbrella,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, ListenButton, SectionCard, StatTile } from "@/components/farm-ui";
import { farm, forecast, weather } from "@/lib/farm-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Hyperlocal Farm Weather | AgriSmart AI" },
      {
        name: "description",
        content: "Live farm microclimate forecasts, rain probability, and spraying advisory.",
      },
    ],
  }),
  component: WeatherPage,
});

const hourlyData = [
  { time: "Now", temp: 32, pop: 75, icon: "🌧", desc: "Showers" },
  { time: "2 PM", temp: 33, pop: 80, icon: "🌧", desc: "Moderate Rain" },
  { time: "4 PM", temp: 31, pop: 65, icon: "🌦", desc: "Light Rain" },
  { time: "6 PM", temp: 29, pop: 40, icon: "⛅", desc: "Cloudy" },
  { time: "8 PM", temp: 28, pop: 20, icon: "☁️", desc: "Overcast" },
  { time: "10 PM", temp: 27, pop: 10, icon: "🌙", desc: "Clear Night" },
  { time: "6 AM", temp: 25, pop: 5, icon: "🌤", desc: "Sunny Morning" },
  { time: "8 AM", temp: 28, pop: 10, icon: "☀️", desc: "Clear" },
];

function WeatherPage() {
  const { lang, t } = useLang();

  const sprayingText =
    lang === "te"
      ? "ఈ రోజు మధ్యాహ్నం 12 మిమీ వర్షం రానుంది. పురుగుమందులు లేదా శిలీంద్ర సంహారిణి పిచికారీని పూర్తిగా వాయిదా వేయండి."
      : lang === "hi"
        ? "आज दोपहर 12 मिमी बारिश का अनुमान है। कीटनाशक छिड़काव रोक दें।"
        : "Postpone all chemical spraying today due to incoming 12 mm rainfall. Spraying before rain washes away chemicals.";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
              <CloudSun className="size-3.5" />
              <span>
                {t("location")}: {farm.location}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t("todaysWeather")} & {t("sprayingWindow")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("weatherVoiceSummary")}</p>
          </div>

          <ListenButton text={t("weatherVoiceSummary")} />
        </div>

        {/* Primary Tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            icon={Thermometer}
            label={t("temperature")}
            value={`${weather.temp}°C`}
            subtext={`Feels ${weather.feelsLike}°C`}
            tone="warning"
          />
          <StatTile
            icon={CloudRain}
            label={t("rainChance")}
            value={`${weather.rainProbability}%`}
            subtext="12 mm expected"
            tone="sky"
          />
          <StatTile
            icon={Droplet}
            label={t("humidity")}
            value={`${weather.humidity}%`}
            subtext="High moisture"
            tone="sky"
          />
          <StatTile
            icon={Wind}
            label={t("windSpeed")}
            value={`${weather.wind} km/h`}
            subtext="South-East"
            tone="sky"
          />
        </div>

        {/* Spraying Advisory Callout */}
        <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/15 via-card to-sky-500/5 p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-700 dark:text-sky-300">
              <ShieldAlert className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {t("sprayingWindow")} Status: <span className="text-rose-600">UNFAVORABLE</span>
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {sprayingText}
              </p>
            </div>
          </div>
        </div>

        {/* 7 Day Forecast */}
        <SectionCard title={t("forecast7Days")} icon={Calendar}>
          <div className="grid gap-3 sm:grid-cols-7">
            {forecast.map((f) => (
              <div
                key={f.day}
                className="flex flex-col items-center rounded-2xl border border-border/70 bg-card p-3 text-center transition-all hover:border-sky-500/40"
              >
                <p className="text-xs font-bold text-muted-foreground">{f.day}</p>
                <span className="my-2 text-3xl">
                  {f.icon === "rain" ? "🌧" : f.icon === "cloud" ? "⛅" : "☀️"}
                </span>
                <p className="text-sm font-bold text-foreground">{f.high}°C</p>
                <p className="text-[11px] text-muted-foreground">{f.low}°C</p>
                <span className="mt-2 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-600">
                  {f.rain}% rain
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <AiNote>
              Weather data is synthesized from live IMD Mandal radar stations and updated every 30
              minutes.
            </AiNote>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
