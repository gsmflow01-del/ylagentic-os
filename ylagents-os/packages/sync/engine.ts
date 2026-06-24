import { localBridge } from '../bridge/localBridge';

export interface ISyncProvider {
  push(data: any): Promise<void>;
  pull(): Promise<any>;
}

export class SyncEngine {
  constructor() {
    this.registerBridgeHandlers();
  }

  private registerBridgeHandlers() {
    localBridge.register('api:sync:status', async () => {
      return { last_synced: Date.now(), status: 'idle' };
    });

    localBridge.register('api:sync:trigger', async () => {
      console.log('Sync triggered...');
      return { success: true };
    });
  }

  mergeMessages(local: any[], remote: any[]) {
    // Smart merge: last-write-wins by timestamp
    const map = new Map();
    [...local, ...remote].forEach(m => {
      const existing = map.get(m.id);
      if (!existing || m.updated_at > existing.updated_at) {
        map.set(m.id, m);
      }
    });
    return Array.from(map.values());
  }
}
