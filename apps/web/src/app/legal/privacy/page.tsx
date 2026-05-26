import Link from 'next/link';

export const metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-summit-charcoal-500">
        The authoritative version of our privacy policy lives in
        <code className="ml-1 rounded bg-summit-sand-100 px-1.5 py-0.5">docs/legal/PRIVACY_POLICY.md</code>
        until counsel review is complete. Once approved we will render it here from a versioned record.
      </p>
      <p>
        Until then, please review the working draft in the repository or contact
        <a className="summit-link ml-1" href="mailto:privacy@summitlearn.ca">privacy@summitlearn.ca</a>.
      </p>
      <Link href="/" className="summit-link">← Back home</Link>
    </main>
  );
}
