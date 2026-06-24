export const AGENTFS_SCHEMA = `
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, name TEXT NOT NULL,
  base_url TEXT, api_key_ref TEXT,
  models TEXT, capabilities TEXT, enabled INTEGER DEFAULT 1,
  created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY, type TEXT NOT NULL DEFAULT 'native',
  name TEXT, status TEXT DEFAULT 'active',
  workspace TEXT, model TEXT,
  assistant_id TEXT, extra TEXT,
  created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL,
  type TEXT NOT NULL, role TEXT NOT NULL,
  content TEXT, position REAL, status TEXT DEFAULT 'sent',
  hidden INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER,
  metadata TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  content,
  content_rowid='id'
);

CREATE TABLE IF NOT EXISTS mcp_servers (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  description TEXT, enabled INTEGER DEFAULT 1,
  transport TEXT NOT NULL,
  tools TEXT, last_test_status TEXT, last_connected INTEGER,
  original_json TEXT, created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS assistants (
  id TEXT PRIMARY KEY, source TEXT NOT NULL,
  name TEXT NOT NULL, name_i18n TEXT,
  description TEXT, avatar TEXT,
  enabled INTEGER DEFAULT 1, sort_order INTEGER,
  preset_agent_type TEXT,
  enabled_skills TEXT, disabled_builtin_skills TEXT,
  context TEXT, prompts TEXT, models TEXT,
  last_used_at INTEGER, created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS assistant_overrides (
  assistant_id TEXT PRIMARY KEY,
  enabled INTEGER, sort_order INTEGER, last_used_at INTEGER,
  last_model_id TEXT, last_permission_value TEXT,
  last_skill_ids TEXT, last_mcp_ids TEXT,
  last_disabled_builtin_skill_ids TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  source TEXT NOT NULL, version TEXT,
  tags TEXT, enabled INTEGER DEFAULT 1,
  is_auto_inject INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  raw_frontmatter TEXT, file_size INTEGER,
  installed_at INTEGER, updated_at INTEGER
);

CREATE VIRTUAL TABLE IF NOT EXISTS skills_fts USING fts5(
  name, description, tags, content,
  content_rowid='id'
);

CREATE TABLE IF NOT EXISTS mailbox (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  recipient_id TEXT,
  subject TEXT,
  body TEXT,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS team_tasks (
  id TEXT PRIMARY KEY,
  team_id TEXT,
  title TEXT,
  description TEXT,
  status TEXT,
  assigned_agent_id TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS system_settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS client_preferences (key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER);
CREATE TABLE IF NOT EXISTS sync_state (
  id TEXT PRIMARY KEY DEFAULT 'default',
  last_sync_at INTEGER,
  sync_provider_id TEXT,
  remote_db_url TEXT,
  sync_enabled INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  timestamp INTEGER,
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT
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
