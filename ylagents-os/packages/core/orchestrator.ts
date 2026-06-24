import { localBridge } from '../bridge/localBridge';
import { AgentFS } from '../storage/repository';
import { providerRegistry } from './providers';

export class NativeAgentOrchestrator {
  constructor(private storage: AgentFS) {
    this.registerHandlers();
  }

  private registerHandlers() {
    localBridge.register('api:conversations:create', async (params: any) => {
      const conv = {
        id: params.id || 'conv_' + Date.now(),
        name: params.name || 'New Conversation',
        type: 'native',
        created_at: Date.now(),
        updated_at: Date.now(),
        ...params
      };
      await this.storage.conversations.create(conv);
      return conv;
    });

    localBridge.register('api:conversations:list', async () => {
      return await this.storage.conversations.list();
    });

    localBridge.register('api:conversations:messages', async (params: any) => {
      const { conversation_id, input, role = 'user' } = params;
      const msgId = 'msg_' + Date.now();

      const userMsg = {
        id: msgId,
        conversation_id,
        role,
        content: input,
        type: 'text'
      };

      await this.storage.messages.add(userMsg);
      this.runAgentLoop(conversation_id, input);

      return { msg_id: msgId, status: 'sent' };
    });
  }

  private async runAgentLoop(conversationId: string, input: string) {
    const aiMsgId = 'ai_' + Date.now();

    // 1. Resolve Provider (BYOK)
    const providers = providerRegistry.listProviders();
    const activeProvider = providers.find(p => p.type === 'llm');

    if (!activeProvider) {
      this.emitError(conversationId, aiMsgId, 'Error: No LLM provider configured.');
      return;
    }

    // 2. Resolve Context & Skills (Tier 1 Index)
    const skills = await localBridge.invoke<any[]>('api:skills:list');
    const skillIndex = skills.map(s => `- ${s.name}: ${s.description}`).join('\n');

    // 3. Construct System Prompt (Aionrs pattern)
    const systemPrompt = `You are ylagents-os Native Agent.
Available Skills:
${skillIndex}

To use a skill, output [LOAD_SKILL: name].`;

    // 4. Call LLM
    localBridge.emit('message:stream', {
      conversation_id: conversationId,
      msg_id: aiMsgId,
      content: '',
      status: 'work',
      position: 'left'
    });

    try {
      const client = await activeProvider.createClient({});
      const response = await client.generate(`System: ${systemPrompt}\nUser: ${input}`);

      // 5. Handle Lazy Skill Loading (Tier 2)
      if (response.includes('[LOAD_SKILL:')) {
         // Recursive logic for skill injection would go here
      }

      localBridge.emit('message:stream', {
        conversation_id: conversationId,
        msg_id: aiMsgId,
        content: response,
        status: 'finish'
      });

      await this.storage.messages.add({
        id: aiMsgId,
        conversation_id: conversationId,
        role: 'assistant',
        content: response,
        type: 'text'
      });

    } catch (error: any) {
      this.emitError(conversationId, aiMsgId, 'Orchestration Error: ' + error.message);
    }

    localBridge.emit('turn:completed', {
      conversation_id: conversationId,
      status: 'finished'
    });
  }

  private emitError(convId: string, msgId: string, text: string) {
    localBridge.emit('message:stream', {
      conversation_id: convId,
      msg_id: msgId,
      content: text,
      status: 'error',
      position: 'left'
    });
  }
}
