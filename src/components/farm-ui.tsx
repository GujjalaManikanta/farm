import { cn } from "@/lib/utils";
import type { Status } from "@/lib/farm-data";
import { Volume2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";

export const statusStyles: Record<Status, { dot: string; chip: string; text: string }> = {
  good: {
    dot: "bg-success",
    chip: "bg-success/12 text-success border-success/25",
    text: "text-success",
  },
  attention: {
    dot: "bg-warning",
    chip: "bg-warning/15 text-warning-foreground border-warning/40",
    text: "text-warning-foreground",
  },
  risk: {
    dot: "bg-destructive",
    chip: "bg-destructive/12 text-destructive border-destructive/25",
    text: "text-destructive",
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
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
        s.chip,
        className,
      )}
    >
      <span className={cn("size-2.5 rounded-full", s.dot)} />
      {label}
    </span>
  );
}

export function StatTile({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "primary" | "sky" | "warning" | "destructive" | "soil";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-sky/15 text-sky-foreground",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    soil: "bg-soil/15 text-soil-foreground",
  };
  return (
    <div className="card-soft flex items-center gap-3 p-4">
      <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-lg font-bold">{value}</p>
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
    <section className={cn("card-soft p-5 sm:p-6", className)}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          {Icon ? <Icon className="size-5 text-primary" /> : null}
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
}: {
  label: string;
  value: number;
  display: string;
  status: Status;
}) {
  const s = statusStyles[status];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className={cn("text-sm font-semibold", s.text)}>{display}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", s.dot)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ListenButton({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary",
        className,
      )}
    >
      <Volume2 className="size-4" /> 🔊 {t("listen")}
    </button>
  );
}

export function AiNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">{children}</p>
  );
}
