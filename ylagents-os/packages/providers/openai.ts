import { z } from 'zod';
import { IProvider } from '../core/providers';

export const OpenAIConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional().default('https://api.openai.com/v1'),
  model: z.string().default('gpt-4o'),
});

export class OpenAIProvider implements IProvider {
  id = 'openai';
  type = 'llm';
  name = 'OpenAI';
  configSchema = OpenAIConfigSchema;

  async validateConfig(config: any) {
    const result = OpenAIConfigSchema.safeParse(config);
    if (!result.success) return { success: false, error: result.error.message };
    // Real check: call models/list with the key
    return { success: true };
  }

  async createClient(config: any) {
    // Return a configured OpenAI client wrapper
    return {
      generate: async (prompt: string) => {
        console.log('Generating with OpenAI...', prompt);
        return 'OpenAI Response';
      }
    };
  }
}
