export interface ISkill {
  name: string;
  systemPrompt: string;
  tools: any[];
}

export class SkillResolver {
  async resolveSkills(skillNames: string[]): Promise<ISkill[]> {
    // Loads skills from AgentFS
    return [];
  }

  injectIntoPrompt(basePrompt: string, skills: ISkill[]): string {
    let finalPrompt = basePrompt;
    for (const skill of skills) {
      finalPrompt += `\n\n--- Skill: ${skill.name} ---\n${skill.systemPrompt}`;
    }
    return finalPrompt;
  }
}
