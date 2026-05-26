# Company Formation & Brand Checklist

> Operator: Dvij Barot / Adrit Batra. This is a personal checklist — none of it is legal advice. Most items below should be confirmed with a Canadian small-business lawyer and an accountant before signing any contract with a school board.

## 1. Legal entity

- [ ] Decide structure: sole proprietorship vs. Ontario corporation vs. federal corporation. Recommended for a SaaS that will sign B2B contracts with public bodies: **federal corporation (CBCA)** — name protected Canada-wide, easier interprovincial expansion, more credible for B2B sales.
- [ ] Pre-search a corporate name via [NUANS](https://www.nuans.com/) (e.g. "SUMMIT Financial Learning Inc." / "Summit Learn Inc.").
- [ ] Incorporate federally via [Corporations Canada](https://www.ic.gc.ca/eic/site/cd-dgc.nsf/eng/home).
- [ ] Register an extra-provincial corporation in Ontario.
- [ ] Apply for a CRA business number (BN), GST/HST registration, and a payroll account (only when first employee is hired).
- [ ] Open a business bank account (RBC / TD / EQ / Wealthsimple Business). Get a corporate credit card for SaaS spend.
- [ ] Sign a founders' agreement (vesting schedule, IP assignment, decision rights). Use a template from [Clausehound](https://clausehound.com/) or have a lawyer draft.

## 2. Domain & email

- [ ] Buy `summitlearn.ca` (or chosen alternative) at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) — at-cost pricing.
- [ ] Also grab `.com`, `.io`, and any common typo squats for at-cost via Cloudflare.
- [ ] Set up Google Workspace ($8.40 CAD/user/mo) for `@summitlearn.ca` email and shared drive.
- [ ] Configure DMARC + SPF + DKIM via Cloudflare DNS.

## 3. Trademark (Phase 2+)

- [ ] File a Canadian trademark for the SUMMIT wordmark and logo at [CIPO](https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/eng/home). Estimated cost CAD ~$478 for first class.
- [ ] Consider US trademark via Madrid Protocol once revenue starts.

## 4. Brand assets

- [ ] Move the assets from `../../Branding Kit/` into `apps/web/public/brand/`:
  - `summit-logo.png` — circular green mark
  - `summit-logo-wordmark.png` — full lockup
- [ ] Commission a small icon set + favicon (Fiverr ~CAD 100).
- [ ] Pick a primary brand colour. Logo uses `#1e7c0d` (green). Provisional palette in [BRAND_TOKENS.md](../brand/BRAND_TOKENS.md).

## 5. Insurance (before first paid pilot)

- [ ] Commercial General Liability (CGL).
- [ ] Cyber liability + tech E&O — required by most Ontario school boards for vendor onboarding.
- [ ] Talk to a broker (KASE, Foxquilt) for SaaS-startup-friendly quotes.

## 6. Privacy counsel

See [COUNSEL_SHORTLIST.md](./COUNSEL_SHORTLIST.md).

## 7. Open items / decisions

- [ ] Final company name (working name: **SUMMIT Financial Learning Inc.**)
- [ ] Province of head office (Waterloo, ON)
- [ ] Founder equity split + vesting cliff length
- [ ] Whether to apply to Velocity Incubator at UW (free legal templates, mentorship)
