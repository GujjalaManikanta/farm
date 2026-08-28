import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  CloudSun,
  Droplets,
  Sprout,
  Bug,
  BarChart3,
  Camera,
  ArrowRight,
  ScanLine,
  MapPin,
  BrainCircuit,
} from "lucide-react";
import heroImg from "@/assets/hero-agri.jpg";
import { Brand, LanguageSelector } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSmart AI – Crop Disease Detection & Farm Advisory" },
      {
        name: "description",
        content:
          "Scan a crop photo and get AI disease detection, weather, soil and irrigation advice built for farmers.",
      },
      { property: "og:title", content: "AgriSmart AI – Smart Agriculture Advisory" },
      {
        property: "og:description",
        content:
          "AI crop disease detection, weather advisory, smart irrigation and soil health in one simple app.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Leaf, emoji: "🌿", title: "AI Crop Disease Detection", text: "Photo in, clear answer out." },
  { icon: CloudSun, emoji: "🌦", title: "Weather Advisory", text: "Local rain, heat and wind alerts." },
  { icon: Droplets, emoji: "💧", title: "Smart Irrigation", text: "Water only when it is needed." },
  { icon: Sprout, emoji: "🌱", title: "Soil Health", text: "Moisture, pH and nutrients made simple." },
  { icon: Bug, emoji: "🐛", title: "Pest & Disease Alerts", text: "Early warnings for your area." },
  { icon: BarChart3, emoji: "📊", title: "Farm History", text: "Every scan and advice, saved." },
];

const steps = [
  { icon: Camera, title: "Upload crop photo" },
  { icon: MapPin, title: "Allow location" },
  { icon: BrainCircuit, title: "AI analysis" },
  { icon: CloudSun, title: "Weather & soil data" },
  { icon: ScanLine, title: "Simple farm advice" },
];

function Landing() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <Link to="/" className="text-primary">
              {t("home")}
            </Link>
            <Link to="/dashboard">{t("dashboard")}</Link>
            <Link to="/crop-doctor">{t("cropDoctor")}</Link>
            <Link to="/weather">{t("weather")}</Link>
            <Link to="/soil">{t("soil")}</Link>
            <Link to="/history">{t("history")}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <section className="gradient-field">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-4 py-1.5 text-sm font-semibold text-primary">
              <Leaf className="size-4" /> Smart Agriculture Assistant
            </span>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("heroSub")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/crop-doctor"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-lg font-bold text-primary-foreground shadow-[var(--shadow-lift)]"
              >
                <Camera className="size-6" /> {t("analyzeMyCrop")}
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-card px-7 py-4 text-lg font-bold text-primary"
              >
                {t("openDashboard")} <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
          <img
            src={heroImg}
            alt="Farmer scanning a tomato plant leaf with a smartphone in a green field"
            width={1280}
            height={960}
            className="w-full rounded-3xl border border-border shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Everything your farm needs</h2>
        <p className="mt-2 text-muted-foreground">Simple tools, made for the field.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-soft p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                {f.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.title} className="card-soft flex items-center gap-3 p-4">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-bold text-primary">Step {i + 1}</p>
                  <p className="font-semibold">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/crop-doctor"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground"
            >
              <Camera className="size-6" /> {t("analyzeMyCrop")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground sm:px-6">
          <Brand />
          <p>AI results are an assessment, not a guaranteed diagnosis. Confirm with your local agri officer.</p>
        </div>
      </footer>
    </div>
  );
}
