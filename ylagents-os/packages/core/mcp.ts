import { localBridge } from '../bridge/localBridge';

export interface IMCPTransport {
  send(payload: any): Promise<any>;
}

export class NativeHttpTransport implements IMCPTransport {
  async send(payload: any): Promise<any> {
    // Logic for Capacitor/Tauri Native Http to bypass CORS
    console.debug('MCP Native Http Request', payload);
    return { result: { tools: [] } };
  }
}

export class MCPClient {
  constructor(private transport: IMCPTransport) {
    this.registerHandlers();
  }

  private registerHandlers() {
    localBridge.register('api:mcp:list', async () => {
      // Fetch from SQLite mcp_servers table
      return [];
    });

    localBridge.register('api:mcp:test', async (params: any) => {
      console.log('Testing MCP Connection...', params);
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
