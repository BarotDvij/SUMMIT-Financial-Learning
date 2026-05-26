import { Card } from '@summit/ui/web';

export const metadata = { title: 'Parental consent' };

export default function ConsentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">Parental / guardian consent</h1>
        <p className="text-sm text-summit-charcoal-500">
          For Phase 1 this page collects the parent/guardian's email and sends a confirmation
          link. The actual form ships with the consent record schema and double opt-in flow
          described in <code>docs/legal/PARENTAL_CONSENT.md</code>.
        </p>
        <p className="text-sm text-summit-charcoal-500">
          Until that ships, contact{' '}
          <a className="summit-link" href="mailto:privacy@summitlearn.ca">
            privacy@summitlearn.ca
          </a>{' '}
          to grant consent manually.
        </p>
      </Card>
    </div>
  );
}
