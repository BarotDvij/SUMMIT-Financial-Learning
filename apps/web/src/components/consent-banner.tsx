import Link from 'next/link';

export function ConsentBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p>
          A parent or guardian needs to confirm consent before your activity can be saved.
        </p>
        <Link
          href="/consent"
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-500"
        >
          Resolve
        </Link>
      </div>
    </div>
  );
}
