import { z } from 'zod';

export const OpenAIConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional().default('https://api.openai.com/v1'),
  organization: z.string().optional(),
});

export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;

export interface ILLMProvider {
  generateResponse(prompt: string, options: any): Promise<any>;
  streamResponse(prompt: string, options: any): AsyncIterable<any>;
}
