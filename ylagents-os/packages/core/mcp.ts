export interface IMCPTransport {
  send(payload: any): Promise<any>;
}

export class NativeHttpTransport implements IMCPTransport {
  async send(payload: any): Promise<any> {
    // Uses Capacitor Http or Tauri Http to bypass CORS
    console.log('MCP request via Native HTTP', payload);
    return {};
  }
}

export class MCPClient {
  constructor(private transport: IMCPTransport) {}

  async listTools() {
    return this.transport.send({ method: 'tools/list' });
  }

  async callTool(name: string, args: any) {
    return this.transport.send({ method: 'tools/call', params: { name, arguments: args } });
  }
}
