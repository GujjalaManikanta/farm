import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Stethoscope,
  CloudSun,
  Droplets,
  Sprout,
  Bell,
  LineChart,
  Settings,
  Leaf,
  Camera,
  Home,
  User,
  MapPin,
  Globe,
  Sparkles,
  Mic,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLang, languages, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import { useLocation } from "@/lib/location-context";
import { LocationBannerPrompt } from "@/components/farm-map";
import { farm } from "@/lib/farm-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FloatingVoiceAssistant } from "@/components/voice-assistant";

export const nav = [
  { to: "/dashboard", key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crop-doctor", key: "cropDoctor", label: "Crop Doctor", icon: Stethoscope, badge: "AI" },
  {
    to: "/crop-growth",
    key: "cropGrowth",
    label: "Growth Tracker",
    icon: TrendingUp,
    badge: "Score",
  },
  {
    to: "/voice-assistant",
    key: "voiceAssistant",
    label: "Voice Assistant",
    icon: Mic,
    badge: "9 Lang",
  },
  { to: "/weather", key: "weather", label: "Weather", icon: CloudSun },
  { to: "/irrigation", key: "irrigation", label: "Irrigation", icon: Droplets },
  { to: "/soil", key: "soil", label: "Soil Health", icon: Sprout },
  { to: "/alerts", key: "alerts", label: "Alerts", icon: Bell, alertCount: 2 },
  { to: "/history", key: "history", label: "Farm History", icon: LineChart },
  { to: "/settings", key: "settings", label: "Settings", icon: Settings },
] as const;

export function AgriSmartSymbol({ className = "size-10" }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 p-1.5 text-white shadow-md ring-2 ring-emerald-500/30 overflow-hidden shrink-0",
        className,
      )}
    >
      <svg viewBox="0 0 48 48" fill="none" className="size-full">
        <defs>
          <linearGradient id="leafGradBrand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="goldGradBrand" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Central Sprout & Neural Stem */}
        <circle cx="24" cy="38" r="3" fill="url(#goldGradBrand)" />
        <path
          d="M24 38 L24 22"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 2.5"
        />

        {/* Left Sprout Petal */}
        <path d="M24 26 C16 26 11 19 11 11 C20 11 24 18 24 26 Z" fill="url(#leafGradBrand)" />

        {/* Right AI Bio-circuit Petal */}
        <path d="M24 22 C32 22 37 15 37 7 C28 7 24 14 24 22 Z" fill="url(#leafGradBrand)" />

        {/* Central Vitality Core */}
        <path d="M24 17 C26 13 24 6 24 4 C24 6 22 13 24 17 Z" fill="url(#goldGradBrand)" />

        {/* Smart Telemetry Nodes */}
        <circle cx="11" cy="11" r="2.5" fill="#38bdf8" />
        <circle cx="37" cy="7" r="2.5" fill="#34d399" />
        <circle cx="24" cy="4" r="2" fill="#fbbf24" />

        {/* Energy Pulse Arc */}
        <path
          d="M11 11 Q 24 0 37 7"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
          strokeDasharray="2 2"
        />
      </svg>
      {/* Active Pulse indicator */}
      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-amber-400 animate-pulse" />
    </div>
  );
}

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3 transition-opacity hover:opacity-90", className)}
    >
      <AgriSmartSymbol />
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg leading-none font-black tracking-tight text-foreground">
            AgriSmart
          </span>
          <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            AI
          </span>
        </div>
        <p className="text-[11px] font-medium text-muted-foreground">Smart Agriculture Advisory</p>
      </div>
    </Link>
  );
}

