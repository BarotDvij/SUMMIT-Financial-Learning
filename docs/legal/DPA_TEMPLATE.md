# Data Processing Addendum (DPA) — Template

**TEMPLATE — NOT LEGAL ADVICE.** This is a starting point for negotiating a DPA with an Ontario school board. Counsel must finalize the wording, especially Schedule A (data flows) and Schedule B (sub-processors).

This DPA forms part of the Master Services Agreement ("MSA") between **[Board Name]** ("Board") and **SUMMIT Financial Learning Inc.** ("SUMMIT") dated [date].

## 1. Definitions

- "Personal Information" has the meaning given in MFIPPA and PIPEDA.
- "Student Personal Information" means Personal Information about a student processed by SUMMIT under the MSA.
- "Sub-processor" means a third party engaged by SUMMIT to process Student Personal Information.

## 2. Roles

The Board is the institution responsible for Student Personal Information under MFIPPA. SUMMIT acts as a service provider processing Student Personal Information solely on the documented instructions of the Board.

## 3. Permitted purposes

SUMMIT may process Student Personal Information only to:
1. Provide the Service to the Board, its educators, and its students.
2. Maintain the security, integrity, and performance of the Service.
3. Comply with binding legal process, with prior notice to the Board where legally permitted.
4. Aggregate and anonymize data for product improvement, where the result cannot reasonably re-identify any individual.

SUMMIT will not sell Student Personal Information, will not use it for behavioural advertising, and will not use identifiable Student Personal Information to train third-party AI models.

## 4. Confidentiality and personnel

SUMMIT personnel with access to Student Personal Information are bound by written confidentiality obligations and receive privacy and security training at least annually.

## 5. Security measures

SUMMIT will maintain administrative, physical, and technical safeguards including:
- Encryption in transit (TLS 1.2+) and at rest (AES-256 or equivalent).
- Multi-factor authentication on all administrative accounts.
- Role-based access control and least-privilege provisioning.
- Audit logging on access to and modification of Student Personal Information.
- Vulnerability management with quarterly scans and timely patching.
- Annual independent security review (target: SOC 2 Type II by [target date]).

## 6. Sub-processors

SUMMIT may engage Sub-processors listed in **Schedule B**. SUMMIT will:
- Impose data-protection obligations on each Sub-processor that are at least as protective as this DPA.
- Provide the Board with at least [30] days' prior notice of any new or replacement Sub-processor.
- Remain liable for the acts and omissions of its Sub-processors.

## 7. International transfers and data residency

Where the Board requires Canadian data residency, SUMMIT will store Student Personal Information at rest in a Canadian region (currently `aws-ca-central-1`). Transient processing at edge locations outside Canada for purposes of routing and content delivery is permitted only where contractually protected by equivalent safeguards.

## 8. Data subject and access requests

SUMMIT will, without undue delay, assist the Board in responding to requests from data subjects, parents/guardians, or the Information and Privacy Commissioner of Ontario, including access, correction, and deletion requests.

## 9. Incident response

SUMMIT will notify the Board's designated contact within [48] hours of becoming aware of a confirmed security incident affecting Student Personal Information, with information reasonably available at that time, and will cooperate in the Board's incident response.

## 10. Return and deletion

Upon termination of the MSA, SUMMIT will, at the Board's election, return or securely delete all Student Personal Information within [30] days, except where retention is required by law. SUMMIT will certify deletion on request.

## 11. Audit

The Board may, on [30] days' notice and no more than once per year, audit SUMMIT's compliance with this DPA. SOC 2 Type II reports satisfy this requirement where applicable.

## 12. Liability

The liability provisions of the MSA apply to this DPA, except that nothing limits SUMMIT's liability for breaches of confidentiality obligations or gross negligence.

---

## Schedule A — Data processed

| Category | Examples | Purpose |
| --- | --- | --- |
| Identity | Name, email (if provisioned by the Board), school, classroom, grade | Authentication, roster |
| Learning activity | Lesson completions, quiz answers, game scores, XP, badges, time on task | Educational delivery, reports |
| Technical | Device type, browser, truncated IP, session id | Security, performance |
| Communications | Support tickets | Customer support |

## Schedule B — Sub-processors (initial list)

| Sub-processor | Function | Location |
| --- | --- | --- |
| Clerk | Auth | US |
| Neon | Application DB | ca-central-1 once Phase 2 migration complete |
| Vercel | Hosting | Global edge / primary US |
| Sanity | Lesson CMS | EU/US |
| PartyKit | Realtime | Global edge |
| PostHog | Analytics | EU (selected) |
| Sentry | Error monitoring | US |
| Resend | Transactional email | US |
| Stripe | Payments (only for direct payers, not student data) | US/IE |
| Google LLC | Google Classroom roster import (where Board opts in) | US |
| OpenAI/Anthropic (via Vercel AI Gateway) | AI tutor (where Board opts in) | US |
