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
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, GaugeBar, ListenButton, SectionCard, StatTile, StatusPill } from "@/components/farm-ui";
import { advice, farm, soil, statusLabel, weather } from "@/lib/farm-data";
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">{t("greeting")}</h1>
          <p className="text-muted-foreground">{t("greetingSub")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatTile icon={MapPin} label="Location" value={farm.location} />
          <StatTile icon={Thermometer} label="Temperature" value={`${weather.temp}°C`} tone="warning" />
          <StatTile icon={Droplet} label="Humidity" value={`${weather.humidity}%`} tone="sky" />
          <StatTile icon={CloudRain} label="Rain chance" value={`${weather.rainProbability}%`} tone="sky" />
          <StatTile icon={Wind} label="Wind" value={`${weather.wind} km/h`} tone="sky" />
          <StatTile icon={Leaf} label="Crop health" value={statusLabel[farm.cropHealth]} tone="warning" />
        </div>

        <section className="card-soft bg-primary/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Camera className="size-6 text-primary" /> Analyze Crop
              </h2>
              <p className="mt-1 text-muted-foreground">
                Take or upload a photo of the affected leaf, fruit or plant.
              </p>
            </div>
            <Link
              to="/crop-doctor"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground"
            >
              <Camera className="size-6" /> Start Scan
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Camera, label: "📷 Take Photo" },
              { icon: Upload, label: "🖼 Upload Image" },
              { icon: ImageIcon, label: "Drag & drop image" },
            ].map((o) => (
              <Link
                key={o.label}
                to="/crop-doctor"
                className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-card px-4 py-4 font-semibold"
              >
                <o.icon className="size-5 text-primary" /> {o.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Crop Health"
            icon={Stethoscope}
            action={<StatusPill status={farm.cropHealth} label={statusLabel[farm.cropHealth]} />}
          >
            <dl className="grid grid-cols-2 gap-4">
              <Row label="Crop" value={farm.crop} />
              <Row label="Disease risk" value={farm.diseaseRisk} />
              <Row label="Possible disease" value={farm.disease} />
              <Row label="AI confidence" value={`${farm.confidence}%`} />
              <Row label="Last analyzed" value={farm.lastAnalyzed} />
              <Row label="Field" value={farm.field} />
            </dl>
          </SectionCard>

          <SectionCard title="Today's Weather" icon={CloudSun}>
            <div className="flex items-center gap-4">
              <p className="text-5xl font-extrabold">{weather.temp}°</p>
              <div>
                <p className="text-lg font-semibold">{weather.condition}</p>
                <p className="text-muted-foreground">Feels like {weather.feelsLike}°C</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Humidity" value={`${weather.humidity}%`} />
              <MiniStat label="Rain" value={`${weather.rainProbability}%`} />
              <MiniStat label="Wind" value={`${weather.wind} km/h`} />
            </div>
            <p className="mt-4 text-muted-foreground">{weather.summary}</p>
          </SectionCard>

          <SectionCard title="Irrigation Advice" icon={Droplets}>
            <div className="rounded-2xl bg-sky/15 p-5">
              <p className="text-2xl font-extrabold">🌧 Do not irrigate today.</p>
              <p className="mt-2 text-muted-foreground">
                Rain is expected within the next few hours and soil moisture is already sufficient.
              </p>
            </div>
            <Link to="/irrigation" className="mt-4 inline-block font-bold text-primary">
              See irrigation plan →
            </Link>
          </SectionCard>

          <SectionCard
            title="Soil Health"
            icon={Sprout}
            action={<StatusPill status="attention" label="Moderate" />}
          >
            <div className="space-y-4">
              <GaugeBar label="Moisture" value={soil.moisture.value} display={soil.moisture.label} status={soil.moisture.status} />
              <GaugeBar label="pH 6.4" value={64} display="Good" status={soil.ph.status} />
              <GaugeBar label="Nitrogen (N)" value={soil.nitrogen.value} display={soil.nitrogen.label} status={soil.nitrogen.status} />
              <GaugeBar label="Phosphorus (P)" value={soil.phosphorus.value} display={soil.phosphorus.label} status={soil.phosphorus.status} />
              <GaugeBar label="Potassium (K)" value={soil.potassium.value} display={soil.potassium.label} status={soil.potassium.status} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Estimated regional soil information</p>
          </SectionCard>
        </div>

        <SectionCard title="Today's Farm Advice" icon={Leaf} action={<ListenButton />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {advice.map((a) => {
              const Icon = adviceIcons[a.icon] ?? Leaf;
              return (
                <div key={a.title} className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 font-bold">
                    <Icon className="size-5 text-primary" /> {a.title}
                  </p>
                  <p className="mt-1 text-muted-foreground">{a.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <AiNote>
              AI-based assessment using your crop photo, local weather and regional soil data. Please
              confirm serious problems with your local agriculture officer.
            </AiNote>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
