# PWA Setup (Phase 1)

The web app ships a web manifest and is installable on Chromebooks, iPads,
and Windows tablets. This runbook covers the artifacts to add before going
into a classroom.

## Manifest

`apps/web/src/app/manifest.webmanifest` exists and is referenced from the
root layout's `metadata.manifest`. Theme is the brand green.

## Icons needed

Drop these files under `apps/web/public/brand/`:

- `icon-192.png` — 192 × 192 round/standard
- `icon-512.png` — 512 × 512 standard
- `icon-maskable.png` — 512 × 512 with safe-area padding for Android
- `apple-touch-icon.png` — 180 × 180
- `favicon.ico` — multi-resolution

Generate from `assets/SUMMIT_Learning_Logo-removebg-preview.png` using:

```bash
# any of: realfavicongenerator.net, sharp-cli, or imagemagick
npx --yes sharp-cli resize 512 512 --input ./Branding\ Kit/SUMMIT_Learning_Logo-removebg-preview.png --output ./apps/web/public/brand/icon-512.png
```

## Service worker

Phase 1 ships without a service worker (Next.js App Router + Vercel can do
without one for the install prompt). Add a SW only when offline support is
needed for a specific classroom test.

## Install prompt UX

- Chromebook: kiosk-mode admins can pre-install via Google Admin Console
  using the manifest URL.
- iPad / iPhone: students tap "Share" → "Add to Home Screen".
- Document this in the teacher onboarding video.
