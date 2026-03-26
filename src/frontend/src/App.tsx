import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  Activity,
  Bell,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { fetchMemeTables } from "./api";
import { FilterPanel } from "./components/FilterPanel";
import { TokenTable } from "./components/TokenTable";
import type {
  ActiveTab,
  FiltersDto,
  MemeTablePoolDto,
  TabFilters,
} from "./types";

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 2000, retry: 2 } },
});

/* ─── Mini decorative chart ─────────────────────────────────── */
function HeroChart() {
  const pts = [
    42, 55, 48, 61, 53, 70, 63, 80, 72, 88, 76, 95, 82, 100, 90, 110,
  ];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const W = 280;
  const H = 80;
  const pad = 8;

  const x = (i: number) => pad + (i / (pts.length - 1)) * (W - pad * 2);
  const y = (v: number) => pad + ((max - v) / (max - min || 1)) * (H - pad * 2);

  const pathD = pts
    .map(
      (v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`,
    )
    .join(" ");

  const areaD = `${pathD} L ${x(pts.length - 1).toFixed(1)} ${H} L ${x(0).toFixed(1)} ${H} Z`;

  const bars = pts.map((v, i) => ({
    xPos: x(i),
    yPos: H - 6 - (v / max) * 10,
    h: (v / max) * 10 + 6,
    up: v > pts[i - 1 >= 0 ? i - 1 : 0],
  }));

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
      role="img"
      aria-label="Price and volume chart"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2AD6A3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2AD6A3" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke="#2AD6A3"
        strokeWidth="2"
        filter="url(#glow)"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {bars.map((bar) => (
        <rect
          key={`bar-${bar.xPos.toFixed(1)}`}
          x={bar.xPos - 3}
          y={bar.yPos}
          width={5}
          height={bar.h}
          fill={bar.up ? "#25E28A" : "#D9535F"}
          opacity={0.5}
          rx={1}
        />
      ))}
    </svg>
  );
}

/* ─── Main app inner ─────────────────────────────────────────── */
function AppInner() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("new");
  const [tabFilters, setTabFilters] = useState<TabFilters>({
    newPools: {},
    completing: {},
    graduated: {},
  });
  const [appliedFilters, setAppliedFilters] = useState<TabFilters>({
    newPools: {},
    completing: {},
    graduated: {},
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const filterKey = {
    new: "newPools",
    completing: "completing",
    graduated: "graduated",
  } as const;

  const currentFilterKey = filterKey[activeTab];

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["meme", activeTab, appliedFilters[currentFilterKey]],
    queryFn: async () => {
      const result = await fetchMemeTables({
        type: activeTab,
        [currentFilterKey]: appliedFilters[currentFilterKey],
      });
      setLastUpdated(new Date());
      return result;
    },
    refetchInterval: 10000,
  });

  const tokens: MemeTablePoolDto[] = data?.[activeTab] ?? [];

  const handleFilterApply = useCallback(
    (filters: FiltersDto) => {
      setTabFilters((prev) => ({ ...prev, [currentFilterKey]: filters }));
      setAppliedFilters((prev) => ({ ...prev, [currentFilterKey]: filters }));
    },
    [currentFilterKey],
  );

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "new", label: "New Pairs" },
    { id: "completing", label: "Completing" },
    { id: "graduated", label: "Graduated" },
  ];

  return (
    <div className="min-h-screen grid-bg top-glow relative">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border glass-card rounded-none px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-4" data-ocid="nav.link">
            <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight">
              Meme<span className="text-accent">Tracker</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {["Dashboard", "Analytics", "Alerts", "About"].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  item === "Dashboard"
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                data-ocid={`nav.${item.toLowerCase()}.link`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search tokens..."
              className="hidden lg:block h-7 px-3 rounded-md bg-input border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent w-40"
              data-ocid="header.search_input"
            />
            <button
              type="button"
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              data-ocid="header.bell_button"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-secondary/50">
              <div className="w-5 h-5 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">MT</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Trader
              </span>
            </div>
            <Button
              size="sm"
              className="h-7 px-3 text-xs bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
              data-ocid="header.wallet_button"
            >
              <Wallet className="w-3 h-3 mr-1.5" />
              Wallet Connect
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-5">
        {/* ── HERO PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-card rounded-xl p-6 flex flex-col lg:flex-row gap-6 items-center"
          data-ocid="hero.panel"
        >
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Live
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
              Real-Time Meme Token
              <br />
              <span className="text-accent">Screener</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Live Activity: Tracking new, completing &amp; graduated pools
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" /> New Pairs
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                <ChevronRight className="w-3 h-3 mr-1" /> Completing
              </Badge>
              <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/30 text-xs">
                <Zap className="w-3 h-3 mr-1" /> Graduated
              </Badge>
            </div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="glass-card rounded-lg p-3 border-border">
              <div className="flex items-center justify-between gap-8 mb-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Price / Volume
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
              <HeroChart />
            </div>
          </div>
        </motion.div>

        {/* ── TAB STRIP ── */}
        <div
          className="glass-card rounded-xl px-1 py-1 flex items-center gap-1"
          data-ocid="tabs.panel"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "text-accent bg-accent/10 shadow-glow tab-active-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              data-ocid={`tabs.${tab.id}.tab`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              )}
            </button>
          ))}

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-1.5"
            data-ocid="tabs.refresh_button"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="text-xs hidden sm:block">Refresh</span>
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex gap-4 items-start"
        >
          {/* Filter sidebar */}
          <div className="w-56 lg:w-64 shrink-0 self-stretch">
            <FilterPanel
              filters={tabFilters[currentFilterKey]}
              onApply={handleFilterApply}
            />
          </div>

          {/* Token table */}
          <div className="flex-1 min-w-0">
            <TokenTable
              tokens={tokens}
              isLoading={isFetching && tokens.length === 0}
              isError={isError}
              onRetry={refetch}
            />
          </div>
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border mt-12 px-6 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MemeTracker. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>API: api2.yodao.io</span>
            <span>Rate limit: 120 req/min</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppInner />
    </QueryClientProvider>
  );
}
