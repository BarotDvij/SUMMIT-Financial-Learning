# Summary

<!-- 1-3 bullets on what changed and why. -->

# Compliance checklist

- [ ] No new path that writes student data without going through `studentWritable`.
- [ ] No new tenant-scoped query without filtering by `organizationId`.
- [ ] No `xp_event` or `audit_log` row mutated or deleted.
- [ ] Accessibility: keyboard path + visible focus state for every new interactive element.
- [ ] Privacy: any new vendor processing student PII is added to `docs/legal/PRIVACY_POLICY.md` and `DPA_TEMPLATE.md`.

# Screens / proof
