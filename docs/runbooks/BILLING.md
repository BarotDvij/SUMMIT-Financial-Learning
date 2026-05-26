# Billing (Phase 3)

Two paths: self-serve via Stripe Checkout, and B2B district invoicing.

## Self-serve (teachers + parents)

- Plan: `summit-classroom` — $19 CAD/mo or $190 CAD/yr per classroom of
  up to 35 students.
- Plan: `summit-parent` — $9 CAD/mo per child.

Implementation:
1. Add a Stripe product in test mode.
2. `billing.startCheckout` (in `packages/api/src/routers/billing.ts`)
   creates a Stripe Checkout Session with `metadata.organizationId`.
3. Webhook at `/api/webhooks/stripe` listens for
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Each updates the `subscription` row.
4. UI surfaces upgrade prompt when free-tier limits hit.

## District (invoicing)

- Tier: `summit-district` — annual contract, per-school seat-tier pricing.
- Process:
  1. Sales conversation with district lead.
  2. Statement of Work + signed MSA + DPA.
  3. SUMMIT issues a manual invoice in Stripe (or by PDF if their AP needs
     paper). Net-30.
  4. On payment, district status flips to `active` and seats are loaded
     via OneRoster import (see `SSO_SIS.md`).
  5. Annual renewals are calendared 90 days before expiry.

## Refund policy

Pro-rated within first 30 days of the initial term. After that, refunds at
SUMMIT's discretion.

## Accounting

- Use Stripe Tax for GST/HST.
- Sync to Xero via the official integration once revenue > $5k/mo.
