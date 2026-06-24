import { localBridge } from '../bridge/localBridge';
import { AgentFS } from '../storage/repository';

export class SkillManager {
  constructor(private storage: AgentFS) {
    this.registerHandlers();
  }

  private registerHandlers() {
    localBridge.register('api:skills:list', async () => {
      return await this.storage.db.query('SELECT name, description, tags FROM skills WHERE enabled = 1');
    });

    localBridge.register('api:skills:import', async (params: { content: string }) => {
      // Mock YAML parsing logic
      const content = params.content;
      const nameMatch = content.match(/name:\s*(.*)/);
      const descMatch = content.match(/description:\s*(.*)/);

      const name = nameMatch ? nameMatch[1].trim() : 'Unknown Skill';
      const description = descMatch ? descMatch[1].trim() : '';

      await this.storage.db.execute(
        'INSERT OR REPLACE INTO skills (id, name, description, content, source, enabled) VALUES (?, ?, ?, ?, ?, ?)',
        ['skill_' + Date.now(), name, description, content, 'user', 1]
      );

      return { success: true, name };
    });
  }
}
