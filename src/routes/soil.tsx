import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sprout,
  FlaskConical,
  Sparkles,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calculator,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, GaugeBar, ListenButton, SectionCard, StatTile } from "@/components/farm-ui";
import { farm, soil } from "@/lib/farm-data";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/soil")({
  head: () => ({
    meta: [
      { title: "Soil Health & Nutrients Card | AgriSmart AI" },
      {
        name: "description",
        content: "NPK nutrient balance, soil pH diagnostics, and customized fertilizer calculator.",
      },
    ],
  }),
  component: SoilPage,
});

function SoilPage() {
  const { lang, t } = useLang();
  const [farmAcres, setFarmAcres] = useState<number>(2.5);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-600/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Sprout className="size-3.5" />
              <span>ICAR Soil Benchmark • {farm.location}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t("soilHealth")} & Diagnostics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor primary macronutrients (N-P-K), organic carbon, pH level, and calculate
              precise fertilizer bags.
            </p>
          </div>

          <ListenButton text={t("soilVoiceSummary")} />
        </div>

        {/* Overview Status Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            icon={Scale}
            label="Soil pH Level"
            value="6.4 pH"
            subtext="Slightly Acidic (Good)"
            tone="success"
          />
          <StatTile
            icon={FlaskConical}
            label="Nitrogen (N)"
            value={`${soil.nitrogen.value}%`}
            subtext="Moderate level"
            tone="warning"
          />
          <StatTile
            icon={Leaf}
            label="Phosphorus (P)"
            value={`${soil.phosphorus.value}%`}
            subtext="Sufficient"
            tone="success"
          />
          <StatTile
            icon={AlertTriangle}
            label="Potassium (K)"
            value={`${soil.potassium.value}%`}
            subtext="Deficit - Add Potash"
            tone="destructive"
          />
        </div>

        {/* Detailed Gauges */}
        <SectionCard title="Nutrient Gauges & Ratings" icon={FlaskConical}>
          <div className="space-y-4">
            <GaugeBar
              label="Potassium (K)"
              value={soil.potassium.value}
              display="Deficit (30%)"
              status="risk"
              hint="Target: 60-80%"
            />
            <GaugeBar
              label="Nitrogen (N)"
              value={soil.nitrogen.value}
              display="Moderate (45%)"
              status="attention"
              hint="Target: 50-70%"
            />
            <GaugeBar
              label="Phosphorus (P)"
              value={soil.phosphorus.value}
              display="Good (72%)"
              status="good"
              hint="Target: 60-80%"
            />
            <GaugeBar
              label="Organic Carbon"
              value={soil.organic.value}
              display="Moderate (55%)"
              status="attention"
            />
          </div>
        </SectionCard>

        {/* Fertilizer Recommendation Calculator */}
        <SectionCard title="Fertilizer Recommendation Calculator" icon={Calculator}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">
                Field Size (Acres):
              </label>
              <input
                type="number"
                step="0.5"
                value={farmAcres}
                onChange={(e) => setFarmAcres(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="w-24 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-sm font-bold text-foreground"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Potash (MOP) Needed
                </p>
                <p className="mt-1 text-2xl font-black text-rose-600">
                  {Math.round(farmAcres * 25)} kg
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  ~{Math.ceil((farmAcres * 25) / 50)} bag(s) of Muriate of Potash
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Urea Needed</p>
                <p className="mt-1 text-2xl font-black text-amber-600">
                  {Math.round(farmAcres * 15)} kg
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  ~{Math.ceil((farmAcres * 15) / 45)} bag(s) of Neem Coated Urea
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  DAP (Phosphorus)
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">0 kg</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Soil P levels are adequate. No DAP required.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
