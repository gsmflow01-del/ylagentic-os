export * from './localBridge';

import { localBridge } from './localBridge';

/**
 * Universal IPC/HTTP Bridge Shim.
 * Satisfies the original ipcBridge/httpBridge calls from AionUi.
 */

const createShim = (prefix: string) => ({
  invoke: (params: any) => localBridge.invoke(`api:${prefix}`, params),
});

export const ipcBridge: any = {
  conversation: {
    create: createShim('conversations:create'),
    get: (params: any) => localBridge.invoke('api:conversations:get', params),
    sendMessage: createShim('conversations:messages'),
    responseStream: { on: (cb: any) => localBridge.on('message:stream', cb) },
    turnCompleted: { on: (cb: any) => localBridge.on('turn:completed', cb) },
  },
  assistants: {
    list: () => localBridge.invoke('api:assistants:list'),
    get: (params: any) => localBridge.invoke('api:assistants:get', params),
  },
  mcpService: {
    listServers: () => localBridge.invoke('api:mcp:list'),
    testMcpConnection: (params: any) => localBridge.invoke('api:mcp:test', params),
  },
  application: {
    systemInfo: () => localBridge.invoke('api:system:info'),
  },
  database: {
    getUserConversations: () => localBridge.invoke('api:conversations:list'),
  }
};

export const httpBridge = {
  // Direct HTTP-style shims if needed
};
