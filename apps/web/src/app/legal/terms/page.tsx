import Link from 'next/link';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>
      <p className="text-summit-charcoal-500">
        The working draft lives in
        <code className="ml-1 rounded bg-summit-sand-100 px-1.5 py-0.5">docs/legal/TERMS_OF_SERVICE.md</code>.
        This page renders the final, counsel-approved version after Phase 0.
      </p>
      <Link href="/" className="summit-link">← Back home</Link>
    </main>
  );
}
