# Offline Strategy

## 1. Capability matrix

| Feature | Offline | Notes |
|---------|:------:|-------|
| Browse attractions | ✅ | From IndexedDB |
| Generate 4h/8h plan | ✅ | On-device planner + matrix |
| View saved plans | ✅ | |
| Offline map (pilot area) | ✅ | PMTiles pack |
| Route to stop / back to departure | ✅ | Precomputed graph |
| GPS dot on map | ✅ | Device GPS works without data; accuracy varies |
| Fare reference cards | ✅ | Shows `updatedAt` |
| Emergency numbers + guidance | ✅ | Also bundled in app shell as fallback |
| Help-point map layer | ✅ | |
| Content updates | ❌ | Needs internet |
| Live traffic / live vehicle availability | ❌ | Not provided at all in Phase 1 |
| Booking / payments | ❌ | Not in scope |
| Share live location | ❌ | Future, needs network |
| Calls | ⚠️ | Needs cellular voice, not data |
| Business listing updates / feedback submit | ⚠️ | Queued until online (Phase 2) |

The UI shows this matrix in **Settings → What works offline** and drives per-feature hints.

## 2. Storage plan

| Data | Store | Approx size | Eviction policy |
|------|-------|-------------|-----------------|
| App shell (JS/CSS/fonts/icons) | Cache Storage (precache) | 2–4 MB | Versioned by build hash |
| Content (JSON) | IndexedDB | < 2 MB | Replaced on bundle update |
| Images | Cache Storage | 8–15 MB | Compressed WebP, ≤ 120 KB each |
| Map tiles | Cache Storage / OPFS (blob) | 25–40 MB | User-controlled |
| Travel-time matrix | IndexedDB | < 1 MB | Bundle-versioned |
| Saved plans, favourites | IndexedDB | tiny | Never auto-deleted |
| Preferences | localStorage/IndexedDB | tiny | |

Call `navigator.storage.persist()` after the pack download to reduce eviction risk; show a warning if it's denied.

## 3. Service worker strategy (Workbox)

| Resource | Strategy |
|----------|----------|
| App shell | Precache, `skipWaiting` only after user confirms update |
| `manifest.json` (bundle) | NetworkFirst, short timeout, fallback to local |
| Content files | CacheFirst (hash-named, immutable) |
| Tiles | CacheFirst, range-request support |
| Images | CacheFirst, max entries |
| External (analytics etc.) | NetworkOnly, fail silently |

## 4. Bundle update protocol
1. Fetch remote manifest (when online and idle).
2. If `contentVersion` newer: show "Update available (what changed)".
3. Download to staging; verify hashes.
4. Atomic swap in IndexedDB transaction; keep previous version for one session for rollback.
5. Record `lastSyncedAt`; show in UI.

## 5. Connectivity indicator

Persistent but quiet banner component:
- **Online:** hidden (or a small dot).
- **Offline, pack ready:** "Offline — your saved data is available."
- **Offline, pack missing:** "Offline — download the Jammu pack when you have internet." + bundled emergency numbers.
- Never block the UI on connectivity.

## 6. Data staleness while offline
Compare `now` with `verifiedOn`; show chips. If device is offline > 30 days since last sync, show "Info may be outdated. Check for updates when online."

## 7. Offline test checklist
- Install, download pack, then turn on airplane mode → cold start the app
- Open each tab; open a saved plan; open the map; search an attraction; view fare cards; open emergency
- Kill app, reboot phone, repeat
- Low-storage scenario
- Switch language offline
- Update interrupted midway
