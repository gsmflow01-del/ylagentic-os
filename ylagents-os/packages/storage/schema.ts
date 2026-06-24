export const AGENTFS_SCHEMA = `
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  name TEXT,
  provider_id TEXT,
  model_id TEXT,
  system_prompt TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  role TEXT,
  content TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  metadata TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  content,
  content_rowid='id'
);

CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  type TEXT,
  name TEXT,
  config TEXT,
  enabled INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS skills (
  name TEXT PRIMARY KEY,
  version TEXT,
  description TEXT,
  config_schema TEXT,
  tools TEXT,
  prompt_templates TEXT,
  metadata TEXT,
  enabled INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);

-- FTS Triggers for messages
CREATE TRIGGER IF NOT EXISTS messages_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES('delete', old.rowid, old.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_au AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES('delete', old.rowid, old.content);
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;
`;
