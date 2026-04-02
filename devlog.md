# Dev Log

Chronological record of development decisions, progress, and open questions.

---

## 2026-04-02 — Project scaffold

- Scaffolded Next.js with TypeScript, Tailwind CSS, ESLint, App Router
- Part of the Specter ecosystem: real-time drone operations dashboard
- Consumes SSE telemetry stream from specter-cloud (`GET /api/v1/stream/telemetry?drone_id=X`)
- Stack decision: Next.js over React+Vite — industry standard, good ecosystem, no SSR needed but available if needed later
- Skipped React Compiler — premature optimization for a dashboard with minimal component complexity
