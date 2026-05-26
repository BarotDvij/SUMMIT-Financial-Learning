/**
 * Strongly-typed PostHog event helpers. Centralising event names here
 * prevents the slow drift you get from sprinkling string literals around.
 */
'use client';

import posthog from 'posthog-js';

type EventName =
  | 'sign_up_completed'
  | 'sign_in_completed'
  | 'classroom_created'
  | 'classroom_joined'
  | 'lesson_opened'
  | 'lesson_completed'
  | 'game_opened'
  | 'game_completed'
  | 'consent_granted'
  | 'consent_withdrawn'
  | 'assignment_created'
  | 'assignment_completed';

type Props = Record<string, string | number | boolean | null | undefined>;

export function track(event: EventName, props: Props = {}) {
  if (typeof window === 'undefined') return;
  posthog.capture(event, props);
}

export function identify(distinctId: string, props: Props = {}) {
  if (typeof window === 'undefined') return;
  posthog.identify(distinctId, props as Record<string, unknown>);
}
