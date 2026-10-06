CREATE TYPE "public"."assignment_target_kind" AS ENUM('lesson', 'game');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'access', 'export', 'grant_consent', 'withdraw_consent', 'role_change');--> statement-breakpoint
CREATE TYPE "public"."consent_method" AS ENUM('direct_signup', 'school_provisioned', 'oneroster_csv', 'google_classroom', 'manual_override');--> statement-breakpoint
CREATE TYPE "public"."organization_kind" AS ENUM('district', 'independent_school', 'direct_consumer');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('super_admin', 'district_admin', 'school_admin', 'teacher', 'parent', 'student');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('fundamentals', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."xp_event_kind" AS ENUM('lesson_complete', 'game_complete', 'streak_bonus', 'badge_unlocked', 'manual_adjust');--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "organization_kind" NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"country" char(2) DEFAULT 'CA' NOT NULL,
	"region" varchar(8) DEFAULT 'ON' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"external_school_id" varchar(64),
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_student_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_user_id" uuid NOT NULL,
	"student_user_id" uuid NOT NULL,
	"relationship" varchar(16) DEFAULT 'parent' NOT NULL,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(128) NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"email" varchar(320),
	"display_name" varchar(120) NOT NULL,
	"first_name" varchar(120),
	"last_name" varchar(120),
	"avatar_url" text,
	"grade" varchar(8),
	"consent_required" boolean DEFAULT false NOT NULL,
	"consent_granted_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_user_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"grade_label" varchar(32),
	"join_code" varchar(6) NOT NULL,
	"join_code_expires_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classroom_id" uuid NOT NULL,
	"student_user_id" uuid NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_user_id" uuid NOT NULL,
	"parent_user_id" uuid,
	"policy_version" varchar(64) NOT NULL,
	"terms_version" varchar(64) NOT NULL,
	"consent_text_hash" char(64) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"method" "consent_method" NOT NULL,
	"granted_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"withdrawn_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_ref" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sanity_id" varchar(64) NOT NULL,
	"module_id" uuid NOT NULL,
	"slug" varchar(64) NOT NULL,
	"title" varchar(200) NOT NULL,
	"estimated_minutes" integer DEFAULT 5 NOT NULL,
	"xp_reward" integer DEFAULT 50 NOT NULL,
	"game_slug" varchar(64),
	"published_at" timestamp with time zone,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "tier" NOT NULL,
	"slug" varchar(64) NOT NULL,
	"title" varchar(200) NOT NULL,
	"summary" varchar(500) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"title" varchar(120) NOT NULL,
	"summary" varchar(500) NOT NULL,
	"tier" "tier" NOT NULL,
	"icon_key" varchar(64) NOT NULL,
	"bundle_url" text NOT NULL,
	"sdk_version" integer DEFAULT 1 NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_minutes" integer DEFAULT 5 NOT NULL,
	"max_xp_per_session" integer DEFAULT 100 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"classroom_id" uuid,
	"game_id" uuid NOT NULL,
	"game_slug" varchar(64) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" varchar(500) NOT NULL,
	"icon_key" varchar(64) NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xp_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"classroom_id" uuid,
	"kind" "xp_event_kind" NOT NULL,
	"amount" integer NOT NULL,
	"ref_type" varchar(24),
	"ref_id" uuid,
	"reason" varchar(280),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"classroom_id" uuid NOT NULL,
	"teacher_user_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"instructions" text,
	"target_kind" "assignment_target_kind" NOT NULL,
	"target_ref_id" uuid NOT NULL,
	"due_at" timestamp with time zone,
	"required_min_score" integer,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignment_submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_user_id" uuid NOT NULL,
	"completed_at" timestamp with time zone,
	"score" integer,
	"ref_game_session_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"stripe_invoice_id" varchar(64),
	"amount_cents" integer NOT NULL,
	"currency" varchar(8) DEFAULT 'cad' NOT NULL,
	"status" varchar(32) DEFAULT 'draft' NOT NULL,
	"issued_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"stripe_customer_id" varchar(64),
	"stripe_subscription_id" varchar(64),
	"plan" varchar(64) NOT NULL,
	"seats" integer DEFAULT 30 NOT NULL,
	"status" "subscription_status" DEFAULT 'trialing' NOT NULL,
	"current_period_end" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"actor_user_id" uuid,
	"action" "audit_action" NOT NULL,
	"target_type" varchar(64) NOT NULL,
	"target_id" uuid,
	"diff" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "school" ADD CONSTRAINT "school_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_student_link" ADD CONSTRAINT "parent_student_link_parent_user_id_user_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_student_link" ADD CONSTRAINT "parent_student_link_student_user_id_user_id_fk" FOREIGN KEY ("student_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_teacher_user_id_user_id_fk" FOREIGN KEY ("teacher_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_user_id_user_id_fk" FOREIGN KEY ("student_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_record" ADD CONSTRAINT "consent_record_student_user_id_user_id_fk" FOREIGN KEY ("student_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_record" ADD CONSTRAINT "consent_record_parent_user_id_user_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_ref" ADD CONSTRAINT "lesson_ref_module_id_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_badge_id_badge_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badge"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_event" ADD CONSTRAINT "xp_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_event" ADD CONSTRAINT "xp_event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_event" ADD CONSTRAINT "xp_event_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_teacher_user_id_user_id_fk" FOREIGN KEY ("teacher_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submission" ADD CONSTRAINT "assignment_submission_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submission" ADD CONSTRAINT "assignment_submission_student_user_id_user_id_fk" FOREIGN KEY ("student_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submission" ADD CONSTRAINT "assignment_submission_ref_game_session_id_game_session_id_fk" FOREIGN KEY ("ref_game_session_id") REFERENCES "public"."game_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "organization_kind_idx" ON "organization" USING btree ("kind");--> statement-breakpoint
CREATE UNIQUE INDEX "school_slug_in_org_idx" ON "school" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "school_org_idx" ON "school" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "parent_student_pair_idx" ON "parent_student_link" USING btree ("parent_user_id","student_user_id");--> statement-breakpoint
CREATE INDEX "parent_student_student_idx" ON "parent_student_link" USING btree ("student_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_clerk_user_id_idx" ON "user" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "user_org_role_idx" ON "user" USING btree ("organization_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_in_org_idx" ON "user" USING btree ("organization_id","email") WHERE "user"."email" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "classroom_join_code_idx" ON "classroom" USING btree ("join_code");--> statement-breakpoint
CREATE INDEX "classroom_school_idx" ON "classroom" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "classroom_teacher_idx" ON "classroom" USING btree ("teacher_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_pair_idx" ON "enrollment" USING btree ("classroom_id","student_user_id");--> statement-breakpoint
CREATE INDEX "enrollment_student_idx" ON "enrollment" USING btree ("student_user_id");--> statement-breakpoint
CREATE INDEX "consent_student_idx" ON "consent_record" USING btree ("student_user_id");--> statement-breakpoint
CREATE INDEX "consent_active_idx" ON "consent_record" USING btree ("student_user_id","withdrawn_at");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_sanity_idx" ON "lesson_ref" USING btree ("sanity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_slug_idx" ON "lesson_ref" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "lesson_module_order_idx" ON "lesson_ref" USING btree ("module_id","order");--> statement-breakpoint
CREATE UNIQUE INDEX "module_slug_idx" ON "module" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "module_tier_order_idx" ON "module" USING btree ("tier","order");--> statement-breakpoint
CREATE UNIQUE INDEX "game_slug_idx" ON "game" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "game_enabled_idx" ON "game" USING btree ("enabled");--> statement-breakpoint
CREATE INDEX "game_session_user_idx" ON "game_session" USING btree ("user_id","completed_at");--> statement-breakpoint
CREATE INDEX "game_session_classroom_idx" ON "game_session" USING btree ("classroom_id","completed_at");--> statement-breakpoint
CREATE INDEX "game_session_game_idx" ON "game_session" USING btree ("game_id","completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "achievement_pair_idx" ON "achievement" USING btree ("user_id","badge_id");--> statement-breakpoint
CREATE UNIQUE INDEX "badge_slug_idx" ON "badge" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "xp_event_user_time_idx" ON "xp_event" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "xp_event_classroom_time_idx" ON "xp_event" USING btree ("classroom_id","created_at");--> statement-breakpoint
CREATE INDEX "xp_event_org_time_idx" ON "xp_event" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "assignment_classroom_idx" ON "assignment" USING btree ("classroom_id");--> statement-breakpoint
CREATE INDEX "assignment_due_idx" ON "assignment" USING btree ("due_at");--> statement-breakpoint
CREATE UNIQUE INDEX "assignment_submission_pair_idx" ON "assignment_submission" USING btree ("assignment_id","student_user_id");--> statement-breakpoint
CREATE INDEX "invoice_org_idx" ON "invoice" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscription_org_idx" ON "subscription" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_stripe_sub_idx" ON "subscription" USING btree ("stripe_subscription_id") WHERE "subscription"."stripe_subscription_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "audit_org_time_idx" ON "audit_log" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_target_idx" ON "audit_log" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "audit_actor_time_idx" ON "audit_log" USING btree ("actor_user_id","created_at");