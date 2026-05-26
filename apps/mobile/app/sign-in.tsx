import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!isLoaded) return;
    try {
      const attempt = await signIn.create({ identifier, password });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/dashboard');
      } else {
        setError('Additional steps required. Open the web app to finish sign in.');
      }
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Sign in failed');
    }
  }

  return (
    <View className="flex-1 justify-center bg-summit-sand-50 p-6">
      <Text className="mb-4 text-2xl font-semibold">Sign in</Text>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Email or username"
        autoCapitalize="none"
        keyboardType="email-address"
        className="mb-3 rounded-xl border border-summit-sand-200 bg-white px-3 py-3"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="mb-3 rounded-xl border border-summit-sand-200 bg-white px-3 py-3"
      />
      {error ? <Text className="mb-3 text-red-600">{error}</Text> : null}
      <Pressable onPress={onSubmit} className="rounded-2xl bg-summit-green-700 px-5 py-3">
        <Text className="text-center font-semibold text-white">Sign in</Text>
      </Pressable>
    </View>
  );
}
