export interface ISyncProvider {
  push(dbFile: any): Promise<void>;
  pull(): Promise<any>;
}

export class TursoSyncProvider implements ISyncProvider {
  async push(dbFile: any): Promise<void> {
    console.log('Pushing to Turso Cloud...');
  }

  async pull(): Promise<any> {
    console.log('Pulling from Turso Cloud...');
    return null;
  }
}

export function mergeMessages(local: any[], remote: any[]) {
  // Last-write-wins based on timestamp merge logic
  const merged = [...local];
  // ... merge implementation
  return merged;
}
