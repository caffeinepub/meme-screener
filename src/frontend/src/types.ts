export type RangeFilter = {
  min?: number;
  max?: number;
};

export type SocialsFilter = {
  twitter?: boolean;
  telegram?: boolean;
  website?: boolean;
  discord?: boolean;
  atLeastOne?: boolean;
};

export type FiltersDto = {
  xReuses?: RangeFilter;
  ageMinutes?: RangeFilter;
  mCapUsd?: RangeFilter;
  volumeUsd?: RangeFilter;
  txsBuys?: RangeFilter;
  txsSells?: RangeFilter;
  top10HoldingPct?: RangeFilter;
  devHoldingPct?: RangeFilter;
  snipersHoldingPct?: RangeFilter;
  insidersHoldingPct?: RangeFilter;
  bundlersHoldingPct?: RangeFilter;
  freshWalletsHoldingPct?: RangeFilter;
  holders?: RangeFilter;
  proTradersAmount?: RangeFilter;
  devMigrations?: RangeFilter;
  devCreations?: RangeFilter;
  devSoldAll?: boolean;
  noXReuses?: boolean;
  dexPaid?: boolean;
  caEndsWithPump?: boolean;
  socials?: SocialsFilter;
};

export type FiltersMemeDto = {
  type?: "new" | "completing" | "graduated" | "all";
  newPools?: FiltersDto;
  completing?: FiltersDto;
  graduated?: FiltersDto;
};

export type MemeTablePoolDto = {
  name: string;
  symbol: string;
  timestamp: string;
  mint: string;
  creator: string;
  pool: string;
  description?: string;
  image?: string;
  discord?: string;
  website?: string;
  telegram?: string;
  video?: string;
  twitter?: string;
  holders: number;
  top_10_percent: number;
  market_cap: number;
  pct_completion: number;
  liqudity: number;
  tx_24h: number;
  tx_24h_buy: number;
  tx_24h_sell: number;
  vol_24h: number;
  vol_24_buy: number;
  vol_24_sell: number;
  fresh_wallets_holding: number;
  insiders_holding: number;
  bundle_holding: number;
  snipers_holding: number;
  creator_holding: number;
  pro_traders_holding: number;
  creator_completed_pools: number;
  creator_completing_pools: number;
};

export type MemeTablesResponseDto = {
  new?: MemeTablePoolDto[];
  completing?: MemeTablePoolDto[];
  graduated?: MemeTablePoolDto[];
};

export type ActiveTab = "new" | "completing" | "graduated";

export type TabFilters = {
  newPools: FiltersDto;
  completing: FiltersDto;
  graduated: FiltersDto;
};
