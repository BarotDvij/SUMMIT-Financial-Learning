import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-summit-sand-50 p-6">
      <SignUp signInUrl="/sign-in" afterSignUpUrl="/dashboard" />
    </main>
  );
}
