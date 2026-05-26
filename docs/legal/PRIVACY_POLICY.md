# SUMMIT Financial Learning — Privacy Policy

**TEMPLATE — NOT LEGAL ADVICE.** This draft is a starting point for review by Canadian privacy counsel (see [COUNSEL_SHORTLIST.md](./COUNSEL_SHORTLIST.md)) and must not be published as-is. Square brackets `[ ]` mark items to confirm with counsel.

**Effective date:** [TBD]  
**Last updated:** [TBD]

## 1. Who we are

SUMMIT Financial Learning Inc. ("SUMMIT", "we", "us") operates a gamified financial-literacy platform offered to schools, school boards, students, parents/guardians, and individual learners. Our head office is at [address], Waterloo, Ontario, Canada.

For privacy questions, contact our Privacy Officer: privacy@summitlearn.ca.

## 2. Scope

This Privacy Policy describes how we collect, use, disclose, retain, and protect personal information processed through our website, web application, and mobile applications (collectively, the "Service"). It applies to:

- **Students** (including minors) using the Service through a school or school board.
- **Teachers, administrators, and other educator users** at a school or school board.
- **Parents or legal guardians** who consent on behalf of a student under [13 / 16].
- **Direct individual users** who create accounts outside of a school context.

When SUMMIT processes personal information on behalf of a school or school board, we act as a **service provider** under the Municipal Freedom of Information and Protection of Privacy Act (Ontario) and any applicable Data Processing Addendum signed with the board. The board is the institution responsible for that personal information.

## 3. Personal information we collect

### From students through a school
- Name, grade, school, classroom assignment, district/board affiliation
- Authentication identifiers (Clerk user id, email if provided by the board, single-sign-on identifier)
- Learning activity (lesson completions, quiz answers, game scores, time on task, XP, badges)
- Aggregated device/browser information needed for security and accessibility
- Optional avatar / display name

### From educators
- Name, email, school/board affiliation, role
- Classroom and assignment data they create
- Communications with SUMMIT support

### From parents/guardians
- Name, email, relationship to the student
- Consent records and the version of the consent shown
- Optional payment information if purchasing a paid plan

### From direct individual users
- Name, email, password (managed by Clerk; we never see the cleartext)
- Same learning-activity data as students
- Payment information if subscribing to a paid plan (handled by Stripe; we store only a token and last-4)

### Automatically collected
- Device, operating system, IP address (truncated for analytics), referrer, language preference
- Session and security telemetry necessary to operate the Service
- Error reports (via Sentry, scrubbed of PII)
- Product analytics events (via PostHog) — see Section 8

## 4. How we use personal information

- Provide and improve the Service, including personalized learning paths.
- Authenticate users and enforce role-based access.
- Generate teacher dashboards and aggregate reports for the school/board.
- Communicate with users (transactional emails, security notices, optional product updates).
- Comply with legal obligations.
- Detect and prevent fraud, abuse, and security incidents.

We **do not** use student personal information to:
- Sell or rent personal information to third parties.
- Display behavioural advertising to students.
- Train third-party AI models on identifiable student data.

## 5. Legal basis

For school-mediated accounts, the school/board is responsible for the legal basis (typically the educational mandate under the Education Act). For direct individual users, our basis is the contract you enter into when creating an account, our legitimate interests in operating a safe Service, and your consent for optional uses (e.g. marketing).

## 6. Children

The Service is offered to students under [13 / 16] only through a parent or guardian's verifiable consent, or through a school that has obtained appropriate authorization under MFIPPA and its own privacy and access policies. See [PARENTAL_CONSENT.md](./PARENTAL_CONSENT.md) for the consent flow.

## 7. Sharing and service providers

We share personal information with the following processors, who act under written contracts and are not permitted to use the data for their own purposes:

| Processor | Purpose | Location of processing |
| --- | --- | --- |
| Clerk | Authentication, account management | United States |
| Neon | Primary application database | [Region — start US, migrate to ca-central by Phase 2] |
| Vercel | Hosting, compute, edge | Global edge, primary US |
| Sanity | Lesson content management | EU/US |
| PartyKit | Realtime leaderboards (Phase 2+) | Global edge |
| PostHog | Product analytics | EU or US (configurable) |
| Sentry | Error monitoring | US |
| Resend | Transactional email | US |
| Stripe | Payment processing (paid plans only) | US/Ireland |
| Google | Optional Google Classroom roster sync | US |
| OpenAI / Anthropic (via Vercel AI Gateway) | AI tutor (Phase 3+, opt-in) | US |

A current list is available on request.

## 8. International transfers

Some processors store data in the United States. We use contractual safeguards (e.g. the EU SCCs by reference, equivalent commitments under PIPEDA) and assess each transfer on a regular basis. **Where required by a school board contract, we will commit to Canadian-region storage of student personal information.**

## 9. Retention

- Student activity data is retained while the student is enrolled in a participating classroom plus [12 / 24] months unless the board instructs us otherwise.
- Account data is deleted within [30] days of account closure unless retention is required by law.
- Audit logs are retained for [1] year for security purposes.

## 10. Your rights

Subject to law, you may:
- Request access to your personal information.
- Request correction of inaccurate data.
- Withdraw consent and close your account.
- Request export of your data in a portable format.
- File a complaint with the [Office of the Privacy Commissioner of Canada](https://www.priv.gc.ca/) or the [Information and Privacy Commissioner of Ontario](https://www.ipc.on.ca/).

For school-mediated accounts, please direct requests to your school first, since the board is the institution that holds your information.

## 11. Security

We use industry-standard administrative, physical, and technical safeguards including encryption in transit, encryption at rest, MFA on administrative access, role-based access control, audit logging, and routine vulnerability scanning. No system is perfectly secure; we will notify affected users and the relevant regulator of any material incident as required by law.

## 12. Changes

We will post material changes to this policy at this URL and notify users by email or in-app banner at least [30] days before they take effect for active users.

## 13. Contact

privacy@summitlearn.ca
SUMMIT Financial Learning Inc.
[address], Waterloo, Ontario, Canada
