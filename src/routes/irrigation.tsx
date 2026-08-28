import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Droplets,
  CloudRain,
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingDown,
  Power,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, GaugeBar, ListenButton, SectionCard, StatTile } from "@/components/farm-ui";
import { farm, irrigationHistory, irrigationSchedule, soil } from "@/lib/farm-data";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/irrigation")({
  head: () => ({
    meta: [
      { title: "Smart Irrigation Advisory | AgriSmart AI" },
      {
        name: "description",
        content: "Precision soil moisture monitoring and intelligent irrigation scheduling.",
      },
    ],
  }),
  component: IrrigationPage,
});

function IrrigationPage() {
  const { lang, t } = useLang();
  const [isPumpActive, setIsPumpActive] = useState(false);

  const togglePump = () => {
    setIsPumpActive(!isPumpActive);
    if (!isPumpActive) {
      toast.warning("Drip irrigation pump manually activated for Field A.");
    } else {
      toast.success("Drip irrigation pump turned off.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
              <Droplets className="size-3.5" />
              <span>Automated Drip & Moisture Advisory</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t("irrigationAdvice")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Water only when your crop needs it. Save power, prevent root rot, and conserve water.
            </p>
          </div>

          <ListenButton text={t("irrigationVoiceSummary")} />
        </div>

        {/* Primary Recommendation Banner */}
        <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/15 via-card to-sky-500/5 p-6 shadow-xs">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-700 dark:text-sky-300">
                <CloudRain className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t("doNotIrrigate")}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm max-w-2xl">
                  {t("doNotIrrigateSub")}
                </p>
              </div>
            </div>

            <button
              onClick={togglePump}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all ${
                isPumpActive
                  ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <Power className="size-4" />
              <span>{isPumpActive ? "Stop Drip Pump" : "Manual Pump Start"}</span>
            </button>
          </div>
        </div>

        {/* Moisture & Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            icon={Droplets}
            label={t("soilMoisture")}
            value={`${soil.moisture.value}%`}
            subtext="Optimal range (55-70%)"
            tone="primary"
          />
          <StatTile
            icon={Timer}
            label={t("nextWatering")}
            value="Mon 6:00 AM"
            subtext="If no further rain"
            tone="sky"
          />
          <StatTile
            icon={TrendingDown}
            label={t("waterSaved")}
            value="3,400 L"
            subtext="This week (32%)"
            tone="success"
          />
          <StatTile
            icon={CheckCircle2}
            label="Root Health"
            value="Optimal"
            subtext="No waterlogging"
            tone="success"
          />
        </div>

        {/* Weekly Schedule */}
        <SectionCard title="7-Day Irrigation Schedule" icon={Timer}>
          <div className="grid gap-3 sm:grid-cols-7">
            {irrigationSchedule.map((s) => (
              <div
                key={s.day}
                className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition-all ${
                  s.action === "Skip"
                    ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : s.action === "Irrigate"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                <span className="text-xs font-bold uppercase">{s.day}</span>
                <span className="my-2 text-sm font-black">{s.action}</span>
                <span className="text-[10px] leading-tight text-muted-foreground">{s.reason}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <AiNote>
              Irrigation recommendations adjust dynamically based on soil sensor readings and
              real-time precipitation forecasts.
            </AiNote>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
