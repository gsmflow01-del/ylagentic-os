# ylagents-os — Development Plan v2 (Final Refreshed)

**Date:** 2025-06-25
**Status:** Final v2 (Refreshed)
**Based on:** Full audit of AionCore (28K+ lines Rust) + AionUi (1788+ files) source code
**Brand:** ylagents-os

---

## What This Plan Is

This is the definitive development roadmap for ylagents-os. Every architectural decision is verified against the AionCore and AionUi source code to ensure 100% feature parity while moving to a local-first, serverless TypeScript architecture.

---

## Core Platform Principles

1.  **Mobile & Desktop Parity**: Every feature works on both platforms. UI is adapted for mobile (bottom sheets, gestures) but functionality is never cut.
2.  **Serverless Orchestration**: No backend binary. The React SPA + `localBridge.ts` + TS Orchestrator handles everything in-process.
3.  **Local-First & Portable**: All state lives in a single, exportable SQLite `.db` file (AgentFS).
4.  **BYOK (Bring Your Own Key)**: Users provide credentials for all external services. No proxying.
5.  **Native TS Agent**: The default agent experience is built-in. No CLI tools (claude code, etc.) required for core functionality.

---

## Key Findings From Codebase Audit

### Finding 1: AionUi is a Thin Frontend
AionUi's React SPA currently sends REST calls to a Rust backend. We replace the network hop with `localBridge.ts`, which dispatches directly to TypeScript modules.

### Finding 2: Bridge Interface Reusability
AionUi uses a `ProviderLike` pattern. By satisfying this interface in `localBridge.ts`, all 200+ existing React components will work unchanged.

### Finding 3: Two-Tier Skill Loading
AionCore uses a compact index for discovery and lazy-loads full skill content on-demand. We adopt this for mobile performance, with skill content stored in SQLite.

### Finding 4: MCP is Rust-Only
The Model Context Protocol client in AionCore is 100% Rust. We reimplement this in TypeScript with a native HTTP transport to bypass WebView CORS.

---

## 10-Phase Roadmap

### Phase 1: Analysis & Architecture Blueprint (Completed)
- Mapped components and crates to new TS module structure.
- Finalized pluggable Provider interfaces.

### Phase 2: Monorepo & Native Shell Scaffolding
- Initialize Bun monorepo: `apps/mobile` (Capacitor), `apps/desktop` (Tauri).
- Port React 19 SPA to `packages/spa`, stripping Electron/Node dependencies.
- Implement `localBridge.ts` with `ProviderLike` and `EventEmitter` shims.

### Phase 3: Storage (AgentFS) & Security Layer
- Implement unified `DatabaseAdapter` (Capacitor SQLite + better-sqlite3).
- Schema implementation: `conversations`, `messages`, `skills`, `providers`, `mailbox`, `team_tasks`.
- Enable WAL mode and FTS5 for search.
- `SecureStorage` implementation using native platform keychains (iOS Keychain / Android Keystore / OS Keyring).

### Phase 4: LocalBridge & Orchestration Core
- Map all ~100+ bridge endpoints to in-process TS handlers.
- Port Agent Orchestrator loop (TS-native) from AionCore patterns.
- Implement Provider Registry and lifecycle management.

### Phase 5: BYOK Providers & Settings UI
- Implement initial LLM providers (OpenAI, Anthropic).
- Dynamic Settings UI: Render credential forms from provider config schemas.
- Implement connection testing and credential validation flows.

### Phase 6: MCP Integration & Native Agent System
- TS MCP client with Native HTTP transport for CORS bypass.
- Port AionUi's MCP settings, server CRUD, and tool listing UI.
- Unified Agent (Assistant) management UI, defaulting to the built-in native TS backend.

### Phase 7: Skill System (Mobile-Optimized)
- Port Two-Tier system: Compact Index + Lazy content from SQLite.
- Runtime SKILL.md import flow with YAML frontmatter parsing.
- Wire skill prompt injection and `[LOAD_SKILL]` detection into the agent loop.

### Phase 8: Sync Engine (BYOK Optional)
- Pluggable sync provider interface.
- Implement Turso Cloud sync provider (User BYOK).
- Smart merge logic: message merging by timestamp, last-write-wins for edits.
- Export/Import `.db` file for local backup.

### Phase 9: Mobile UX Adaptation & Native Wiring
- Touch-optimized component overrides (bottom sheets, swipe gestures).
- Wire Capacitor plugins: Camera, Share, Haptics, Biometrics.
- Refine `isMobile` logic for true mobile-native behaviors.

### Phase 10: MVP Release & Polish
- Integration testing for bridge dispatch and the native agent loop.
- E2E platform verification on iOS/Android.
- Final performance benchmarking and asset preparation.

---

## Post-MVP Roadmap
- **ACP Plugin**: Optional ACP client for connecting external CLI agents (claude code, opencode, etc.).
- **Local Tools**: Capacitor Filesystem-based tools for agents.
- **Team Mode Expansion**: Advanced multi-agent orchestration patterns.

---

## Effort Estimates

| Phase | Description | Effort |
|---|---|---|
| 1 | Analysis & Blueprint | 40h (Done) |
| 2 | Monorepo & Shells | 60h |
| 3 | Storage & Security | 80h |
| 4 | localBridge | 100h |
| 5 | Agent Orchestrator | 120h |
| 6 | MCP & Agent UI | 80h |
| 7 | Skill System | 60h |
| 8 | Sync Engine | 50h |
| 9 | Mobile UX | 60h |
| 10 | MVP Polish | 50h |
| **Total** | | **~700h** |
