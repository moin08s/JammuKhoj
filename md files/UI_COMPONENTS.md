# UI Components

Naming: `PascalCase`, props in TypeScript. All components support EN/HI strings via keys (never hard-coded), light/dark tokens, and screen-reader labels.

## 1. Component catalogue

### 1.1 App-level
| Component | Purpose | Key props | States |
|-----------|---------|-----------|--------|
| `AppShell` | Layout, bottom nav, banners | `children` | online/offline |
| `BottomNav` | 5 tabs | `active` | default, active, badge |
| `TopBar` | Title, back, menu | `title`, `onBack`, `actions` | default, scrolled |
| `ConnectivityBanner` | Offline/pack status | `status: online\|offline_ready\|offline_no_pack` | 3 variants, dismissible only when ready |
| `HelpFab` | One-tap route to Safety | `position` | default, pressed |
| `ReturnByBar` | Sticky "Be back by 13:15 · 2h 10m left" | `deadline`, `now` | ok, <60m (amber), <30m (accent strong), passed (danger) |
| `DisclaimerNote` | Standing disclaimers | `kind: emergency\|fare\|map` | |

### 1.2 Trust components
| Component | Props | Notes |
|-----------|-------|-------|
| `SourceBadge` | `type: official\|verified\|third_party\|community\|promoted` | Icon + label |
| `FreshnessChip` | `verifiedOn`, `reviewDueOn` | Computes Fresh/Aging/Stale |
| `SourceLine` | `source`, `updatedAt` | "Source: Transport Dept · Updated 12 Oct 2026" with link when online |
| `VerificationSheet` | `record` | Bottom sheet showing how/when verified |

### 1.3 Inputs
| Component | Purpose | Notes |
|-----------|---------|-------|
| `TimePicker` | Arrival/departure time | Large wheels, 12/24 h toggle |
| `PlacePicker` | Start/departure point | Preset departure points + "Use GPS" + "Pick on map" |
| `ChipGroup` | Interests, mobility | Multi-/single-select, ≥ 48 px height |
| `SegmentedControl` | 4h / 8h / 24h view | |
| `Toggle` | Settings | Label on the left, state text on the right |
| `SearchField` | Attractions search | Works offline, fuzzy, handles Hindi |

### 1.4 Cards & lists
| Component | Purpose | Key props |
|-----------|---------|-----------|
| `AttractionCard` | Explore list item | `name, image, summary, typicalMinutes, tags, distanceFromStart, badge` |
| `StopCard` | Itinerary stop | `time, name, visitMinutes, notes, onSwap, onNavigate` |
| `TravelLegRow` | Between stops | `mode, minutes, fareRef, onOpenFare` |
| `BufferBlock` | Visual delay buffer | `minutes, label` |
| `FareCard` | Fare reference | `route, vehicle, amount, basis, source, updatedAt, howToVerify` |
| `ContactRow` | Emergency contact | `name, number, category, verifiedOn` (call button 56 px) |
| `GuidanceCard` | Safety scenario steps | `scenario, steps[]` |
| `PackCard` | Offline pack status | `version, size, updatedAt, status, onUpdate` |
| `SavedPlanCard` | Saved plan summary | `title, date, bucket, stops` |

### 1.5 Map
| Component | Purpose | Notes |
|-----------|---------|-------|
| `MapView` | MapLibre wrapper | Attribution always visible; `layers[]` |
| `MapLayerToggle` | Attractions / Help points / Departure | |
| `MapMarker` | Typed markers | shapes + icons differ by type (not color only) |
| `RouteLine` | Planned route | Solid = road, dashed = walk; label "estimated" |
| `LocationDot` | User position | Accuracy ring; "Location unavailable" state |
| `MapBottomSheet` | Details/peek | peek / half / full |
| `MapListAlternative` | Accessible list of map items | Screen reader & low-power fallback |

### 1.6 Feedback & status
| Component | Purpose |
|-----------|---------|
| `Toast` | Short confirmations ("Plan saved") |
| `InlineError` | Field/validation errors with fix instruction |
| `EmptyState` | Message + single action |
| `ProgressDownload` | Pack download with pause/resume, size, ETA |
| `SkeletonCard` | Loading (only when needed; offline data is instant) |
| `ConfirmDialog` | Destructive actions (clear data) |

