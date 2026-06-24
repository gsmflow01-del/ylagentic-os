import Database from 'better-sqlite3';
import { IDatabaseAdapter } from './repository';

export class BetterSqlite3Adapter implements IDatabaseAdapter {
  private db: Database.Database;

  constructor(filename: string) {
    this.db = new Database(filename);
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }
}
