import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-summit-sand-50 p-6">
      <SignIn signUpUrl="/sign-up" afterSignInUrl="/dashboard" />
    </main>
  );
}
