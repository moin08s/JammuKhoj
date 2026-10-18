# Testing & Success Metrics

## 1. Test pyramid

| Level | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Planner, freshness logic, fare staleness, bundle verification |
| Data | JSON Schema + custom scripts | Source/date present, coords in bounds, matrix completeness |
| Component | Testing Library + Storybook | States (loading/empty/error/stale/offline), i18n |
| E2E | Playwright (with `context.setOffline(true)`) | Core flows offline |
| Accessibility | axe + manual screen reader (TalkBack) | WCAG AA |
| Performance | Lighthouse CI | PWA, LCP, TBT on throttled mobile |
| Field | Real devices in Jammu | Routes, timings, GPS, battery |
| Usability | 8–10 target users | Task success, confidence |

## 2. Offline test matrix

| Scenario | Steps | Pass criteria |
|----------|-------|---------------|
| Setup then airplane mode | Download pack → airplane → cold start | App loads < 3 s, all tabs open |
| Plan offline | Generate 4h & 8h plans | Plan renders, includes return buffer |
| Map offline | Pan/zoom pilot area | Tiles render, attribution shown |
| Route to departure | From each stop | Route displays offline |
| Emergency | Open Safety, tap call link | Numbers present, `tel:` opens dialer |
| No pack + offline | Fresh install, no data | Fallback emergency numbers + guidance to download |
| Interrupted download | Kill network mid-way | Resume works; no corrupt state |
| Hash mismatch | Tamper a file | Update rejected, old data kept |
| Storage eviction (iOS) | Simulate cleared storage | Prompt to re-download, no crash |
| Language switch offline | EN ↔ HI | All strings present |

## 3. Planner test cases
See `ITINERARY_ENGINE.md` §9. Add property-based tests: for any generated plan, `returnArrival + departureBuffer ≤ departureTime`.

## 4. Data QA checklist (per release)
- [ ] All fares have source + date, none Stale (or flagged)
- [ ] Emergency numbers re-verified by a second person
- [ ] Attraction hours checked in the last 90 days
- [ ] Map pack covers all attraction and departure nodes
- [ ] Travel times spot-checked on ground (≥ 10 pairs, within ±25%)
- [ ] All images licensed, alt text present
- [ ] Hindi translations reviewed by a native speaker

## 5. Success metrics (from the problem statement)

| Objective | Metric | Target (pilot) | How measured |
|-----------|--------|----------------|--------------|
| Discovery | Attraction views, plans created | Baseline then + | Opt-in aggregate analytics |
| Offline reliability | % essential features working in airplane mode | 100% of listed offline features | Playwright + manual |
| Planning | % test users completing plan within the available time | ≥ 80% | Usability sessions |
| Fare transparency | % fare cards with valid source + date | 100% | CI check |
| Navigation | Successful test routes using offline map | ≥ 95% | Field test |
| Emergency readiness | % emergency entries verified + offline | 100% | CI + QA |
| Local visibility (Ph.2) | # listings, interactions | Baseline | Admin analytics |
| Confidence | Pre/post survey (1–5) | +1 point average | Survey |

These are proposed targets, not achieved results.

## 6. Usability test script (short)
1. "You arrive at Jammu Tawi at 6 am, bus at 2 pm. Find a plan."
2. "Turn your phone to airplane mode. Open your saved plan."
3. "How would you check if a taxi fare is reasonable?"
4. "Something goes wrong. Show me what you'd do."
5. "Your train is delayed 1 hour. Update your plan."
Measure: success, time, errors, quotes; follow with confidence score and clarity of "reference vs guarantee."

## 7. Research gaps to close (from the statement)
- Share of Vaishno Devi pilgrims passing through Jammu with spare time
- Common transport complaints
- Official fare schedules and update frequency
- Connectivity failure frequency in pilot area
- Existing official apps covering parts of this problem
- Business willingness to join verified listings

Run a short intercept survey (30–50 visitors) at stations/bus stand and 5–10 local-business interviews.
