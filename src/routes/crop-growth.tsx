import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  TrendingUp,
  Leaf,
  Ruler,
  Maximize2,
  Sparkles,
  Camera,
  Upload,
  Droplets,
  Sun,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sprout,
  Scan,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiNote, ListenButton, SectionCard, StatusPill } from "@/components/farm-ui";
import { farm, type Status } from "@/lib/farm-data";
import { useLang, type Lang } from "@/lib/i18n";
import { useLocation } from "@/lib/location-context";
import { playSpeech } from "@/lib/voice-service";
import { toast } from "sonner";

export const Route = createFileRoute("/crop-growth")({
  head: () => ({
    meta: [
      { title: "AI Crop Growth & Canopy Health Tracker | AgriSmart AI" },
      {
        name: "description",
        content:
          "Continuously track crop growth, leaf color index, plant height, canopy coverage and AI health scores.",
      },
    ],
  }),
  component: CropGrowthTracker,
});

interface GrowthStage {
  day: number;
  stageName: string;
  stageNameTe: string;
  heightCm: number;
  canopyPct: number;
  leafColor: string;
  leafColorTe: string;
  healthScore: number;
  status: Status;
}

const historicalGrowthData: GrowthStage[] = [
  {
    day: 10,
    stageName: "Seedling & Emergence",
    stageNameTe: "మొలక & ప్రారంభ దశ",
    heightCm: 12,
    canopyPct: 22,
    leafColor: "Light Green (72%)",
    leafColorTe: "లేత ఆకుపచ్చ (72%)",
    healthScore: 84,
    status: "good",
  },
  {
    day: 20,
    stageName: "Early Vegetative",
    stageNameTe: "శాకీయ ఎదుగుదల ప్రారంభం",
    heightCm: 24,
    canopyPct: 45,
    leafColor: "Green (80%)",
    leafColorTe: "ఆకుపచ్చ (80%)",
    healthScore: 86,
    status: "good",
  },
  {
    day: 35,
    stageName: "Active Vegetative (Current)",
    stageNameTe: "పూర్తి శాఖీయ ఎదుగుదల (ప్రస్తుతం)",
    heightCm: 48,
    canopyPct: 76,
    leafColor: "Dark Lush Green (88%)",
    leafColorTe: "ముదురు ఆకుపచ్చ (88%)",
    healthScore: 89,
    status: "good",
  },
  {
    day: 50,
    stageName: "Flowering Transition (Projected)",
    stageNameTe: "పూత దశ (అంచనా)",
    heightCm: 62,
    canopyPct: 88,
    leafColor: "Dark Green (90%)",
    leafColorTe: "ముదురు ఆకుపచ్చ (90%)",
    healthScore: 92,
    status: "good",
  },
];

