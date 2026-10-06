-- AGENTS.md rule 4: xp_event and audit_log are append-only.
-- UPDATE is rejected outright. DELETE is left to cascades from user/organization
-- deletion (privacy erasure requests); app code must never issue it, which the
-- static check in packages/api/src/house-rules.test.ts enforces.
CREATE FUNCTION reject_update_append_only() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER xp_event_append_only BEFORE UPDATE ON xp_event
  FOR EACH ROW EXECUTE FUNCTION reject_update_append_only();
--> statement-breakpoint
CREATE TRIGGER audit_log_append_only BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION reject_update_append_only();
