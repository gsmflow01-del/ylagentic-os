import { AGENTFS_SCHEMA } from './schema';
// Note: In a real environment, we'd use @capacitor-community/sqlite
// For this shim, we'll define the interface the core will use.

export interface IConversationRepository {
  create(conversation: any): Promise<void>;
  list(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export interface IMessageRepository {
  add(message: any): Promise<void>;
  getByConversationId(id: string): Promise<any[]>;
  search(query: string): Promise<any[]>; // FTS5
}

export class AgentFS {
  constructor() {
    console.log('AgentFS Initialized with Schema:', AGENTFS_SCHEMA.substring(0, 100) + '...');
  }

  // Repository implementations will go here
}
