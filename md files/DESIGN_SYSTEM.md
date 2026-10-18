# Design System

## 1. Design intent
JammuKhoj is used by tired, time-pressed travellers, often outdoors, on mid-range phones, sometimes in a stressful moment. The design must feel **calm, legible and trustworthy**. The one memorable element is the **Return-by clock**: a clear countdown to "be back at the station by" that anchors every plan screen. Everything else stays quiet.

Visual references drawn from place: the **Tawi river** (deep teal water), **Dogra-era sandstone and fort walls** (muted warm stone), **marigold** offerings seen across pilgrim routes (single warm accent for time and action). Emergency uses its own red, reserved for safety only.

## 2. Color tokens

| Token | Name | Hex | Use |
|-------|------|-----|-----|
| `--color-ink` | Tawi Ink | `#10252B` | Primary text, headers |
| `--color-primary` | Tawi Teal | `#0F6B73` | Primary buttons, links, active nav |
| `--color-primary-soft` | River Mist | `#E3F0F1` | Selected chips, subtle fills |
| `--color-surface` | Page | `#F6F8F8` | App background |
| `--color-card` | Card | `#FFFFFF` | Cards, sheets |
| `--color-stone` | Fort Stone | `#8C8274` | Secondary text/icons (check contrast) |
| `--color-accent` | Marigold | `#E0A100` | Return-by clock, key highlights |
| `--color-accent-ink` | Marigold Ink | `#5A4200` | Text on marigold fills |
| `--color-danger` | Alert Vermilion | `#C23B22` | **Emergency only** |
| `--color-success` | Verified Green | `#2E7D4F` | Verified badge |
| `--color-warn` | Aging Amber | `#B26A00` | Aging data chip |
| `--color-border` | Line | `#D5DDDE` | Dividers, outlines |

Dark mode tokens (outdoor night use and battery): surface `#0C1A1E`, card `#142A30`, ink `#E8F1F2`, primary `#4FB3BC`, accent `#F2BC2B`, danger `#FF7A63`.

**Rules**
- Text contrast ≥ 4.5:1 (body), 3:1 (large text, icons). Verify `--color-stone` on `--color-card` before using for body text; use `--color-ink` at 70% instead if it fails.
- Never use color alone: pair with icon + text (e.g., ✓ Verified, ⚠ Stale).
- Red is exclusive to emergency/destructive.

## 3. Typography

| Role | Typeface | Notes |
|------|----------|-------|
| Headings | **Spectral** (serif) 600 | Heritage tone, good for place names |
| Body / UI | **Mukta** 400/500/700 | Strong Latin + Devanagari support (Hindi/Dogri) |
| Numerals (times, fares) | Mukta with `font-variant-numeric: tabular-nums` | Aligned columns |

Self-host fonts (privacy + offline). Subset to Latin + Devanagari.

| Style | Size / line-height | Weight |
|-------|-------------------|--------|
| Display (Return-by time) | 40 / 44 | Spectral 600 |
| H1 | 28 / 34 | Spectral 600 |
| H2 | 22 / 28 | Spectral 600 |
| H3 | 18 / 24 | Mukta 700 |
| Body | 16 / 24 (Devanagari 16 / 28) | Mukta 400 |
| Small | 14 / 20 | Mukta 400 |
| Caption | 12 / 16 | Mukta 500 |

Line length ≤ 70 characters. Minimum body size 16 px. Sentence case everywhere; no all-caps labels.

## 4. Spacing, shape, elevation
- 4 px base grid: 4, 8, 12, 16, 24, 32, 48.
- Screen padding 16 px; card padding 16 px; section gap 24 px.
- Radius: **controls 10 px, cards 14 px, bottom sheets 20 px top corners, chips full-pill.** (Vary by role instead of one radius everywhere.)
- Elevation: 0 (flat with border) by default; sheets/modals only get shadow. Prefer 1 px borders to stacks of shadowed cards.
- Touch targets ≥ 48×48 px (≥ 56 px for emergency actions).

