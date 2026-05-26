# Brand Kit

Source logos and identity assets. The originals live one level up in
`../../../Branding Kit/` (the brainstorming workspace). The production app
reads icons from `apps/web/public/brand/`.

## TODO before pilot

- [ ] Move `SUMMIT_Learning_Logo-removebg-preview.png` and
      `SUMMIT_Learning_Logo__1_-removebg-preview.png` into
      `apps/web/public/brand/` and rename.
- [ ] Generate the PWA icon set (see `docs/runbooks/PWA.md`).
- [ ] Generate a 32×32 favicon and a 180×180 Apple touch icon.
- [ ] Commission a flat marketing illustration set (or use Lucide icons for
      Phase 1).

## Tokens

The runtime palette + typography is mirrored in:
- `packages/config/tailwind.config.ts`
- `packages/ui/src/tokens.ts`

See `BRAND_TOKENS.md` for the full spec.
