# SUMMIT Brand Tokens (provisional)

Logo assets live in `apps/web/public/brand/` once copied from `../Branding Kit/`.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `summit/green-700` | `#1e7c0d` | Primary (matches the existing logo) |
| `summit/green-600` | `#2e9418` | Hover/active |
| `summit/green-100` | `#e7f5e1` | Tinted surfaces |
| `summit/charcoal-900` | `#0c0f0a` | Primary text |
| `summit/charcoal-500` | `#5b6256` | Secondary text |
| `summit/sand-50` | `#fbfaf6` | App background |
| `summit/sand-200` | `#ece9dd` | Card border |
| `summit/sky-500` | `#2563eb` | Info / links |
| `summit/amber-500` | `#f59e0b` | XP / streak accents |
| `summit/red-500` | `#dc2626` | Errors |

These are mirrored in `packages/ui/tokens.ts` and consumed by Tailwind on web and NativeWind on mobile.

## Typography

- Display & UI: **Inter** (variable). Free via Google Fonts and Fontsource.
- Numerals on leaderboards: **Inter** with `font-variant-numeric: tabular-nums`.
- Reserve a custom display face for marketing only — not in product.

## Voice

- Direct, warm, never condescending. Teens detect "kid voice" instantly.
- Concrete numbers over abstractions. "Save $25/month for 10 years" beats "save consistently."
- Canadian English (cheque, behaviour, organisation is fine too).
- No exclamation marks in error or destructive flows.

## Iconography

- Lucide icons for the UI layer.
- Custom illustrations only for celebratory moments (XP gains, badge unlocks).