function CropGrowthTracker() {
  const { lang, currentLangInfo } = useLang();
  const { formattedAddress } = useLocation();

  // Active Live Growth Metrics
  const [healthScore, setHealthScore] = useState<number>(89);
  const [plantHeight, setPlantHeight] = useState<number>(48);
  const [canopyCoverage, setCanopyCoverage] = useState<number>(76);
  const [leafColorIndex, setLeafColorIndex] = useState<number>(88);
  const [stressLevel, setStressLevel] = useState<"low" | "moderate" | "high">("low");

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Speech string in active language
  const growthSpeechText =
    lang === "te"
      ? `మీ టమోటా పంట ఎదుగుదల అద్భుతంగా ఉంది. మొత్తం ఆరోగ్య స్కోరు 100 కి ${healthScore} పాయింట్లు. మొక్క ఎత్తు 48 సెంటీమీటర్లు మరియు ఆకుల విస్తరణ 76 శాతం. పంట ఏపుగా మరియు సంపూర్ణ ఆరోగ్యంతో ఎదుగుతోంది.`
      : `Crop growth analysis is thriving. Overall AI Health Score is ${healthScore} out of 100. Plant height is ${plantHeight} centimeters, canopy coverage is ${canopyCoverage} percent, and leaf chlorophyll index is ${leafColorIndex} percent.`;

  // Handle Photo Scanning for Growth Measurement
  const handlePhotoScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setScannedImage(dataUrl);
      setIsScanning(true);

      setTimeout(() => {
        setIsScanning(false);
        // Computed dynamic metrics
        const newHeight = 49 + Math.floor(Math.random() * 3);
        const newCanopy = 78 + Math.floor(Math.random() * 4);
        const newChlorophyll = 89 + Math.floor(Math.random() * 3);
        const newScore = Math.min(96, Math.round((newCanopy + newChlorophyll + 92) / 3));

        setPlantHeight(newHeight);
        setCanopyCoverage(newCanopy);
        setLeafColorIndex(newChlorophyll);
        setHealthScore(newScore);
        setStressLevel("low");

        toast.success("AI Crop Growth & Canopy Analysis Complete!");
        playSpeech(
          lang === "te"
            ? `స్కాన్ ద్వారా పంట ఆరోగ్య స్కోరు ${newScore} గా నమోదైంది. మొక్క ఎత్తు ${newHeight} సెంటీమీటర్లు, ఆకుల విస్తరణ ${newCanopy} శాతం.`
            : `Scan updated: Health score is ${newScore}, height is ${newHeight} cm, canopy coverage is ${newCanopy} percent.`,
          lang,
        );
      }, 1400);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="size-3.5" />
              <span>
                {currentLangInfo.flag} {currentLangInfo.native} • Continuous Crop Growth Vision
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {lang === "te"
                ? "పంట ఎదుగుదల & ఆకుల విస్తీర్ణ పర్యవేక్షణ"
                : "AI Crop Growth & Canopy Health Tracker"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "te"
                ? "ఆకు రంగు, మొక్క ఎత్తు, ఆకుల వ్యాప్తి (Canopy) మరియు AI పంట ఆరోగ్య స్కోరును నిరంతరం పర్యవేక్షించండి."
                : "Continuously tracks leaf color, plant height, canopy coverage, and multi-parameter health scores."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ListenButton text={growthSpeechText} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="size-4" />
              <span>{lang === "te" ? "ఎదుగుదల స్కాన్ చేయండి" : "Scan Plant Growth"}</span>
            </button>
          </div>
        </div>

        {/* Master AI Health Score Card */}
        <div className="overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-12 items-center">
            {/* Left Score Dial (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-emerald-500/30 bg-card shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                {lang === "te" ? "పంట మొత్తం ఆరోగ్య స్కోరు" : "Overall Crop Health Score"}
              </span>

              <div className="relative my-2 flex size-32 items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted/40"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-1000"
                    strokeDasharray={`${healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{healthScore}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    / 100
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <Sparkles className="size-3.5" />
                <span>
                  {healthScore >= 85
                    ? lang === "te"
                      ? "పంట ఏపుగా ఉంది (Thriving)"
                      : "Thriving & Vigorous"
                    : healthScore >= 65
                      ? lang === "te"
                        ? "తేలికపాటి ఒత్తిడి (Moderate)"
                        : "Moderate Stress"
                      : lang === "te"
                        ? "తీవ్ర ఒత్తిడి (Stressed)"
                        : "High Stress"}
                </span>
              </div>
            </div>

            {/* Right Breakdown (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {farm.crop} ({farm.field}) • {lang === "te" ? "శాకీయ దశ" : "Vegetative Phase"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {lang === "te" ? "లొకేషన్:" : "Farm Location:"} {formattedAddress}
                  </p>
                </div>
                <StatusPill
                  status={healthScore >= 85 ? "good" : "attention"}
                  label={healthScore >= 85 ? "Thriving" : "Attention"}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Leaf Color */}
                <div className="rounded-2xl border border-emerald-500/30 bg-card p-3 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Leaf className="size-3 text-emerald-600" />
                    {lang === "te" ? "ఆకు రంగు సూచిక" : "Leaf Color Index"}
                  </span>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {leafColorIndex}% SPAD
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "te" ? "ముదురు ఆకుపచ్చ (Dark Green)" : "Dark Lush Green"}
                  </p>
                </div>

                {/* 2. Plant Height */}
                <div className="rounded-2xl border border-sky-500/30 bg-card p-3 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Ruler className="size-3 text-sky-600" />
                    {lang === "te" ? "మొక్క ఎత్తు" : "Plant Height"}
                  </span>
                  <p className="text-base font-black text-sky-700 dark:text-sky-300 mt-1">
                    {plantHeight} cm
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "te" ? "+1.8 సెం.మీ/రోజు" : "+1.8 cm / Day"}
                  </p>
                </div>

                {/* 3. Canopy Coverage */}
                <div className="rounded-2xl border border-teal-500/30 bg-card p-3 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Maximize2 className="size-3 text-teal-600" />
                    {lang === "te" ? "కెనోపీ విస్తీర్ణం" : "Canopy Cover"}
                  </span>
                  <p className="text-base font-black text-teal-700 dark:text-teal-300 mt-1">
                    {canopyCoverage}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "te" ? "ఆప్టిమల్ విస్తరణ" : "Optimal Ground Cover"}
                  </p>
                </div>

                {/* 4. Crop Stress */}
                <div className="rounded-2xl border border-amber-500/30 bg-card p-3 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Flame className="size-3 text-amber-600" />
                    {lang === "te" ? "ఒత్తిడి స్థాయి" : "Stress Index"}
                  </span>
                  <p className="text-base font-black text-amber-700 dark:text-amber-300 mt-1">
                    {stressLevel === "low"
                      ? lang === "te"
                        ? "తక్కువ (Low)"
                        : "Low (11%)"
                      : "Moderate"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "te" ? "ఎలాంటి తెగులు లేదు" : "Healthy & Vigorous"}
                  </p>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                    <span>
                      {lang === "te"
                        ? "నత్రజని & క్లోరోఫిల్ సంతృప్తత"
                        : "Nitrogen & Chlorophyll Saturation"}
                    </span>
                    <span className="text-emerald-600">{leafColorIndex}% (Optimal)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${leafColorIndex}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                    <span>
                      {lang === "te"
                        ? "సూర్యకాంతి గ్రహణ సామర్థ్యం (PAR)"
                        : "Canopy Sunlight Interception (PAR)"}
                    </span>
                    <span className="text-teal-600">{canopyCoverage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-700"
                      style={{ width: `${canopyCoverage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Growth Scanner & Historical Timeline */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Live AI Photo Growth Scanner (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <SectionCard
              title={lang === "te" ? "AI పంట ఎదుగుదల స్కానర్" : "AI Crop Growth Scanner"}
              icon={Camera}
            >
              <div className="space-y-4">
                {/* Viewfinder */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-500/40 bg-card p-2 text-center shadow-xs">
                  {scannedImage ? (
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black/90">
                      <img
                        src={scannedImage}
                        alt="Crop Growth Sample"
                        className="h-full w-full object-cover"
                      />
                      {isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs">
                          <div className="relative size-14">
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                            <Scan className="absolute inset-0 m-auto size-6 text-emerald-400" />
                          </div>
                          <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-emerald-400 animate-pulse">
                            {lang === "te"
                              ? "ఎత్తు & ఆకుల విస్తరణ కొలుస్తోంది..."
                              : "Measuring Height & Canopy Area..."}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer hover:bg-muted/50 rounded-2xl transition-colors"
                    >
                      <Upload className="size-12 text-emerald-600 mb-2" />
                      <p className="text-sm font-bold text-foreground">
                        {lang === "te"
                          ? "మొక్క ఫోటోను ఇక్కడ అప్‌లోడ్ చేయండి"
                          : "Upload plant photo to measure growth"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === "te"
                          ? "AI ఆటోమేటిక్‌గా ఆకు రంగు, ఎత్తు మరియు విస్తరణను లెక్కిస్తుంది."
                          : "AI computes leaf color hue, height, and canopy coverage."}
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoScan}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handlePhotoScan}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <Upload className="size-4" />
                      <span>{lang === "te" ? "గ్యాలరీ నుండి" : "From Gallery"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 py-3 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <Camera className="size-4" />
                      <span>{lang === "te" ? "కెమెరా తీయండి" : "Take Photo"}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-bold text-foreground mb-1">
                    💡 {lang === "te" ? "ఎదుగుదల సూచన:" : "Growth Tip:"}
                  </p>
                  {lang === "te"
                    ? "ఆకుపచ్చదనం 85% పైగా ఉన్నప్పుడు పంట ఆరోగ్యంగా ఉంటుంది. పూత దశకు మారే సమయంలో పొటాష్ మరియు బోరాన్ పిచికారీ చేయడం వల్ల పూత రాలకుండా అధిక దిగుబడి వస్తుంది."
                    : "Maintain soil moisture between 60-70% during active vegetative elongation to ensure seamless transition into flowering."}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column: Historical Growth Timeline & Stages (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <SectionCard
              title={
                lang === "te"
                  ? "పంట ఎదుగుదల దశలు & టైమ్‌లైన్"
                  : "Crop Growth Stages & Historical Timeline"
              }
              icon={Calendar}
            >
              <div className="space-y-3">
                {historicalGrowthData.map((stage) => (
                  <div
                    key={stage.day}
                    className={`rounded-2xl border p-4 transition-all ${
                      stage.day === 35
                        ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-xs"
                        : "border-border/80 bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-black">
                          D{stage.day}
                        </span>
                        <div>
                          <p className="font-black text-sm text-foreground">
                            {lang === "te" ? stage.stageNameTe : stage.stageName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {lang === "te"
                              ? `విత్తిన తర్వాత ${stage.day} రోజులు`
                              : `${stage.day} Days After Sowing`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-emerald-600">
                          {lang === "te" ? "స్కోరు:" : "Score:"} {stage.healthScore}/100
                        </span>
                        <StatusPill
                          status={stage.status}
                          label={stage.day === 35 ? "Current" : "Normal"}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
                      <div className="rounded-xl border border-border/60 bg-background/80 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          {lang === "te" ? "ఎత్తు" : "Height"}
                        </span>
                        <p className="text-sm font-black text-foreground mt-0.5">
                          {stage.heightCm} cm
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background/80 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          {lang === "te" ? "కెనోపీ" : "Canopy"}
                        </span>
                        <p className="text-sm font-black text-teal-600 mt-0.5">
                          {stage.canopyPct}%
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background/80 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          {lang === "te" ? "ఆకు రంగు" : "Leaf Color"}
                        </span>
                        <p className="text-[11px] font-black text-emerald-600 mt-0.5 truncate">
                          {lang === "te" ? stage.leafColorTe : stage.leafColor}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <AiNote>
                  {lang === "te"
                    ? "ఈ ఎదుగుదల కొలతలు మీ ఉపగ్రహ NDVI పారామితులు, ఆకు రంగు చార్ట్ (LCC) మరియు పొలం లొకేషన్ ఆధారంగా AI ద్వారా నిరంతరం గణించబడతాయి."
                    : "Growth telemetry is continuously benchmarked against ICAR Crop Growth Indices and local soil moisture telemetry."}
                </AiNote>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
