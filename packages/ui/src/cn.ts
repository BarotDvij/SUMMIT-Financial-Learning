import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Conditional Tailwind class helper used across web + NativeWind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
