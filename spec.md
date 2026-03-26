# Meme Screener

## Current State
New project. Default Motoko actor with no business logic. No frontend.

## Requested Changes (Diff)

### Add
- Meme token screener dashboard that queries `POST https://api2.yodao.io/api/v2/meme` directly from the frontend
- Three tabs: New, Completing, Graduated -- each fetches and displays top 50 tokens for that table
- Token table with columns: token image/name/symbol, age, market cap, % completion, volume 24h, liquidity, holders, social links (twitter/telegram/website/discord), and a holding % breakdown bar (dev/snipers/insiders/bundles/fresh wallets)
- Filter sidebar with range filters: mCapUsd, volumeUsd, holders, ageMinutes, txsBuys, txsSells, top10HoldingPct, devHoldingPct, snipersHoldingPct, insidersHoldingPct, freshWalletsHoldingPct
- Social filter toggles: atLeastOne, twitter, telegram, website, discord
- Boolean filter toggles: devSoldAll, noXReuses, dexPaid, caEndsWithPump
- Manual refresh button + auto-refresh every 10 seconds
- Header with branding and tab navigation

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Keep Motoko backend minimal (no backend logic needed -- API calls are frontend-only)
2. Build frontend:
   - `App.tsx`: layout with header, tabs, filter sidebar, token table
   - `api.ts`: fetch wrapper for `https://api2.yodao.io/api/v2/meme`
   - `types.ts`: TypeScript types (MemeTablePoolDto, FiltersDto, etc.)
   - `FilterPanel.tsx`: sidebar with range inputs and toggles
   - `TokenTable.tsx`: data table with all columns
   - `HoldingBar.tsx`: stacked colored bar for holding % breakdown
