import { localBridge } from '../bridge/localBridge';

export interface IMCPTransport {
  send(payload: any): Promise<any>;
}

export class NativeHttpTransport implements IMCPTransport {
  async send(payload: any): Promise<any> {
    console.log('MCP request via Native HTTP (Bypassing CORS)', payload);
    return { result: { tools: [] } };
  }
}

export class MCPClient {
  constructor(private transport: IMCPTransport) {
    this.registerBridgeHandlers();
  }

  private registerBridgeHandlers() {
    localBridge.register('api:mcp:servers', async () => {
      return [];
    });

    localBridge.register('api:mcp:test-connection', async (params: any) => {
      return { success: true };
    });
  }

  async listTools() {
    return this.transport.send({ method: 'tools/list' });
  }

  async callTool(name: string, args: any) {
    return this.transport.send({ method: 'tools/call', params: { name, arguments: args } });
  }
}
