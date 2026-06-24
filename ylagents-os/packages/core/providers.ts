import { z } from 'zod';

export interface IProvider {
  id: string;
  type: string;
  name: string;
  configSchema: z.ZodSchema<any>;
  validateConfig(config: any): Promise<{ success: boolean; error?: string }>;
  createClient(config: any): Promise<any>;
}

export class ProviderRegistry {
  private providers: Map<string, IProvider> = new Map();

  register(provider: IProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string) {
    return this.providers.get(id);
  }

  listProviders() {
    return Array.from(this.providers.values());
  }
}

export const providerRegistry = new ProviderRegistry();
