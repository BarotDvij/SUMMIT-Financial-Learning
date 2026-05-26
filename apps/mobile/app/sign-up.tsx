import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View className="flex-1 justify-center bg-summit-sand-50 p-6">
      <Text className="mb-4 text-2xl font-semibold">Create account</Text>
      <Text className="mb-4 text-summit-charcoal-500">
        Phase 1: open the web app at <Text className="font-mono">app.summitlearn.ca</Text> to
        create your account, then sign in here. Native sign-up flow ships after the school pilot.
      </Text>
      <Link href="/sign-in" asChild>
        <Pressable className="rounded-2xl bg-summit-green-700 px-5 py-3">
          <Text className="text-center font-semibold text-white">I already have an account</Text>
        </Pressable>
      </Link>
    </View>
  );
}
