import { cn } from "@/lib/utils";
import type { Status } from "@/lib/farm-data";
import { Volume2, VolumeX, type LucideIcon } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { playSpeech, stopAllAudio } from "@/lib/voice-service";

export const statusStyles: Record<Status, { dot: string; chip: string; text: string; bg: string }> =
  {
    good: {
      dot: "bg-emerald-500",
      chip: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    attention: {
      dot: "bg-amber-500",
      chip: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    risk: {
      dot: "bg-rose-500",
      chip: "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
  };

export function StatusPill({
  status,
  label,
  className,
}: {
  status: Status;
  label: string;
  className?: string;
}) {
  const s = statusStyles[status] ?? statusStyles.good;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm font-semibold tracking-wide shadow-xs transition-all",
        s.chip,
        className,
      )}
    >
      <span className={cn("size-2.5 rounded-full animate-pulse", s.dot)} />
      {label}
    </span>
  );
}

export function StatTile({
  icon: Icon,
  label,
  value,
  subtext,
  tone = "primary",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  tone?: "primary" | "sky" | "warning" | "destructive" | "soil" | "success";
  onClick?: () => void;
}) {
  const tones: Record<string, { bg: string; text: string; ring: string }> = {
    primary: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      ring: "hover:border-emerald-500/40",
    },
    sky: {
      bg: "bg-sky-500/10 dark:bg-sky-500/20",
      text: "text-sky-600 dark:text-sky-400",
      ring: "hover:border-sky-500/40",
    },
    warning: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      ring: "hover:border-amber-500/40",
    },
    destructive: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      ring: "hover:border-rose-500/40",
    },
    soil: {
      bg: "bg-amber-700/10 dark:bg-amber-600/20",
      text: "text-amber-800 dark:text-amber-300",
      ring: "hover:border-amber-700/40",
    },
    success: {
      bg: "bg-teal-500/10 dark:bg-teal-500/20",
      text: "text-teal-600 dark:text-teal-400",
      ring: "hover:border-teal-500/40",
    },
  };

  const currentTone = tones[tone] ?? tones.primary;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        currentTone.ring,
        onClick && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
          currentTone.bg,
          currentTone.text,
        )}
      >
        <Icon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-foreground">{value}</p>
        {subtext && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-shadow hover:shadow-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
        <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {Icon ? (
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </span>
          ) : null}
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function GaugeBar({
  label,
  value,
  display,
  status,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  status: Status;
  hint?: string;
}) {
  const s = statusStyles[status] ?? statusStyles.good;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold",
              s.chip,
            )}
          >
            {display}
          </span>
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
        <div
          className={cn("h-full rounded-full transition-all duration-500", s.dot)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function ListenButton({ text, className }: { text?: string; className?: string }) {
  const { lang, t, currentLangInfo } = useLang();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleSpeak = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    const speechText = text || t("weatherVoiceSummary");
    playSpeech(speechText, lang, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 active:scale-95",
        isPlaying && "bg-primary text-primary-foreground animate-pulse",
        className,
      )}
      title={`Listen in ${currentLangInfo.label}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="size-4" />
          <span>{t("stopAudio")}</span>
        </>
      ) : (
        <>
          <Volume2 className="size-4" />
          <span>{t("listen")}</span>
        </>
      )}
    </button>
  );
}

export function AiNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-border/80 bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
        ✦
      </span>
      <div>{children}</div>
    </div>
  );
}
