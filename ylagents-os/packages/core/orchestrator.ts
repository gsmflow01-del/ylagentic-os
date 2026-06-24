import { localBridge } from '../bridge/localBridge';
import { AgentFS } from '../storage/repository';
import { providerRegistry } from './providers';

export interface IAgentOrchestrator {
  chat(conversationId: string, message: string): AsyncIterable<any>;
}

export class NativeAgentOrchestrator implements IAgentOrchestrator {
  constructor(private storage: AgentFS) {
    this.registerBridgeHandlers();
  }

  private registerBridgeHandlers() {
    localBridge.register('api:conversations:messages', async (params: any) => {
      return { msg_id: 'local_' + Date.now(), turn_id: 'local_turn' };
    });

    localBridge.register('api:providers', async () => {
      return providerRegistry.listProviders().map(p => ({
        id: p.id,
        type: p.type,
        name: p.name
      }));
    });

    localBridge.register('api:providers:validate', async (params: { id: string, config: any }) => {
      const provider = providerRegistry.getProvider(params.id);
      if (!provider) throw new Error('Provider not found');
      return await provider.validateConfig(params.config);
    });
  }

  async *chat(conversationId: string, message: string): AsyncIterable<any> {
    yield { type: 'text', content: 'Processing message in-process...' };
  }
}
