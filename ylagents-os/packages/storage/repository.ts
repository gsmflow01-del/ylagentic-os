import { AGENTFS_SCHEMA } from './schema';

export interface IDatabaseAdapter {
  execute(sql: string, params?: any[]): Promise<any>;
  query(sql: string, params?: any[]): Promise<any[]>;
}

export class ConversationRepository {
  constructor(private db: IDatabaseAdapter) {}

  async create(conv: any) {
    await this.db.execute(
      'INSERT INTO conversations (id, type, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [conv.id, conv.type || 'native', conv.name, 'active', Date.now(), Date.now()]
    );
  }

  async list() {
    return await this.db.query('SELECT * FROM conversations ORDER BY updated_at DESC');
  }
}

export class MessageRepository {
  constructor(private db: IDatabaseAdapter) {}

  async add(msg: any) {
    await this.db.execute(
      'INSERT INTO messages (id, conversation_id, type, role, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [msg.id, msg.conversation_id, msg.type, msg.role, msg.content, 'sent', Date.now(), Date.now()]
    );
  }

  async getByConversationId(convId: string) {
    return await this.db.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC', [convId]);
  }

  async search(query: string) {
    return await this.db.query('SELECT * FROM messages_fts WHERE content MATCH ?', [query]);
  }
}

export class AgentFS {
  public conversations: ConversationRepository;
  public messages: MessageRepository;

  constructor(private db: IDatabaseAdapter) {
    this.conversations = new ConversationRepository(db);
    this.messages = new MessageRepository(db);
  }

  async initialize() {
    // Splits schema into individual statements for execute
    const statements = AGENTFS_SCHEMA.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const statement of statements) {
      await this.db.execute(statement);
    }
    await this.db.execute('PRAGMA journal_mode=WAL;');
    console.log('AgentFS Initialized with WAL and FTS5');
  }
}
