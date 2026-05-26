import { Link, Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';

export default function Home() {
  return (
    <>
      <SignedIn>
        <Redirect href="/dashboard" />
      </SignedIn>
      <SignedOut>
        <ScrollView contentContainerClassName="flex-1 bg-summit-sand-50 p-6 justify-center">
          <View className="space-y-4">
            <Text className="text-3xl font-semibold text-summit-charcoal-900">SUMMIT</Text>
            <Text className="text-base text-summit-charcoal-500">
              Gamified financial literacy for Canadian classrooms.
            </Text>
            <Link href="/sign-in" asChild>
              <Pressable className="rounded-2xl bg-summit-green-700 px-5 py-3">
                <Text className="text-center font-semibold text-white">Sign in</Text>
              </Pressable>
            </Link>
            <Link href="/sign-up" asChild>
              <Pressable className="rounded-2xl bg-summit-sand-100 px-5 py-3">
                <Text className="text-center font-semibold text-summit-charcoal-900">
                  Create account
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </SignedOut>
    </>
  );
}
