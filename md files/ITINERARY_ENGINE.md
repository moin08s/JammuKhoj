# Itinerary Engine

Goal: given a start point, arrival time, and departure, produce a plan that **always preserves a safe return buffer**, or explain clearly why it can't.

## 1. Inputs

| Input | Example |
|-------|---------|
| `startNode` | Jammu Tawi station |
| `arrivalTime` | 06:10 |
| `departure` | `{ nodeId: bus_stand, time: 14:00, mode: bus }` |
| `preferences` | heritage, riverfront, food |
| `mobility` | `walk_ok | minimal_walk | wheelchair` |
| `groupFlags` | children, senior |
| `luggage` | `carrying | stored` |

## 2. Time budget

```
available   = departureTime − arrivalTime
fixedCosts  = departureBuffer + settleTime + returnTravel(last stop → departure)
usable      = available − fixedCosts
```

| Term | Default (tunable) |
|------|-------------------|
| `settleTime` (freshen up, luggage, tea) | 20 min |
| `departureBuffer` | rail 45 min, bus 30 min, air 150 min |
| `delayBuffer` | 15% of travel time, min 10 min |
| Group slowdown | ×1.25 on walk and visit times if children/senior/minimal_walk |

All defaults live in `config/planner.json` and should be validated with field tests.

## 3. Buckets

| Bucket | Available time | Typical stops |
|--------|----------------|---------------|
| Not enough time | < ~2 h 30 m | 0 (suggest nearby quick options) |
| **4 h** | ~2.5–6 h | 1–2 |
| **8 h** | ~6–12 h | 2–4 |
| **24 h** | > 12 h | multi-slot: morning/afternoon/evening + meal + rest |

Bucket is a label; the real constraint is `usable` time.

## 4. Algorithm (time-constrained orienteering, greedy + local search)

```
function plan(input):
  candidates = attractions
      .filter(openDuringWindow)       // using verified hours; unverified → excluded by default
      .filter(matchesMobility)
  score(a) = priority(a) * prefMatch(a) / (visitTime(a) + marginalTravel(a))

  route = [start]
  loop:
     best = argmax over candidates not in route of score, such that
            feasible(insert(best, route))
     if none: break
     route = insertAtBestPosition(best, route)
  route = twoOpt(route)               // small n, cheap
  validate(route)                     // see below
  return route
```

`feasible(route)` checks that the cumulative schedule — arrive, wait for opening if needed, visit, travel — plus return to departure plus buffers ≤ `available`.

For ≤ 12 candidates, brute-force permutation search is also viable and gives optimal results; use it for the demo.

## 5. Validation rules (hard constraints)

1. **Return buffer is never negative.** If a plan fails, drop the lowest-score stop and re-check.
2. Each stop opens before arrival and closes after planned departure from it (using verified hours only).
3. Total walking distance ≤ mobility limit (walk_ok 3 km, minimal_walk 800 m, wheelchair: only stepFree=true stops).
4. Last stop must have a travel route back (exists in matrix).
5. Plan must record `dataFreshness` — if any used record is Stale, show warning.
6. If matrix lacks a pair, the stop is excluded (never guess).

## 6. Output

```json
{
  "planId": "plan_20261017_001",
  "generatedAt": "2026-10-17T05:50:00+05:30",
  "bucket": "8h",
  "mustLeaveBy": "13:05",
  "mustBeAtDepartureBy": "13:15",
  "timeline": [
    { "type": "travel", "from": "node_station", "to": "node_x", "mode": "auto_taxi", "start": "06:30", "minutes": 20, "fareRefId": "fare_..." },
    { "type": "visit", "attractionId": "attr_x", "start": "06:50", "minutes": 60 },
    { "type": "buffer", "minutes": 15, "label": "Delay buffer" },
    { "type": "return", "to": "node_bus_stand", "start": "12:20", "minutes": 25 }
  ],
  "warnings": [],
  "explanations": ["Chosen because it opens early and is close to the riverfront."],
  "assumptions": { "peakFactor": 1.3, "groupSlowdown": 1.25 }
}
```

## 7. Re-planning ("I'm running late")
- Input: current time, current node (GPS or manual).
- Recompute from current state; remove lowest-score remaining stops until feasible.
- If even direct return breaches buffer → show **"Head back now"** with return route and fare reference.

## 8. Explainability
Every plan has a "Why this plan?" sheet listing: stops chosen and why, assumptions (peak factor, buffers), what was excluded (e.g., "Amar Mahal skipped — opening hours unverified").

## 9. Test cases
| # | Scenario | Expected |
|---|----------|----------|
| 1 | 1 h 40 m available | "Not enough time" + quick options |
| 2 | 4 h, station→bus stand | 1–2 stops, buffer ≥ 30 min |
| 3 | 8 h, senior, minimal walk | Stops ≤ 800 m walking each, benches noted |
| 4 | Stop closed on Mondays | Excluded on Monday plans |
| 5 | Missing matrix pair | Stop excluded, no crash |
| 6 | Late by 45 min mid-plan | Re-plan drops stop(s), buffer preserved |
| 7 | All data stale | Plan generated with stale warning |
