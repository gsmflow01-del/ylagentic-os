import { Preferences } from '@capacitor/preferences';

export interface ISecureStorage {
  setSecret(key: string, value: string): Promise<void>;
  getSecret(key: string): Promise<string | null>;
  removeSecret(key: string): Promise<void>;
}

export class SecureStorage implements ISecureStorage {
  async setSecret(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async getSecret(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async removeSecret(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}
