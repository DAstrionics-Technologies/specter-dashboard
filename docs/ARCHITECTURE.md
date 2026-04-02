# Architecture

specter-dashboard is the real-time operations dashboard for the Specter drone platform. It visualizes live drone telemetry on a map and provides fleet management controls.

## Stack

- **Next.js** (App Router) — React framework
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling

## Data flow

```
specter-cloud (SSE) → EventSource → React state → Map markers
```

## Backend dependency

- `GET /api/v1/stream/telemetry?drone_id=X` — SSE stream of live telemetry from specter-cloud
