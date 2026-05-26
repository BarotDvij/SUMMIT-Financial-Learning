/**
 * Tailwind-flavoured primitives consumed by `apps/web`. Native equivalents
 * live in `src/native`. Both wrap the same tokens.
 */
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-summit-green-700 text-white hover:bg-summit-green-600 active:bg-summit-green-800',
  secondary:
    'bg-summit-sand-100 text-summit-charcoal-900 hover:bg-summit-sand-200 active:bg-summit-sand-300',
  ghost: 'bg-transparent text-summit-charcoal-700 hover:bg-summit-sand-100',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  leading?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', leading, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-summit-green-500',
        'disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-5 py-3 text-lg',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
    </button>
  );
});

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-summit-sand-200 bg-white p-5 shadow-soft',
        className,
      )}
      {...rest}
    />
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-xl bg-summit-sand-50 p-4">
      <div className="text-xs uppercase tracking-wide text-summit-charcoal-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-summit-charcoal-900">{value}</div>
      {hint ? <div className="mt-1 text-sm text-summit-charcoal-500">{hint}</div> : null}
    </div>
  );
}

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'amber' | 'sky' }) {
  const tones: Record<string, string> = {
    green: 'bg-summit-green-100 text-summit-green-800',
    amber: 'bg-amber-100 text-amber-800',
    sky: 'bg-sky-100 text-sky-800',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}
