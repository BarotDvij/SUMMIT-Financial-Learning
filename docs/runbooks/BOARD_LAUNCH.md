# Board-Ready Launch Checklist (Phase 3)

Use this gate before signing the first board contract.

## Legal + privacy

- [ ] Counsel-approved Privacy Policy + ToS published.
- [ ] DPA template reviewed by board legal; negotiated version signed.
- [ ] Privacy Impact Assessment (PIA) completed with board.
- [ ] Sub-processor list current and shared.
- [ ] Records of Processing Activities (ROPA) maintained.
- [ ] Data-residency: Neon prod in `aws-ca-central-1`; verified by board.

## Security baseline

- [ ] All admin accounts have MFA enforced (Clerk org policy).
- [ ] Audit log enabled and reviewable in Admin → "Recent activity".
- [ ] Annual security review or SOC 2 Type II in progress.
- [ ] Sentry alerts route to on-call.
- [ ] Quarterly vulnerability scan on the web app.
- [ ] Penetration test scheduled before first paying district.
- [ ] Documented incident response runbook.
- [ ] Bug bounty / responsible disclosure page live at `/security`.

## Account lifecycle

- [ ] Self-serve account deletion (parent dashboard + direct account).
- [ ] Self-serve data export in JSON, scoped to a single user.
- [ ] Documented retention policy (12 months post-enrollment).
- [ ] Documented withdrawal-of-consent flow with 30-day deletion timer.

## Identity + access

- [ ] Clerk Enterprise SSO configured for the board.
- [ ] OneRoster v1.2 CSV import tested with sample data.
- [ ] Role enum gated end-to-end (super_admin → student).
- [ ] District-admin dashboard tested with read-only credentials.

## Billing

- [ ] Stripe Billing live in prod (self-serve).
- [ ] District invoicing flow tested with a fake PO.
- [ ] Refund / cancellation policy reviewed.

## Accessibility

- [ ] WCAG 2.1 AA audit by a third party.
- [ ] Keyboard-only path through every screen.
- [ ] Screen reader pass on dashboard, lesson, leaderboard.
- [ ] High-contrast mode tested.
- [ ] Closed captions on any video lessons.

## Operational readiness

- [ ] Status page (e.g. status.summitlearn.ca).
- [ ] Pager rotation defined.
- [ ] Runbook for "DB read-only" + "Clerk outage" + "Vercel outage".
- [ ] Monthly board admin newsletter template.

## Communications

- [ ] Teacher onboarding video (5 min).
- [ ] Parent FAQ page.
- [ ] Board IT contact + escalation path documented.
