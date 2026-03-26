import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Globe, MessageCircle, Send, Twitter } from "lucide-react";
import { useState } from "react";
import type { MemeTablePoolDto } from "../types";
import { HoldingBar } from "./HoldingBar";

function formatAge(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function formatNum(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

interface TokenTableProps {
  tokens: MemeTablePoolDto[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function TokenTable({
  tokens,
  isLoading,
  isError,
  onRetry,
}: TokenTableProps) {
  const [search, setSearch] = useState("");

  const filtered = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="glass-card rounded-lg flex flex-col overflow-hidden"
      data-ocid="token.table"
    >
      {/* Table header bar */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Token List
        </span>
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-3 rounded-md bg-input border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent w-48"
          data-ocid="token.search_input"
        />
      </div>

      {/* States */}
      {isError && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3 text-destructive"
          data-ocid="token.error_state"
        >
          <span className="text-sm">Failed to load data</span>
          <button
            type="button"
            onClick={onRetry}
            className="text-xs text-accent underline"
            data-ocid="token.retry_button"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && !isError && (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="token.loading_state"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`dot-${i}`}
                className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-2"
          data-ocid="token.empty_state"
        >
          <span className="text-sm text-muted-foreground">No tokens found</span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-accent"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-48">
                  Token
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-16">
                  Age
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-24">
                  Mkt Cap
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-28">
                  Progress
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-24">
                  Vol 24h
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-24">
                  Liquidity
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-20">
                  Holders
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-24">
                  Socials
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-36">
                  Holdings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((token, idx) => (
                <TableRow
                  key={token.mint || `token-${idx}`}
                  className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                  data-ocid={`token.item.${idx + 1}`}
                >
                  {/* Token cell */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={token.image} alt={token.symbol} />
                        <AvatarFallback className="bg-secondary text-xs font-bold text-foreground">
                          {token.symbol.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate max-w-28">
                          {token.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Age */}
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {token.timestamp ? formatAge(token.timestamp) : "—"}
                  </TableCell>

                  {/* Market cap */}
                  <TableCell className="text-xs text-foreground font-mono tabular-nums">
                    {formatUsd(token.market_cap)}
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    <div className="space-y-1">
                      <Progress
                        value={Math.min(token.pct_completion, 100)}
                        className="h-1.5 bg-secondary [&>div]:bg-accent"
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {token.pct_completion.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>

                  {/* Volume */}
                  <TableCell className="text-xs text-foreground font-mono tabular-nums">
                    {formatUsd(token.vol_24h)}
                  </TableCell>

                  {/* Liquidity */}
                  <TableCell className="text-xs text-foreground font-mono tabular-nums">
                    {formatUsd(token.liqudity)}
                  </TableCell>

                  {/* Holders */}
                  <TableCell className="text-xs text-foreground font-mono tabular-nums">
                    {formatNum(token.holders)}
                  </TableCell>

                  {/* Socials */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {token.twitter && (
                        <a
                          href={token.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="Twitter/X"
                          data-ocid={`token.twitter.${idx + 1}`}
                        >
                          <Twitter className="h-3 w-3" />
                        </a>
                      )}
                      {token.telegram && (
                        <a
                          href={token.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="Telegram"
                          data-ocid={`token.telegram.${idx + 1}`}
                        >
                          <Send className="h-3 w-3" />
                        </a>
                      )}
                      {token.website && (
                        <a
                          href={token.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="Website"
                          data-ocid={`token.website.${idx + 1}`}
                        >
                          <Globe className="h-3 w-3" />
                        </a>
                      )}
                      {token.discord && (
                        <a
                          href={token.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="Discord"
                          data-ocid={`token.discord.${idx + 1}`}
                        >
                          <MessageCircle className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  {/* Holdings bar */}
                  <TableCell>
                    <HoldingBar
                      creator={token.creator_holding}
                      insiders={token.insiders_holding}
                      snipers={token.snipers_holding}
                      bundles={token.bundle_holding}
                      freshWallets={token.fresh_wallets_holding}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
