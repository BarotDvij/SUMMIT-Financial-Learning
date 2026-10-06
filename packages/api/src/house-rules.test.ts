/**
 * Executable checks for the house rules in AGENTS.md.
 *
 * The DB-backed suites need a migrated Postgres in DATABASE_URL (CI provides
 * one; locally: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`
 * then `pnpm db:migrate`). They are skipped without one, except in CI.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getDb, schema, eq, sql } from '@summit/db';
import { roleEnum } from '@summit/db/schema';
import { ROLES, type Role } from '@summit/schema';
import { beforeAll, describe, expect, it } from 'vitest';

import type { Context, CurrentUser } from './context';
import { appRouter } from './router';

const hasDb = Boolean(process.env.DATABASE_URL);
if (process.env.CI && !hasDb) throw new Error('DATABASE_URL must be set in CI');

const repoRoot = join(import.meta.dirname, '..', '..', '..');
const read = (rel: string) => readFileSync(join(repoRoot, rel), 'utf8');
const ls = (rel: string, ext: RegExp): string[] =>
  readdirSync(join(repoRoot, rel), { recursive: true, encoding: 'utf8' })
    .filter((f) => ext.test(f))
    .map((f) => join(rel, f));

const REJECTED = { code: expect.stringMatching(/^(FORBIDDEN|NOT_FOUND)$/) };

// ---------------------------------------------------------------------------
// Fixtures: two tenants, each with a school, teacher, classroom, admin and a
// consented student. Tenant A also has an unconsented and a withdrawn student.
// ---------------------------------------------------------------------------

const run = Math.random().toString(36).slice(2, 8);
const db = hasDb ? getDb() : (null as never);

function callerFor(user: CurrentUser) {
  const ctx: Context = {
    db,
    auth: { clerkUserId: user.clerkUserId },
    user,
    ipAddress: null,
    userAgent: null,
  };
  return appRouter.createCaller(ctx);
}

async function makeUser(
  organizationId: string,
  role: Role,
  name: string,
  consent: { required: boolean; grantedAt: Date | null } = { required: false, grantedAt: null },
): Promise<CurrentUser> {
  const [u] = await db
    .insert(schema.user)
    .values({
      clerkUserId: `test_${run}_${name}`,
      organizationId,
      role,
      displayName: name,
      consentRequired: consent.required,
      consentGrantedAt: consent.grantedAt,
    })
    .returning();
  if (!u) throw new Error('user insert failed');
  return {
    id: u.id,
    clerkUserId: u.clerkUserId,
    organizationId,
    role,
    displayName: name,
    consentRequired: u.consentRequired,
    consentGrantedAt: u.consentGrantedAt,
  };
}

async function makeTenant(label: string) {
  const [org] = await db
    .insert(schema.organization)
    .values({ kind: 'district', name: `Org ${label}`, slug: `t-${run}-${label}` })
    .returning();
  if (!org) throw new Error('org insert failed');
  const [school] = await db
    .insert(schema.school)
    .values({ organizationId: org.id, name: `School ${label}`, slug: `s-${label}` })
    .returning();
  if (!school) throw new Error('school insert failed');
  const teacher = await makeUser(org.id, 'teacher', `${label}_teacher`);
  const admin = await makeUser(org.id, 'district_admin', `${label}_admin`);
  const student = await makeUser(org.id, 'student', `${label}_student`, {
    required: true,
    grantedAt: new Date(),
  });
  await db.insert(schema.consentRecord).values({
    studentUserId: student.id,
    policyVersion: 'test',
    termsVersion: 'test',
    consentTextHash: '0'.repeat(64),
    method: 'school_provisioned',
    grantedAt: new Date(),
    confirmedAt: new Date(),
  });
  const [classroom] = await db
    .insert(schema.classroom)
    .values({
      organizationId: org.id,
      schoolId: school.id,
      teacherUserId: teacher.id,
      name: `Class ${label}`,
      slug: `c-${label}`,
      joinCode: `${label}${run}`.toUpperCase().slice(0, 6).padEnd(6, 'X'),
    })
    .returning();
  if (!classroom) throw new Error('classroom insert failed');
  await db.insert(schema.enrollment).values({ classroomId: classroom.id, studentUserId: student.id });
  await db.insert(schema.xpEvent).values({
    userId: student.id,
    organizationId: org.id,
    classroomId: classroom.id,
    kind: 'manual_adjust',
    amount: 10,
  });
  return { org, school, teacher, admin, student, classroom };
}

let A: Awaited<ReturnType<typeof makeTenant>>;
let B: Awaited<ReturnType<typeof makeTenant>>;
let unconsented: CurrentUser;
let withdrawn: CurrentUser;
let gameSlug: string;
let lessonId: string;

describe.skipIf(!hasDb)('house rules (database)', () => {
  beforeAll(async () => {
    A = await makeTenant('a');
    B = await makeTenant('b');
    unconsented = await makeUser(A.org.id, 'student', 'a_unconsented', {
      required: true,
      grantedAt: null,
    });
    // Consent was granted, then withdrawn. The user-row mirror is stale on
    // purpose: the gate must read consent_record, not the mirror.
    withdrawn = await makeUser(A.org.id, 'student', 'a_withdrawn', {
      required: true,
      grantedAt: new Date(),
    });
    await db.insert(schema.consentRecord).values({
      studentUserId: withdrawn.id,
      policyVersion: 'test',
      termsVersion: 'test',
      consentTextHash: '0'.repeat(64),
      method: 'school_provisioned',
      grantedAt: new Date(),
      confirmedAt: new Date(),
      withdrawnAt: new Date(),
    });

    const [game] = await db
      .insert(schema.game)
      .values({
        slug: `g-${run}`,
        title: 'Test game',
        summary: 'x',
        tier: 'fundamentals',
        iconKey: 'x',
        bundleUrl: '/x',
      })
      .returning();
    if (!game) throw new Error('game insert failed');
    gameSlug = game.slug;

    const [mod] = await db
      .insert(schema.module)
      .values({ tier: 'fundamentals', slug: `m-${run}`, title: 'Test module', summary: 'x' })
      .returning();
    if (!mod) throw new Error('module insert failed');
    const [lesson] = await db
      .insert(schema.lessonRef)
      .values({
        sanityId: `l-${run}`,
        moduleId: mod.id,
        slug: `l-${run}`,
        title: 'Test lesson',
        publishedAt: new Date(),
      })
      .returning();
    if (!lesson) throw new Error('lesson insert failed');
    lessonId = lesson.id;
  });

  describe('rule 1: tenant isolation', () => {
    it('leaderboard rejects another tenant’s classroom', async () => {
      await expect(
        callerFor(A.student).leaderboard.top({
          scope: { kind: 'classroom', classroomId: B.classroom.id },
        }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('leaderboard rejects another tenant’s organization', async () => {
      await expect(
        callerFor(A.student).leaderboard.top({
          scope: { kind: 'organization', organizationId: B.org.id },
        }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('leaderboard rejects another tenant’s school', async () => {
      await expect(
        callerFor(A.student).leaderboard.top({
          scope: { kind: 'school', schoolId: B.school.id },
        }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('roster rejects another tenant’s classroom', async () => {
      await expect(callerFor(A.teacher).classroom.roster(B.classroom.id)).rejects.toMatchObject(
        REJECTED,
      );
    });

    it('join rejects another tenant’s code', async () => {
      await expect(
        callerFor(A.student).classroom.join({ joinCode: B.classroom.joinCode }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('classroom.create rejects another tenant’s school', async () => {
      await expect(
        callerFor(A.teacher).classroom.create({
          schoolId: B.school.id,
          name: 'Sneaky',
          slug: 'sneaky',
          gradeLabel: null,
        }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('classroom.create ignores a client-supplied organizationId', async () => {
      const created = await callerFor(A.teacher).classroom.create({
        schoolId: A.school.id,
        name: 'Mine',
        slug: `mine-${run}`,
        gradeLabel: null,
        organizationId: B.org.id,
      } as never);
      expect(created.organizationId).toBe(A.org.id);
    });

    it('assignment.create rejects another tenant’s classroom', async () => {
      await expect(
        callerFor(A.teacher).assignment.create({
          classroomId: B.classroom.id,
          title: 'Sneaky',
          instructions: null,
          target: { kind: 'game', gameId: A.classroom.id },
          dueAt: null,
          requiredMinScore: null,
        }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('assignment.forClassroom returns nothing for another tenant', async () => {
      await expect(
        callerFor(A.teacher).assignment.forClassroom(B.classroom.id),
      ).resolves.toEqual([]);
    });

    it('admin.schoolSummary rejects another tenant’s school', async () => {
      await expect(
        callerFor(A.admin).admin.schoolSummary({ schoolId: B.school.id }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('game.start rejects another tenant’s classroom', async () => {
      await expect(
        callerFor(A.student).game.start({ gameSlug, classroomId: B.classroom.id }),
      ).rejects.toMatchObject(REJECTED);
    });

    it('admin views only count the caller’s tenant', async () => {
      const summary = await callerFor(A.admin).admin.districtSummary();
      const [own] = await db
        .select({ n: sql<number>`count(*)::int` })
        .from(schema.classroom)
        .where(eq(schema.classroom.organizationId, A.org.id));
      expect(summary.classroomCount).toBe(own?.n);
    });
  });

  describe('rule 2: roles', () => {
    it('Postgres role enum matches the canonical list', () => {
      expect([...roleEnum.enumValues].sort()).toEqual([...ROLES].sort());
    });
  });

  describe('rule 3: student writes are gated by consent', () => {
    for (const [label, who] of [
      ['unconsented', () => unconsented],
      ['withdrawn', () => withdrawn],
    ] as const) {
      it(`blocks game.start for a ${label} student`, async () => {
        await expect(callerFor(who()).game.start({ gameSlug })).rejects.toMatchObject({
          code: 'FORBIDDEN',
        });
      });

      it(`blocks lesson.complete for a ${label} student`, async () => {
        await expect(callerFor(who()).lesson.complete({ lessonId })).rejects.toMatchObject({
          code: 'FORBIDDEN',
        });
      });
    }

    it('allows a consented student', async () => {
      await expect(callerFor(A.student).game.start({ gameSlug })).resolves.toMatchObject({
        sessionId: expect.any(String),
      });
    });
  });

  describe('rule 4: append-only tables', () => {
    it('Postgres rejects UPDATE on xp_event', async () => {
      await expect(
        db.update(schema.xpEvent).set({ amount: 999 }).where(eq(schema.xpEvent.userId, A.student.id)),
      ).rejects.toThrow(/append-only/);
    });

    it('Postgres rejects UPDATE on audit_log', async () => {
      await expect(
        db.update(schema.auditLog).set({ targetType: 'x' }).where(sql`true`),
      ).rejects.toThrow(/append-only/);
    });
  });
});

// ---------------------------------------------------------------------------
// Static checks: these hold for code paths the DB suite cannot enumerate.
// ---------------------------------------------------------------------------

describe('house rules (static)', () => {
  const routerFiles = ls('packages/api/src/routers', /\.ts$/);

  it('rule 3: every procedure that writes student activity uses studentWritable', () => {
    const studentWrite =
      /awardXp\(|insert\(schema\.(xpEvent|gameSession|assignmentSubmission)\)/;
    const offenders: string[] = [];
    for (const file of routerFiles) {
      // Procedures are the top-level `name: builder` entries of router({...}).
      const parts = read(file).split(/\n {2}(?=\w+: )/);
      for (const part of parts.slice(1)) {
        if (studentWrite.test(part) && !/^\w+: studentWritable\b/.test(part)) {
          offenders.push(`${file}: ${part.split(':')[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('rule 4: no code updates or deletes xp_event / audit_log', () => {
    const files = [
      ...ls('packages/api/src', /\.ts$/),
      ...ls('packages/db/src', /\.ts$/),
      ...ls('apps/web/src', /\.tsx?$/),
    ].filter((f) => !f.endsWith('.test.ts'));
    const offenders = files.filter((f) =>
      /\.(update|delete)\(schema\.(xpEvent|auditLog)\)/.test(read(f)),
    );
    expect(offenders).toEqual([]);
  });

  it('rule 8: client components never import the server env', () => {
    const clientFiles = ls('apps/web/src', /\.tsx?$/).filter((f) =>
      /^['"]use client['"]/m.test(read(f)),
    );
    const offenders = clientFiles.filter((f) => /from ['"]~\/env['"]/.test(read(f)));
    expect(offenders).toEqual([]);
  });
});
