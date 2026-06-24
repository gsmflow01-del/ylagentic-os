# ylagents-os Architecture

## Core Principles
- **Local-First**: All data stays in `AgentFS` (SQLite) on-device.
- **Serverless**: No backend server. Orchestration runs in-process in TS.
- **BYOK**: Users provide their own keys for LLMs and Sync.
- **Pluggable**: All external services use a common Provider interface.

## Provider Interface
```typescript
interface Provider<TConfig, TClient> {
  type: string;
  id: string;
  configSchema: ZodSchema<TConfig>;
  validateConfig(config: TConfig): Promise<{ success: boolean; error?: string }>;
  createClient(config: TConfig, secrets: Record<string, string>): Promise<TClient>;
  // Lifecycle hooks
  onInitialize?(): Promise<void>;
  onDestroy?(): Promise<void>;
}
```

## Module Structure
- `apps/mobile`: Capacitor shell.
- `apps/desktop`: Tauri shell.
- `packages/spa`: The React 19 UI.
- `packages/core`: Agent orchestrator, skill resolver, provider registry.
- `packages/bridge`: The `localBridge.ts` implementation.
- `packages/storage`: AgentFS (SQLite) repository.
- `packages/sync`: Sync engine and providers.
- `packages/providers`: Implementation of LLM, Sync, and MCP providers.
```
