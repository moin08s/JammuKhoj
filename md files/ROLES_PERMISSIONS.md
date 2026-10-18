# Roles & Permissions

## 1. Actors

| Role | Who | Phase | Auth |
|------|-----|-------|------|
| **Visitor** | Pilgrim/tourist using the app | 1 | None (anonymous, local-only) |
| **Content Editor** | Team member maintaining data | 1 (via Git) | Git access / CMS login |
| **Field Verifier** | Person surveying fares, hours, contacts | 1–2 | CMS login |
| **Reviewer / Approver** | Second pair of eyes before publish | 1–2 | CMS login |
| **Local Business Owner** | Hotel, guide, artisan, transport operator | 2 | Phone/email OTP |
| **Partner Authority User** | Tourism dept, municipal, transport authority | 3 | SSO / org account |
| **Platform Admin** | Manages users, releases, config | 2 | MFA |
| **Moderator** | Handles feedback/reports | 2 | CMS login |

## 2. Permission matrix

Legend: **R** read · **C** create · **U** update · **D** delete · **A** approve/publish · — none · *own* only own records

| Resource | Visitor | Content Editor | Field Verifier | Reviewer | Business Owner | Partner Authority | Moderator | Admin |
|----------|:-------:|:--------------:|:--------------:|:--------:|:--------------:|:-----------------:|:---------:|:-----:|
| Attractions | R | C U | U (verification fields) | R A | R | R (propose) | R | R D |
| Fare references | R | C U | C U | R A | — | C U (official rates) | R | R D |
| Emergency contacts | R | C U | U | R **A (2 approvers)** | — | C U | R | R D |
| Help points | R | C U | C U | R A | — | C U | R | R D |
| Itinerary templates | R | C U | U | R A | — | — | R | R D |
| Business listings | R | R | C U (verify) | R A | C U *own* | R | R U (flag) | R D |
| Feedback / reports | C (Phase 2) | R | R | R | R *own listing* | R | R U D | R D |
| Source registry | — | C U | C U | R | — | — | — | R D |
| Bundle publish | — | — | — | A | — | — | — | A |
| User & role management | — | — | — | — | — | — | — | C U D |
| Analytics (aggregate) | — | R | — | — | R *own listing* | R | R | R |

## 3. Workflow rules
- **Two-person rule** for emergency contacts and fares: author ≠ approver.
- Business owners can edit descriptive fields; **verification badge can only be set by Field Verifier + Reviewer**.
- Sponsored/promoted listings are labelled "Promoted" and never mixed into official/safety lists.
- Partner Authority data is tagged `official` only when submitted from a verified organisation account.
- Every change writes an **audit log** entry (who, what, when, before/after).

## 4. Visitor privacy stance (Phase 1)
- No account, no profile, no server-side storage of plans.
- Location is read only on device when the user taps a location action.
- Analytics (if any) are opt-in, aggregate, and queued locally.

## 5. Role → screen map

| Role | Surfaces |
|------|----------|
| Visitor | PWA |
| Editor / Verifier / Reviewer | Git PR workflow (Phase 1) → Admin CMS (Phase 2) |
| Business Owner | Listing portal (Phase 2) |
| Partner Authority | Data submission portal / API (Phase 3) |
| Moderator | Moderation queue (Phase 2) |
| Admin | Admin console |
