# Product Scope

## 1. Vision
Help a pilgrim or tourist with a few hours in Jammu decide what they can realistically see, get there, and be back on time — even with no mobile network.

## 2. Target users

| Persona | Situation | Key need |
|---------|-----------|----------|
| **Ravi (first-time pilgrim, family of 4)** | Train arrives 06:00, onward bus to Katra at 14:00, children + elderly parent | Easy plan, short walks, fare clarity, toilets/food |
| **Meera (senior traveller)** | Overnight in Jammu, limited mobility | Accessible stops, minimal walking, rest points |
| **Arjun (solo backpacker)** | 8-hour layover, patchy network | Offline maps, heritage depth, budget transport |
| **Hotel/guide owner (Phase 2)** | Wants to reach transit visitors | A fair, clearly labelled listing |

## 3. Problem → feature mapping

| Problem area (from statement) | MVP feature | Phase |
|-------------------------------|-------------|-------|
| 4.1 Discovery | Curated attraction cards with visit duration & tips | 1 |
| 4.2 Overcharging / scams | Dated fare reference cards + "how to verify" tips + complaint instructions | 1 |
| 4.3 Network failure | Offline bundle, offline status indicator | 1 |
| 4.4 Transport comparison | Transport info screen (modes, fare ref, approx time) | 1 |
| 4.5 No unified window | Single app with source badges (Official / Verified / Third-party / Community) | 1 |
| 4.6 Short itineraries | 4h and 8h planner; 24h plan | 1 (4h, 8h) / 2 (24h) |
| 4.7 Safety info | Offline emergency screen + safety guidance + help-point map layer | 1 |
| 4.8 Offline navigation | Offline map + saved POIs + return-to-departure route | 1 |

## 4. MVP cut line

### In (Phase 1)
- Pilot area: central Jammu (Tawi riverfront, old city, Bahu Fort/Bagh-e-Bahu, Raghunath Bazaar area) + routes from Jammu Tawi station, bus stand, airport
- 8–12 validated attractions
- 4h and 8h itinerary generator with return buffer
- Offline map pack for pilot area
- Fare reference cards (only those with a source + date)
- Emergency & safety screen
- Language: English + Hindi (Dogri as stretch)
- No login, no backend dependency for core flows

### Out (explicitly not building now)
- Transport booking or payments
- Live traffic, live vehicle availability
- Live location sharing / SOS dispatch
- Automatic incident detection
- AR heritage experience
- "Safe route" claims or real-time hazard detection
- User-generated reviews (Phase 2)

## 5. Definition of done (MVP)
- [ ] App installs as PWA and loads in airplane mode after first setup
- [ ] User enters arrival time + departure time + start point → gets a feasible plan or a clear "not enough time" message
- [ ] Every fare card shows source + updated date
- [ ] Every emergency entry is marked verified with date
- [ ] Map works offline for the pilot area; route from any itinerary stop to departure point is available offline
- [ ] Capability banner shows what works offline vs. needs internet

## 6. Content language rules
- Say "fare reference", never "fixed fare" or "official price" unless the source is an official notified rate.
- Say "suggested", not "safe".
- Say "verified on <date> by <source>" for listings.
- Always display: *"JammuKhoj is not an official emergency service. In an emergency, call 112."*