## 5. Iconography
Simple outline icons (Lucide). 24 px default, 2 px stroke. Custom icons needed: Return-by clock, offline pack, fare reference. Every icon button has a text label or `aria-label`.

## 6. Layout
- Mobile-first, single column; max content width 640 px on larger screens.
- Bottom navigation (5 tabs) with labels; floating **Help** pill on every screen except Safety (bottom-right, above nav).
- Sticky **Return-by bar** on plan/navigation screens.
- Map screens: map fills viewport, controls in bottom sheet (peek/half/full).

## 7. Trust visual language

| Badge | Icon | Color | Meaning |
|-------|------|-------|---------|
| Official | building | Teal outline | From a government/official source |
| Verified | check-shield | Green fill | Checked by JammuKhoj on a date |
| Third-party | link | Stone outline | External data, not verified by us |
| Community | people | Stone dashed | User-submitted (Phase 2) |
| Promoted | tag | Marigold outline | Paid placement (Phase 2) |

| Freshness chip | Rule | Look |
|----------------|------|------|
| Fresh | ≤ 90 days | Green text "Updated 12 Oct 2026" |
| Aging | 91–180 | Amber text + clock icon |
| Stale | > 180 | Amber fill + "Check before relying" |

## 8. Motion
- Minimal. One orchestrated moment: when a plan is generated, timeline stops draw in sequentially, ending on the Return-by clock settling into place (≤ 600 ms).
- Interaction motion (sheet open, chip select, expand) 150–200 ms ease-out.
- Respect `prefers-reduced-motion`: disable the plan animation and any transitions beyond opacity.

## 9. Content & voice
- Plain, active, calm. Say what happens: "Download Jammu pack (38 MB)", "Save plan", "Call 112".
- Errors state cause + fix: "Couldn't finish the download. Your connection dropped. Resume".
- Empty states direct action: "No saved plans yet. Plan your stop".
- No apologies, no exclamation marks, no jargon ("bundle", "sync", "cache" never shown to users).
- Dates: `12 Oct 2026`; times: 24-hour or 12-hour per locale setting (default 12-hour with am/pm for Indian users; allow toggle).
- Currency: `₹250` or `₹200–₹300`.

## 10. Accessibility (WCAG 2.1 AA)
- Full screen-reader labels; map has an accessible list alternative to markers.
- Visible keyboard/switch focus (3 px teal outline + 2 px offset).
- Dynamic text up to 200% without clipping.
- Support Hindi at full parity; avoid text in images.
- Haptic/visual cue for countdown thresholds (not sound-only).
- Large-text and high-contrast toggles in Settings.
- Senior-friendly mode: bigger buttons, fewer choices, "Simple plan" view.

## 11. Responsive & device notes
- Target 360×640 minimum; test 320 px width.
- Low-end Android: avoid heavy animation, lazy-load images, WebP, ≤ 120 KB per image.
- One-hand reach: primary actions in lower half of screen.

## 12. Design tokens (CSS)
```css
:root {
  --color-ink: #10252B;
  --color-primary: #0F6B73;
  --color-primary-soft: #E3F0F1;
  --color-surface: #F6F8F8;
  --color-card: #FFFFFF;
  --color-stone: #8C8274;
  --color-accent: #E0A100;
  --color-accent-ink: #5A4200;
  --color-danger: #C23B22;
  --color-success: #2E7D4F;
  --color-warn: #B26A00;
  --color-border: #D5DDDE;

  --radius-control: 10px;
  --radius-card: 14px;
  --radius-sheet: 20px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;

  --font-heading: "Spectral", Georgia, serif;
  --font-body: "Mukta", system-ui, sans-serif;
}
:root[data-theme="dark"], @media (prefers-color-scheme: dark) {
  /* dark tokens per section 2 */
}
```
