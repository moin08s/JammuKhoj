# JammuKhoj — Documentation Pack

**Offline-First Smart Tourism and Pilgrim Safety Companion**

This pack turns the problem statement into build-ready documents for a hackathon MVP (Phase 1) with a path to Phases 2 and 3.

## Reading order

| # | File | What it answers |
|---|------|-----------------|
| 1 | [PRODUCT_SCOPE.md](PRODUCT_SCOPE.md) | What are we building, what are we NOT building, MVP cut line |
| 2 | [ARCHITECTURE.md](ARCHITECTURE.md) | System design, tech stack, modules, build pipeline |
| 3 | [USER_FLOWS.md](USER_FLOWS.md) | Screens and journeys, including offline and emergency flows |
| 4 | [DATASET.md](DATASET.md) | Data entities, schemas, sources, verification rules, sample JSON |
| 5 | [ITINERARY_ENGINE.md](ITINERARY_ENGINE.md) | How 4h / 8h / 24h plans are generated and validated |
| 6 | [OFFLINE_STRATEGY.md](OFFLINE_STRATEGY.md) | Caching, map packs, sync, capability matrix |
| 7 | [ROLES_PERMISSIONS.md](ROLES_PERMISSIONS.md) | Actors, roles, permission matrix |
| 8 | [SECURITY.md](SECURITY.md) | Threat model, privacy, data integrity, safety claims |
| 9 | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Visual identity, tokens, typography, accessibility |
| 10 | [UI_COMPONENTS.md](UI_COMPONENTS.md) | Component catalogue, props, states, screen wireframes |
| 11 | [API_SPEC.md](API_SPEC.md) | Content bundle format and optional server endpoints |
| 12 | [TESTING_METRICS.md](TESTING_METRICS.md) | Test plan, offline test matrix, success metrics |
| 13 | [ROADMAP.md](ROADMAP.md) | Hackathon timeline, phases, risks, research gaps |

## Guiding principles (apply to every file)

1. **Offline-first.** Essential features work in airplane mode after one-time setup.
2. **Honest claims.** Never label something "verified", "safe", or "official" unless the data supports it. Every fare and contact shows its source and last-updated date.
3. **Time-boxed trust.** The product's main promise is "you will be back on time." The return buffer is non-negotiable.
4. **Complement, don't replace.** JammuKhoj points to official emergency services (112) and does not imply government endorsement.
5. **No account needed** for Phase 1.

## Recommended stack at a glance

- **Client:** Progressive Web App (React + TypeScript + Vite), installable, works offline via service worker
- **Map:** MapLibre GL JS + PMTiles (OpenStreetMap-derived vector tiles, ODbL attribution)
- **Local storage:** IndexedDB (Dexie) + Cache Storage
- **Routing/itinerary:** precomputed travel-time matrix + on-device planner (no server)
- **Content pipeline:** Git repo of JSON/CSV → CI validates → signed content bundle → CDN/static host
- **Phase 2+:** lightweight backend (Supabase or Firebase) for listings, feedback, admin CMS

## Placeholders you must fill

Anything marked `TODO(verify)` is a value that must be sourced from an official channel before demo or release (fares, phone numbers, opening hours, coordinates).
