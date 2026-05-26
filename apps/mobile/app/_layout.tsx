import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '../src/lib/token-cache';
import { TRPCProvider } from '../src/lib/trpc';
import '../global.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local or EAS secrets.',
    );
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <TRPCProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TRPCProvider>
    </ClerkProvider>
  );
}
