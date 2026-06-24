import { localBridge } from '../bridge/localBridge';

export interface ISkill {
  name: string;
  version: string;
  systemPrompt: string;
  tools: any[];
}

export class SkillResolver {
  constructor() {
    this.registerBridgeHandlers();
  }

  private registerBridgeHandlers() {
    localBridge.register('api:skills:list', async () => {
      return [];
    });

    localBridge.register('api:skills:import', async (params: { source: string }) => {
      console.log('Importing skill from', params.source);
      return { success: true };
    });
  }

  injectIntoPrompt(basePrompt: string, skills: ISkill[]): string {
    let finalPrompt = basePrompt;
    for (const skill of skills) {
      finalPrompt += `\n\n--- Skill: ${skill.name} v${skill.version} ---\n${skill.systemPrompt}`;
    }
    return finalPrompt;
  }
}