### 1.7 Emergency
| Component | Purpose | Notes |
|-----------|---------|-------|
| `CallButton` | `tel:` link, 56 px, danger color | Shows number text too |
| `EmergencyHeader` | "In an emergency, call 112" | Always at top of Safety |
| `CopyLocationButton` | Copies lat/lng + nearest landmark | Works offline |
| `HelpPointList` | Nearest hospital/police/pharmacy | Distance from GPS or last known |

## 2. Screen wireframes (ASCII)

### 2.1 Home
```
┌──────────────────────────────┐
│ JammuKhoj            [☰]     │
│ [offline banner if needed]   │
├──────────────────────────────┤
│ How much time do you have?   │
│ ┌──────────────────────────┐ │
│ │ Arriving at [Station ▾]  │ │
│ │ Arrive  [06:10 am]       │ │
│ │ Leave   [02:00 pm]       │ │
│ │ [  Plan my stop  ]       │ │
│ └──────────────────────────┘ │
│ Quick actions                │
│ [Explore] [Map] [Fares]      │
│ Offline pack: ready · 12 Oct │
├──────────────────────────────┤
│ Home  Plan  Map  Transport  Safety│
└──────────────────────────────┘
```

### 2.2 Itinerary
```
┌──────────────────────────────┐
│ ← Your 8-hour plan           │
│ ┌──────────────────────────┐ │
│ │ Be back by   1:15 pm     │ │  ← ReturnByBar (accent)
│ │ 7 h 05 m left            │ │
│ └──────────────────────────┘ │
│ 6:30  Travel · 20 min · ₹ref │
│ 6:50  ▣ Raghunath Temple     │
│        60 min · [Navigate]   │
│ 7:50  Travel · 10 min        │
│ 8:00  ▣ Bahu Fort            │
│ ...                          │
│ 12:20 Return · 25 min        │
│ ░░░░ Delay buffer 15 min     │
│ [Why this plan?] [Save]      │
│                     (Help)   │
└──────────────────────────────┘
```

### 2.3 Fare card
```
┌──────────────────────────────┐
│ Station → Bahu Fort · Taxi   │
│ ₹300–₹400        [Aging ⚠]   │
│ Reference only. Actual fare  │
│ may differ.                  │
│ Source: <name> · Updated ... │
│ How to verify ▸              │
│ Report a problem ▸           │
└──────────────────────────────┘
```

### 2.4 Safety
```
┌──────────────────────────────┐
│ In an emergency, call 112    │
│ [ 📞 Call 112 ]  (large red) │
│ Police 100  Ambulance 102/108│
│ Tourist helpline 1363        │
│ [Copy my location]           │
│ Nearby help (offline map)    │
│  • Hospital ...  1.2 km      │
│ What to do if...             │
│  [Road incident][Medical]... │
│ Not an official emergency    │
│ service. Verified <date>.    │
└──────────────────────────────┘
```

### 2.5 Map
```
┌──────────────────────────────┐
│ [layers]            [locate] │
│        MAP (offline)         │
│    ◆ station  ● attraction   │
│                              │
│ ─ ─ bottom sheet (peek) ─ ─  │
│ Bahu Fort · 1.2 km · 60 min  │
│ [Navigate] [Add to plan]     │
│ © OpenStreetMap contributors │
└──────────────────────────────┘
```

## 3. Component state conventions
- Every data-driven component supports: `loading`, `empty`, `error`, `stale`, `offline`.
- Interactive controls: default, hover/focus, pressed, disabled (with reason on tap).

## 4. Accessibility per component
- `ReturnByBar`: `role="timer"`, polite announcements at 60 / 30 / 15 minutes.
- `MapView`: keyboard-focusable markers, plus `MapListAlternative`.
- `CallButton`: label reads "Call 112, emergency number".
- `ChipGroup`: `role="group"`, `aria-pressed`.
- All badges have text, not just icons.

## 5. Suggested folder structure
```
ui/
├─ layout/ (AppShell, BottomNav, TopBar)
├─ trust/ (SourceBadge, FreshnessChip, SourceLine)
├─ inputs/
├─ cards/
├─ map/
├─ emergency/
├─ feedback/
└─ tokens.css
```
Document each in Storybook with all states, in EN and HI, light and dark.
