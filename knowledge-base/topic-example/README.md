# Topic Knowledge Base — Example Module

## Current State & Entrypoints

- **Status:** Active starter template
- **Architecture:** Compound AI layout pairing stateless model calls with deterministic external scripts (`scripts/check-workspace.mjs`).
- **Governance Files:**
  - [manual.md](manual.md) (human-authored constraints, read-only)
  - [notes.md](notes.md) (reverse-chronological session log)

## Key Architectural Decisions

- Externalized state lives in plain version-controlled Markdown so any agent runtime inherits project context without vendor lock-in.
- Hygiene validation runs deterministically in Node.js with zero third-party packages.
