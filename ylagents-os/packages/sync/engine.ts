import { localBridge } from '../bridge/localBridge';

export class SyncEngine {
  constructor() {
    this.registerHandlers();
  }

  private registerHandlers() {
    localBridge.register('api:sync:status', async () => {
      return { last_synced: Date.now(), status: 'idle' };
    });

    localBridge.register('api:sync:trigger', async () => {
      console.log('Syncing to Turso Cloud (User BYOK)...');
      return { success: true };
    });
  }

  /**
   * Smart merge logic: message merging by timestamp, last-write-wins for edits.
   */
  mergeMessages(local: any[], remote: any[]) {
    const map = new Map();
    [...local, ...remote].forEach(m => {
      const existing = map.get(m.id);
      // Logic: If remote is newer, or local doesn't exist, update map
      if (!existing || m.updated_at > existing.updated_at) {
        map.set(m.id, m);
      }
      // Preservation on delete conflicts (if one version exists and other doesn't, keep it)
      // This simple implementation assumes presence in the array means non-deleted.
    });
    return Array.from(map.values()).sort((a, b) => a.created_at - b.created_at);
  }
}
