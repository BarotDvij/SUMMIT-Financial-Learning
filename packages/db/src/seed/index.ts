/**
 * Local seed script. Creates a demo district, school, teacher, classroom,
 * three students with parental consent already granted, the Tier-1
 * Compound Interest lesson + Compound Match game, and a few XP events so
 * dashboards have data to render.
 *
 * Idempotent: re-running upserts by slug rather than duplicating rows.
 */

import 'dotenv/config';

import { createHash } from 'node:crypto';

import { getDb, schema, eq } from '../index';

const HASH = (s: string) => createHash('sha256').update(s).digest('hex');

async function main() {
  const db = getDb();

  console.log('Seeding district + school...');
  const [org] = await db
    .insert(schema.organization)
    .values({
      kind: 'district',
      name: 'Waterloo Region District School Board (demo)',
      slug: 'wrdsb-demo',
      country: 'CA',
      region: 'ON',
    })
    .onConflictDoUpdate({ target: schema.organization.slug, set: { name: 'Waterloo Region District School Board (demo)' } })
    .returning();
  if (!org) throw new Error('Failed to upsert organization');

  const [school] = await db
    .insert(schema.school)
    .values({
      organizationId: org.id,
      name: 'Summit Test High School',
      slug: 'summit-test-high',
    })
    .onConflictDoUpdate({ target: [schema.school.organizationId, schema.school.slug], set: { name: 'Summit Test High School' } })
    .returning();
  if (!school) throw new Error('Failed to upsert school');

  console.log('Seeding teacher + students...');
  const [teacher] = await db
    .insert(schema.user)
    .values({
      clerkUserId: 'seed_teacher_demo',
      organizationId: org.id,
      role: 'teacher',
      email: 'teacher@summit.test',
      displayName: 'Ms. Diebolt',
      firstName: 'Jennifer',
      lastName: 'Diebolt',
      consentRequired: false,
    })
    .onConflictDoUpdate({ target: schema.user.clerkUserId, set: { displayName: 'Ms. Diebolt' } })
    .returning();
  if (!teacher) throw new Error('Failed to upsert teacher');

  const students = await Promise.all(
    [
      { clerk: 'seed_student_avery', name: 'Avery K.' },
      { clerk: 'seed_student_jordan', name: 'Jordan M.' },
      { clerk: 'seed_student_priya', name: 'Priya S.' },
    ].map(async ({ clerk, name }) => {
      const [u] = await db
        .insert(schema.user)
        .values({
          clerkUserId: clerk,
          organizationId: org.id,
          role: 'student',
          displayName: name,
          consentRequired: true,
          consentGrantedAt: new Date(),
          grade: '10',
        })
        .onConflictDoUpdate({ target: schema.user.clerkUserId, set: { displayName: name } })
        .returning();
      if (!u) throw new Error(`Failed to upsert student ${clerk}`);

      await db
        .insert(schema.consentRecord)
        .values({
          studentUserId: u.id,
          policyVersion: 'privacy@seed',
          termsVersion: 'terms@seed',
          consentTextHash: HASH('seed-consent-text'),
          method: 'manual_override',
          grantedAt: new Date(),
          confirmedAt: new Date(),
        })
        .onConflictDoNothing();

      return u;
    }),
  );

  console.log('Seeding classroom + enrollments...');
  const [classroom] = await db
    .insert(schema.classroom)
    .values({
      organizationId: org.id,
      schoolId: school.id,
      teacherUserId: teacher.id,
      name: 'Gr 10 Personal Finance (demo)',
      slug: 'gr10-finance-demo',
      gradeLabel: '10',
      joinCode: 'SUMMIT',
    })
    .onConflictDoUpdate({ target: schema.classroom.joinCode, set: { name: 'Gr 10 Personal Finance (demo)' } })
    .returning();
  if (!classroom) throw new Error('Failed to upsert classroom');

  for (const s of students) {
    await db
      .insert(schema.enrollment)
      .values({ classroomId: classroom.id, studentUserId: s.id })
      .onConflictDoNothing();
  }

  console.log('Seeding curriculum + game...');
  const [mod] = await db
    .insert(schema.module)
    .values({
      tier: 'fundamentals',
      slug: 'compound-interest',
      title: 'Compound Interest',
      summary: "The magic of money making money. Tier 1, Module 1.",
      order: 1,
    })
    .onConflictDoUpdate({ target: schema.module.slug, set: { title: 'Compound Interest' } })
    .returning();
  if (!mod) throw new Error('Failed to upsert module');

  await db
    .insert(schema.lessonRef)
    .values({
      sanityId: 'seed-lesson-compound-1',
      moduleId: mod.id,
      slug: 'compound-interest-intro',
      title: 'Why $1 today beats $1 next year',
      estimatedMinutes: 6,
      xpReward: 50,
      gameSlug: 'compound-match',
      publishedAt: new Date(),
      order: 1,
    })
    .onConflictDoUpdate({ target: schema.lessonRef.slug, set: { title: 'Why $1 today beats $1 next year' } });

  await db
    .insert(schema.game)
    .values({
      slug: 'compound-match',
      title: 'Compound Match',
      summary: 'Match starting amounts and growth rates to their future values.',
      tier: 'fundamentals',
      iconKey: 'sprout',
      bundleUrl: '/games/compound-match/index.html',
      sdkVersion: 1,
      capabilities: ['score', 'xp'],
      estimatedMinutes: 4,
      maxXpPerSession: 100,
      enabled: true,
    })
    .onConflictDoUpdate({ target: schema.game.slug, set: { title: 'Compound Match' } });

  console.log('Seeding initial XP events...');
  for (const [i, s] of students.entries()) {
    await db.insert(schema.xpEvent).values({
      userId: s.id,
      organizationId: org.id,
      classroomId: classroom.id,
      kind: 'lesson_complete',
      amount: 30 + i * 10,
      refType: 'lesson',
      reason: 'Seed: completed intro lesson',
    });
  }

  console.log('Seed complete. Join code: SUMMIT');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
