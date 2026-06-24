export type BridgeEvent = {
  name: string;
  data: any;
  response: any;
};

export interface IBridgeHandler<T extends BridgeEvent> {
  invoke(data: T['data']): Promise<T['response']>;
}

export class LocalBridge {
  private handlers: Map<string, (data: any) => Promise<any>> = new Map();

  register<T extends BridgeEvent>(name: T['name'], handler: (data: T['data']) => Promise<T['response']>) {
    this.handlers.set(name, handler);
  }

  async invoke<T extends BridgeEvent>(name: T['name'], data: T['data']): Promise<T['response']> {
    const handler = this.handlers.get(name);
    if (!handler) {
      console.warn(`No handler registered for bridge event: ${name}`);
      return null;
    }
    return await handler(data);
  }
}

export const localBridge = new LocalBridge();
