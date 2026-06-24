import { LocalBridge, BridgeEvent } from './localBridge';

export * from './localBridge';

/**
 * Compatibility shim for AionUi ipcBridge/httpBridge patterns.
 * Maps legacy bridge calls to the new LocalBridge dispatcher.
 */

export const ipcBridge = {
  // Add shimmed methods here as needed by the UI
  conversation: {
    sendMessage: {
      invoke: async (params: any) => localBridge.invoke('conversation:sendMessage', params)
    }
  }
};

export const httpBridge = {
    // Shims for HTTP bridge
}
