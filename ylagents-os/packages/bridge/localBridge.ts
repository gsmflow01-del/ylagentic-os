import { EventEmitter } from 'eventemitter3';

export type BridgeHandler<TReq = any, TRes = any> = (params: TReq) => Promise<TRes>;

export class LocalBridge extends EventEmitter {
  private handlers: Map<string, BridgeHandler> = new Map();

  register<TReq, TRes>(name: string, handler: BridgeHandler<TReq, TRes>): void {
    this.handlers.set(name, handler);
  }

  async invoke<TRes>(name: string, params?: any): Promise<TRes> {
    const handler = this.handlers.get(name);
    if (!handler) {
      console.warn(`[LocalBridge] No handler registered for: ${name}`);
      return null as any;
    }
    try {
      return await handler(params);
    } catch (error) {
      console.error(`[LocalBridge] Error in handler ${name}:`, error);
      throw error;
    }
  }
}

export const localBridge = new LocalBridge();
