# Dev Log

Chronological record of development decisions, progress, and open questions.

---

## 2026-04-02 — Project scaffold

- Scaffolded Next.js with TypeScript, Tailwind CSS, ESLint, App Router
- Part of the Specter ecosystem: real-time drone operations dashboard
- Consumes SSE telemetry stream from specter-cloud (`GET /api/v1/stream/telemetry?drone_id=X`)
- Stack decision: Next.js over React+Vite — industry standard, good ecosystem, no SSR needed but available if needed later
- Skipped React Compiler — premature optimization for a dashboard with minimal component complexity

## 2026-04-02 — Live map + component extraction

- Added react-leaflet (OpenStreetMap) with live drone marker tracking via SSE telemetry stream
- DroneMap component uses `FollowDrone` pattern — `useMap()` imperatively moves viewport as position updates
- Custom drone icon using Material Symbols `navigation` arrow via Leaflet `divIcon`
- Dynamic import with `ssr: false` — Leaflet requires browser APIs (`window`), incompatible with Next.js server rendering
- Extracted dashboard components: StatusBar, TelemetryPanel, TelemetryCard, SystemLog, DroneMap
- Page component (`page.tsx`) now purely compositional — owns hook state, passes data as props to children
- Map library kept isolated in single component for future swap (react-leaflet → Mapbox if needed)

## 2026-04-28 — Schema reckoning after cloud telemetry relaxation

Cloud schema relaxed (PR #45): `flight_mode` from closed Literal to `[A-Z0-9_]{1,32}` regex, `alt` allows negatives, MAVLink sentinels filtered on onboard (so per-field values can now stale silently). Walked the dashboard for *semantic drift* — places where types still match but values in the wild changed meaning.

**What changed:**

- `useTelemetry` hook reworked. Previously: ERROR action wiped data → "--" everywhere on any flap. Now: holds last frame, tracks `lastReceivedAt`, runs a 1Hz `TICK` action that flips status to `"stale"` if no message has arrived in 5s. The reducer is the only place that decides staleness — the timer just dispatches `now`, the reducer compares against its own `lastReceivedAt`. This keeps closure semantics clean (no stale-state-in-setInterval bugs).
- `ConnectionStatus` simplified: dropped `"disconnected"` (nothing dispatched it), added `"stale"`.
- `StatusBar`: handles open-set `flight_mode`. Categorises into three tones — `boot` (UNKNOWN sentinel during FC boot, renders "INITIALIZING" dim italic), `safety` (RTL/SMART_RTL/LAND/BRAKE/AUTOLAND, error-coloured for at-a-glance ops awareness), `normal` (everything else, neutral). Open-set tolerant: any unrecognised mode falls through to `normal` and renders as-is. Replaces hardcoded "SYSTEM UPTIME 00:00" placeholder slot with a CONNECTION indicator (Connecting / Live / Stale / Lost).
- `StatusBar` + `TelemetryPanel`: dim to `opacity-60` when status ≠ `connected`. Operator can still see the last-known frame on a flap or stale window — much better than crashing to `--`.
- `page.tsx`: passes `status` down to both panels.

**Deferred:**

- Per-field freshness (battery/voltage/etc. — the sentinel filter on onboard means stale values can render as fresh). Needs cloud schema change to ship per-field timestamps; not worth the brittle dashboard-only version that watches for unchanged values.
- Negative-altitude visual treatment — `-2.0 m` reads correctly with the existing minus sign; not a bug, polish only.

**Why this matters:**

Type drift is loud (TS yells); semantic drift is silent (types stay green, values change meaning). When the cloud loosened `flight_mode` to a regex, every consumer that hardcoded the closed enum silently became wrong without a single compile error. The fix is to design the dashboard around what the schema *now allows*, not what it used to.
