# Workspace Context Governance Protocol (`AGENTS.md` Template)

> Every AI runtime (planner, coder, reviewer, QA script runner) shares this contract before touching code or deliverables.

## 1. Startup Sequence (Read-Only Before Execution)

1. Read this root `AGENTS.md`.
2. Read the target topic knowledge base in strict precedence order:
   - `knowledge-base/<topic>/manual.md` — **User-authored rules (HIGHEST PRIORITY, READ-ONLY to agents)**
   - `knowledge-base/<topic>/README.md` — Current architecture, entrypoints, and verified state
   - `knowledge-base/<topic>/notes.md` — Recent session outcomes, regressions, and known pitfalls (reverse chronological)
3. Inspect the current working tree rather than relying on stale memory claims.

## 2. Authority & Boundary Rules

- **Never edit or overwrite `manual.md`:** Only the human owner updates `manual.md`.
- **Immutable Evidence:** Raw data dumps, external references, and user-provided binaries stay read-only; derived outputs go to dedicated build/output folders.
- **Fact-Verified Reporting:** Only cite command outputs, test counts, and file paths directly observed after the final edit.

## 3. Session Handoff Protocol (Before Finishing)

1. Prepend one dated entry at the **top** of `knowledge-base/<topic>/notes.md` covering:
   - What changed and why
   - Exact verification commands run after the last edit + observed results
   - Open risks or explicit next steps for the next agent
2. Update `knowledge-base/<topic>/README.md` if architecture, links, or active versions changed.
3. Run deterministic hygiene checks (`node scripts/check-workspace.mjs`) and confirm exit code `0`.
