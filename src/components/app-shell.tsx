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
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLang, languages } from "@/lib/i18n";
import { farm } from "@/lib/farm-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { to: "/crop-doctor", key: "cropDoctor", icon: Stethoscope },
  { to: "/weather", key: "weather", icon: CloudSun },
  { to: "/irrigation", key: "irrigation", icon: Droplets },
  { to: "/soil", key: "soil", icon: Sprout },
  { to: "/alerts", key: "alerts", icon: Bell },
  { to: "/history", key: "history", icon: LineChart },
  { to: "/settings", key: "settings", icon: Settings },
] as const;

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-6" />
      </span>
      <span className="text-lg leading-tight font-extrabold tracking-tight">
        AgriSmart <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}

export function LanguageSelector() {
  const { lang, setLang } = useLang();
  const current = languages.find((l) => l.code === lang)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold">
        <Globe className="size-4 text-primary" />
        {current.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className="text-base">
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand className="mb-6 px-2 py-1" />
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="size-5" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/crop-doctor"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-bold text-accent-foreground"
        >
          <Camera className="size-5" /> {t("analyzeMyCrop")}
        </Link>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <Brand className="lg:hidden" />
          <div className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground lg:flex">
            <MapPin className="size-4 text-primary" /> {farm.location}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Link
              to="/settings"
              className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
              aria-label={t("profile")}
            >
              <User className="size-5" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pt-5 pb-28 sm:px-6 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <BottomItem to="/" icon={Home} label={t("home")} active={pathname === "/"} />
          <BottomItem
            to="/crop-doctor"
            icon={Stethoscope}
            label={t("cropDoctor")}
            active={pathname === "/crop-doctor"}
          />
          <Link to="/crop-doctor" className="flex flex-col items-center gap-1">
            <span className="-mt-7 flex size-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
              <Camera className="size-7" />
            </span>
            <span className="text-xs font-bold text-primary">{t("scan")}</span>
          </Link>
          <BottomItem to="/alerts" icon={Bell} label={t("alerts")} active={pathname === "/alerts"} />
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
}: {
  to: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg py-1 text-xs font-semibold",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-6" />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
