export interface IAgentOrchestrator {
  chat(conversationId: string, message: string): AsyncIterable<any>;
}

export class NativeAgentOrchestrator implements IAgentOrchestrator {
  async *chat(conversationId: string, message: string): AsyncIterable<any> {
    // 1. Load conversation context from AgentFS
    // 2. Resolve active skills and tools
    // 3. Construct prompt
    // 4. Call LLM Provider (BYOK)
    // 5. Handle Tool Dispatch loop
    // 6. Yield stream responses
    yield { type: 'text', content: 'Native Agent Response Placeholder' };
  }
}
