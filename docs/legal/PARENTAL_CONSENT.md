# Parental / Guardian Consent — Flow and Wording

**TEMPLATE — NOT LEGAL ADVICE.** Get this reviewed by counsel before showing to a real parent.

## When consent is required

| Path to SUMMIT | Consent collected by | When |
| --- | --- | --- |
| Through a participating school/board | The school or the board, under MFIPPA and its own policies | Before student account is created |
| Direct (parent/guardian buys subscription for their child) | SUMMIT, from the parent/guardian | Before student account is created |
| Direct (learner age >= 16) | SUMMIT, from the learner | At signup |

We follow the **stricter** of (a) the law in the user's province and (b) the school/board's own policy. The default working threshold for SUMMIT direct accounts is **16**, the age at which Quebec's Law 25 requires explicit consent from the individual rather than from a parent for minors using digital services.

## Direct-signup consent flow (Phase 1+)

1. Parent enters their child's information (first name, age, grade, optional avatar).
2. Parent reads a plain-language Notice of Collection (text below).
3. Parent ticks two distinct boxes (no pre-ticking):
   - "I am the parent or legal guardian of this child and I consent to SUMMIT creating an account for them on the terms above."
   - "I have read the [Privacy Policy](PRIVACY_POLICY.md) and [Terms of Service](TERMS_OF_SERVICE.md)."
4. Parent confirms by email (double opt-in) with a single-use link valid for 24 hours.
5. SUMMIT stores a `consent_record` row pinned to the exact version of the privacy policy and terms shown.
6. The child's account is created in a "consented" state and writes are unlocked.

If consent is withdrawn (a one-click action in the parent dashboard), the child's account is paused, all writes are blocked, and a 30-day deletion timer starts unless the parent reverses the withdrawal.

## Plain-language Notice of Collection (parent-facing)

> ### What SUMMIT collects about your child
>
> - Their first name, grade, and school (if any).
> - The lessons they finish and the answers they give in our learning games.
> - Basic technical info we need to keep the app secure (like the kind of device they're using).
>
> ### Why we collect it
>
> - To run the learning activities and track your child's progress.
> - To show you and (if they're enrolled in a school program) their teacher how they're doing.
> - To make the app work properly and keep it safe.
>
> ### What we **don't** do
>
> - We don't sell your child's information.
> - We don't show your child ads from other companies.
> - We don't use your child's identifiable answers to train other companies' AI.
>
> ### Your controls
>
> - You can see what we have, ask us to fix it, or delete it at any time from your parent dashboard or by emailing privacy@summitlearn.ca.
> - You can withdraw your consent anytime. We'll pause your child's account immediately and delete the data within 30 days.

## Audit fields (in `consent_record` table)

- `id`
- `student_user_id`
- `parent_user_id`
- `policy_version` (e.g. `privacy@2026-06-01`)
- `terms_version`
- `consent_text_hash` (SHA-256 of the exact wording shown)
- `ip_address` (truncated)
- `user_agent`
- `granted_at`
- `confirmed_at` (email confirmation)
- `withdrawn_at`
- `method` (`direct_signup` | `school_provisioned` | `oneroster_csv`)
