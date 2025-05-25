import * as SecureStore from 'expo-secure-store';

export async function save(key : string, token : string) {
  await SecureStore.setItemAsync(key, token);
}

export async function get(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function remove(key: string) {
  await SecureStore.deleteItemAsync(key);
}