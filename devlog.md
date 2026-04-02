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
