import { Link, Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';

export default function Dashboard() {
  return (
    <>
      <SignedOut>
        <Redirect href="/" />
      </SignedOut>
      <SignedIn>
        <DashboardBody />
      </SignedIn>
    </>
  );
}

function DashboardBody() {
  const { user } = useUser();
  return (
    <ScrollView contentContainerClassName="flex-1 bg-summit-sand-50 p-6">
      <Text className="text-2xl font-semibold text-summit-charcoal-900">
        Hi, {user?.firstName ?? 'learner'}.
      </Text>
      <Text className="mt-1 text-summit-charcoal-500">
        Pick a game to start. Lessons coming soon on mobile.
      </Text>
      <View className="mt-6 space-y-3">
        <Link href="/play/compound-match" asChild>
          <Pressable className="rounded-2xl bg-white p-5 shadow-sm">
            <Text className="text-lg font-semibold">Compound Match</Text>
            <Text className="text-summit-charcoal-500">4 min · 100 XP max</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
