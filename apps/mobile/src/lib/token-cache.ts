import * as SecureStore from 'expo-secure-store';

/** Clerk-compatible token cache backed by the OS secure store. */
export const tokenCache = {
  async getToken(key: string) {
    try {
      return (await SecureStore.getItemAsync(key)) ?? null;
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore
    }
  },
};
