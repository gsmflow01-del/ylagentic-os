# ylagents-os Architecture (Final v2 - Codebase-Verified)

## Core Principles
- **Local-First**: All data stays in `AgentFS` (SQLite) on-device. WAL mode and FTS5 enabled.
- **Serverless**: No backend server. Orchestration runs in-process in TS using `localBridge.ts`.
- **BYOK**: Users provide their own keys for LLMs, Sync (Turso), and MCP.
- **Pluggable**: Every external service conforms to a `Provider<TConfig, TClient>` interface.
- **Mobile-First, Desktop-Parity**: Every feature works on both platforms. UI is adapted (bottom sheets, gestures) for mobile.

## Key Architectural Findings & Decisions

### 1. Bridge Pattern (`localBridge.ts`)
- Replaces both legacy `ipcBridge` (Electron IPC) and `httpBridge` (REST/WS).
- Uses the same `{ name, data }` wire protocol.
- ~100+ handler functions organized by domain (conversations, assistants, mcp, fs, system).
- Stream communication uses an in-process `EventEmitter`.
- Ensures all 200+ AionUi components work unchanged.

### 2. Native TS Agent Orchestrator
- Default agent backend; no external CLI binaries required.
- Ported from `AionCore`'s Rust orchestrator patterns to pure TypeScript.
- Handles LLM calls, tool routing, and skill injection in-process.

### 3. Two-Tier Skill System
- **Tier 1 (Index)**: `{ name, description, tags }` always injected into system prompt.
- **Tier 2 (Full Content)**: Lazy-loaded from SQLite `skills.content` when agent outputs `[LOAD_SKILL: name]`.
- Runtime import of `.md` files with YAML frontmatter.

### 4. Storage & Security
- **SQLite**: Single portable `.db` file using `@capacitor-community/sqlite` (mobile) and `better-sqlite3` (desktop).
- **FTS5**: Full-text search on `messages` and `skills` tables.
- **Secure Storage**: API keys and secrets stored in platform-native keychains (iOS Keychain, Android Keystore, OS Keyring), never in SQLite.

### 5. MCP (Model Context Protocol)
- Full TS reimplementation of the MCP client.
- Native HTTP transport to bypass WebView CORS restrictions.
- Reuses AionUi's management UI for server CRUD and tool discovery.

## Rust-to-TS Module Mapping

| AionCore Crate | ylagents-os TS Module | Port Strategy |
|---|---|---|
| `aionui-ai-agent` | `packages/core/src/orchestrator/` | Port AionrsAgentManager pattern as TS class |
| `aionui-conversation` | `packages/core/src/conversation/` | Port turn orchestrator + stream relay |
| `aionui-mcp` | `packages/core/src/mcp/` | New TS MCP client (HTTP/SSE) |
| `aionui-db` | `packages/core/src/storage/` | Use SQLite repos, copy table schemas |
| `aionui-assistant` | `packages/core/src/assistant/` | Port directly, same TS types |
| `aionui-system` | `packages/core/src/provider/` | Port with BYOK provider interface |
| `aionui-extension` | `packages/core/src/skill/` | Port AcpSkillManager pattern |
| `aionui-realtime` | `packages/bridge/src/emitter.ts` | In-process EventEmitter |
| `aionui-api-types` | `packages/core/src/types/` | Port TypeScript types directly from AionUi |
