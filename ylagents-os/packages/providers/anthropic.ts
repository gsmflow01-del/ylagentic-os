import { z } from 'zod';
import { IProvider } from '../core/providers';

export const AnthropicConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional().default('https://api.anthropic.com/v1'),
  model: z.string().default('claude-3-5-sonnet-latest'),
});

export class AnthropicProvider implements IProvider {
  id = 'anthropic';
  type = 'llm';
  name = 'Anthropic';
  configSchema = AnthropicConfigSchema;

  async validateConfig(config: any) {
    return { success: true };
  }

  async createClient(config: any) {
    return {
      generate: async (prompt: string) => {
        return 'Anthropic Response';
      }
    };
  }
}
