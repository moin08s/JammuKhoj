# API & Content Contract

**Phase 1 needs no live API.** The "API" is a static, versioned content bundle. Phase 2 adds optional REST endpoints.

## 1. Phase 1 — Static bundle endpoints

| Path | Purpose |
|------|---------|
| `GET /bundle/manifest.json` | Version, file list, hashes, signature |
| `GET /bundle/content.json` | Attractions, nodes, fares, contacts, guidance, templates |
| `GET /bundle/matrix.json` | Travel-time matrix |
| `GET /bundle/i18n/{lang}.json` | UI strings |
| `GET /bundle/media/{file}` | Images |
| `GET /bundle/tiles/jammu-pilot.pmtiles` | Offline map (HTTP range supported) |

### manifest.json
```json
{
  "contentVersion": "2026.10.17-1",
  "minAppVersion": "1.0.0",
  "generatedAt": "2026-10-17T10:00:00Z",
  "files": [
    { "path": "content.json", "sha256": "…", "bytes": 182044 },
    { "path": "matrix.json", "sha256": "…", "bytes": 40211 },
    { "path": "tiles/jammu-pilot.pmtiles", "sha256": "…", "bytes": 38000000 }
  ],
  "changes": ["3 fare references updated", "1 attraction added"],
  "signature": "base64-ed25519"
}
```

## 2. Phase 2 — Optional REST API

Base: `https://api.<domain>/v1` · JSON · HTTPS only · rate-limited.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/listings?category=&near=&limit=` | none | Verified/labelled listings |
| GET | `/listings/{id}` | none | Listing detail |
| POST | `/feedback` | none (rate-limited, captcha) | Visitor feedback / issue report |
| POST | `/auth/otp/request` | none | Business owner OTP |
| POST | `/auth/otp/verify` | none | Returns session token |
| GET/PUT | `/owner/listings/{id}` | owner | Edit own listing |
| GET | `/admin/queue` | staff | Moderation / verification queue |
| POST | `/admin/records/{id}/verify` | verifier | Set verification |
| POST | `/admin/bundle/publish` | reviewer + admin | Build and sign a bundle |
| GET | `/admin/audit` | admin | Audit log |

### Error format
```json
{ "error": { "code": "validation_failed", "message": "Phone number is invalid.", "field": "phone" } }
```

### Conventions
- Pagination: `limit` + `cursor`.
- Timestamps ISO 8601 with offset (`+05:30`).
- Idempotency keys for POSTs queued while offline.
- Versioned paths; additive changes only within `v1`.

## 3. Offline write queue (Phase 2)
Feedback or reports made offline are stored in IndexedDB `outbox` with `{id, type, payload, createdAt, attempts}` and sent when online with exponential backoff. UI shows "Will send when you're online."

## 4. Third-party integrations (Phase 3, if partnered)
| Integration | Direction | Notes |
|-------------|-----------|-------|
| Transport authority fare feed | in | Signed feed, dated records |
| Tourism dept content | in | Official tag only through verified org accounts |
| Complaint portal | out | Only with an approved channel |
| Emergency control room | out | Requires formal agreement; not before |