export function LanguageSelector() {
  const { lang, setLang, currentLangInfo } = useLang();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-1.5 text-xs font-bold text-foreground shadow-2xs backdrop-blur transition-all hover:bg-accent focus:outline-hidden">
        <Globe className="size-3.5 text-primary" />
        <span>
          {currentLangInfo.flag} {currentLangInfo.native}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl p-1.5 shadow-xl max-h-80 overflow-y-auto"
      >
        <div className="px-2 py-1.5 text-[11px] font-bold uppercase text-muted-foreground border-b border-border/50 mb-1">
          Select Language / భాష ఎంచుకోండి
        </div>
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
              lang === l.code ? "bg-primary/15 text-primary font-bold" : "hover:bg-muted",
            )}
          >
            <div className="flex items-center gap-2">
              <span>{l.flag}</span>
              <span>{l.native}</span>
              <span className="text-[11px] text-muted-foreground">({l.label})</span>
            </div>
            {lang === l.code && <span className="size-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer shadow-2xs",
        className,
      )}
      title={
        theme === "dark"
          ? "Switch to Light Mode / లైట్ మోడ్‌కి మార్చండి"
          : "Switch to Dark Mode / డార్క్ మోడ్‌కి మార్చండి"
      }
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="size-4 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const { formattedAddress, village, district, status, accuracy, requestLocation } = useLocation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Location Permission Banner */}
      <LocationBannerPrompt />

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/80 bg-card/90 backdrop-blur-md p-4 lg:flex z-30">
        <Brand className="mb-6 px-2 py-1" />

        {/* Farmer summary chip */}
        <div
          onClick={() => requestLocation()}
          className="mb-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3 cursor-pointer hover:bg-muted/70 transition-colors"
          title="Click to refresh live GPS location"
        >
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary/15 font-bold text-primary">
            {farm.farmerName[0]}
            {status === "granted" && (
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-foreground">{farm.farmerName}'s Farm</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {status === "granted" ? `${village}, ${district}` : farm.location}
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "size-5 transition-transform group-hover:scale-110",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  <span>{t(item.key)}</span>
                </div>
                {"badge" in item && item.badge ? (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase",
                      active ? "bg-white/20 text-white" : "bg-primary/15 text-primary",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
                {"alertCount" in item && item.alertCount ? (
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
                      active ? "bg-white text-primary" : "bg-rose-500 text-white",
                    )}
                  >
                    {item.alertCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Quick Scan Action button in Sidebar */}
        <Link
          to="/crop-doctor"
          className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-98"
        >
          <div className="flex items-center gap-2.5">
            <Camera className="size-4.5" />
            <span>{t("analyzeMyCrop")}</span>
          </div>
          <Sparkles className="size-4 text-emerald-200" />
        </Link>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Brand className="lg:hidden" />

          <button
            onClick={() => requestLocation()}
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs font-semibold text-muted-foreground lg:flex hover:bg-muted transition-colors cursor-pointer"
            title="Click to refresh Live GPS Location"
          >
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate max-w-[200px]">
              {status === "granted" ? `${village}, ${district}` : farm.location}
            </span>
            {status === "granted" && (
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300">
                GPS Live
              </span>
            )}
            <span className="text-border">•</span>
            <span className="text-foreground">
              {farm.crop} ({farm.field})
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSelector />
            <ThemeToggle />
            <Link
              to="/alerts"
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Alerts"
            >
              <Bell className="size-4.5" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
            </Link>
            <Link
              to="/settings"
              className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold transition-all hover:bg-primary hover:text-primary-foreground"
              aria-label={t("profile")}
            >
              <User className="size-4.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:py-8 pb-28 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Floating Multilingual Voice Assistant Button */}
      <FloatingVoiceAssistant />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-lg lg:hidden shadow-lg">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <BottomItem to="/" icon={Home} label={t("home")} active={pathname === "/"} />
          <BottomItem
            to="/dashboard"
            icon={LayoutDashboard}
            label={t("dashboard")}
            active={pathname === "/dashboard"}
          />

          {/* Floating Center Scan Button */}
          <Link to="/crop-doctor" className="flex flex-col items-center gap-0.5 -mt-6">
            <div className="flex size-14 items-center justify-center rounded-full border-4 border-background bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-lg transition-transform active:scale-95">
              <Camera className="size-6.5" />
            </div>
            <span className="text-[11px] font-extrabold text-primary">{t("scan")}</span>
          </Link>

          <BottomItem
            to="/voice-assistant"
            icon={Mic}
            label={t("voiceAssistant")}
            active={pathname === "/voice-assistant"}
          />
          <BottomItem
            to="/settings"
            icon={User}
            label={t("profile")}
            active={pathname === "/settings"}
          />
        </div>
      </nav>
    </div>
  );
}

function BottomItem({
  to,
  icon: Icon,
  label,
  active,
  badge,
}: {
  to: string;
  icon: typeof Home;
  label: string;
  active: boolean;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-semibold transition-colors",
        active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <div className="relative">
        <Icon className="size-5.5" />
        {badge && (
          <span className="absolute -top-1 -right-1.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
