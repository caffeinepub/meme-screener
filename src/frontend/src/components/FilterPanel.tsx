import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import type { FiltersDto, SocialsFilter } from "../types";

interface FilterPanelProps {
  filters: FiltersDto;
  onApply: (filters: FiltersDto) => void;
}

type RangeKey = {
  key: keyof FiltersDto;
  label: string;
  placeholder?: string;
};

const RANGE_FILTERS: RangeKey[] = [
  { key: "mCapUsd", label: "Market Cap (USD)" },
  { key: "volumeUsd", label: "Volume 24h (USD)" },
  { key: "holders", label: "Holders" },
  { key: "ageMinutes", label: "Age (Minutes)" },
  { key: "txsBuys", label: "Buy Transactions" },
  { key: "txsSells", label: "Sell Transactions" },
  { key: "top10HoldingPct", label: "Top 10% Holding" },
  { key: "devHoldingPct", label: "Dev Holding %" },
  { key: "snipersHoldingPct", label: "Snipers %" },
  { key: "insidersHoldingPct", label: "Insiders %" },
  { key: "bundlersHoldingPct", label: "Bundlers %" },
  { key: "freshWalletsHoldingPct", label: "Fresh Wallets %" },
];

const BOOL_FILTERS: { key: keyof FiltersDto; label: string }[] = [
  { key: "devSoldAll", label: "Dev Sold All" },
  { key: "noXReuses", label: "No X Reuses" },
  { key: "dexPaid", label: "Dex Paid" },
  { key: "caEndsWithPump", label: "CA Ends With Pump" },
];

export function FilterPanel({ filters, onApply }: FilterPanelProps) {
  const [local, setLocal] = useState<FiltersDto>(filters);

  function setRange(key: keyof FiltersDto, field: "min" | "max", val: string) {
    const num = val === "" ? undefined : Number(val);
    setLocal((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as object | undefined), [field]: num },
    }));
  }

  function setBool(key: keyof FiltersDto, val: boolean) {
    setLocal((prev) => ({ ...prev, [key]: val || undefined }));
  }

  function setSocial(key: keyof SocialsFilter, val: boolean) {
    setLocal((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: val || undefined },
    }));
  }

  function handleReset() {
    setLocal({});
    onApply({});
  }

  function getRangeVal(key: keyof FiltersDto, field: "min" | "max"): string {
    const v = local[key] as { min?: number; max?: number } | undefined;
    return v?.[field] !== undefined ? String(v[field]) : "";
  }

  return (
    <aside
      className="glass-card rounded-lg flex flex-col h-full"
      data-ocid="filter.panel"
    >
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Filter Tokens
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Range filters */}
          {RANGE_FILTERS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                {label}
              </Label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={getRangeVal(key, "min")}
                  onChange={(e) => setRange(key, "min", e.target.value)}
                  className="flex-1 h-7 px-2 rounded-md bg-input border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  data-ocid={`filter.${key}.input`}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={getRangeVal(key, "max")}
                  onChange={(e) => setRange(key, "max", e.target.value)}
                  className="flex-1 h-7 px-2 rounded-md bg-input border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          ))}

          <Separator className="bg-border" />

          {/* Boolean filters */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Token Flags
            </span>
            {BOOL_FILTERS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={!!local[key]}
                  onCheckedChange={(v) => setBool(key, !!v)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  data-ocid={`filter.${key}.checkbox`}
                />
                <Label
                  htmlFor={key}
                  className="text-xs text-foreground cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>

          <Separator className="bg-border" />

          {/* Socials filter */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Socials
            </span>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">
                At Least One Social
              </Label>
              <Switch
                checked={!!local.socials?.atLeastOne}
                onCheckedChange={(v) => setSocial("atLeastOne", v)}
                className="data-[state=checked]:bg-accent"
                data-ocid="filter.socials.switch"
              />
            </div>
            {(
              [
                "twitter",
                "telegram",
                "website",
                "discord",
              ] as (keyof SocialsFilter)[]
            ).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <Checkbox
                  id={`social-${s}`}
                  checked={!!local.socials?.[s]}
                  onCheckedChange={(v) => setSocial(s, !!v)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  data-ocid={`filter.social_${s}.checkbox`}
                />
                <Label
                  htmlFor={`social-${s}`}
                  className="text-xs text-foreground capitalize cursor-pointer"
                >
                  {s}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={handleReset}
          data-ocid="filter.reset_button"
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          onClick={() => onApply(local)}
          data-ocid="filter.submit_button"
        >
          Apply
        </Button>
      </div>
    </aside>
  );
}
