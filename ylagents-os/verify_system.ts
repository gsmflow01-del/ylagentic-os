import { localBridge } from './packages/bridge/localBridge';
import { AgentFS } from './packages/storage/repository';
import { BetterSqlite3Adapter } from './packages/storage/adapter';
import { NativeAgentOrchestrator } from './packages/core/orchestrator';
import { providerRegistry } from './packages/core/providers';
import { OpenAIProvider } from './packages/providers/openai';

async function verify() {
  console.log('--- System Verification Start ---');

  // 1. Setup Storage
  const adapter = new BetterSqlite3Adapter(':memory:');
  const storage = new AgentFS(adapter);
  await storage.initialize();

  // 2. Setup Orchestrator & Providers
  const orchestrator = new NativeAgentOrchestrator(storage);
  providerRegistry.register(new OpenAIProvider());

  // 3. Listen for stream
  localBridge.on('message:stream', (data) => {
    console.log('[STREAM]', data.msg_id, data.content || data.status);
  });

  // 4. Simulate UI Interaction
  console.log('Simulating conversation create...');
  const conv = await localBridge.invoke<any>('api:conversations:create', { name: 'Test' });

  console.log('Simulating user message...');
  await localBridge.invoke('api:conversations:messages', {
    conversation_id: conv.id,
    input: 'Hello ylagents!'
  });

  // Wait for background orchestrator
  await new Promise(r => setTimeout(r, 500));

  // 5. Verify Persistence
  const messages = await storage.messages.getByConversationId(conv.id);
  console.log('Persisted Messages Count:', messages.length);
  messages.forEach(m => console.log(` - ${m.role}: ${m.content}`));

  console.log('--- System Verification End ---');
}

verify().catch(console.error);
