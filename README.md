# Agent Context Governance (`AGENTS.md` + 3-File Topic KB)

A lightweight, runtime-agnostic **context governance protocol** and **file-based memory starter kit** for engineers orchestrating multiple AI agents (Antigravity, Codex, DeepSeek-Harness, Grokbot, WorkBuddy, etc.) across real projects.

Instead of relying on ephemeral chat transcripts or proprietary agent memory blobs, this pattern externalizes durable decisions, user-authored constraints, and chronological handoffs into versioned plain files inside the repository.

---

## Why Externalize Agent Context?

When switching across models, tools, or long-running tasks, four failure modes happen repeatedly:

1. **Context Amnesia Across Runtimes:** One agent finishes an architecture pass; the next runtime starts blind or re-invents settled decisions.
2. **Instruction Drift Overwriting User Rules:** Agents silently override human preferences buried in old chat messages.
3. **Directory & Skill Sprawl:** Dead file links, stale paths, and broken skill schemas fail silently in tool harnesses.
4. **Session Handoff Ambiguity:** No structured record of *what actually ran, what passed, and what broke*.

---

## Repository Structure

```text
.
├── AGENTS.template.md                  # Drop-in workspace constitution for any repo
├── knowledge-base/
│   └── topic-example/
│       ├── manual.md                   # Read-only user-authored overrides (highest priority)
│       ├── README.md                   # Canonical project architecture & verified conclusions
│       └── notes.md                    # Reverse-chronological session log (newest on top)
├── scripts/
│   └── check-workspace.mjs             # Zero-dependency Node.js hygiene & link validator
├── LICENSE
└── README.md
```

---

## Core Mechanics

1. **Three-Tier Authority (`manual.md` > `README.md` > `notes.md`):**
   - `manual.md` is **human-owned and read-only** to AI agents—preventing model drift from overriding explicit boundaries.
   - `README.md` stores stable facts, architecture maps, and current entrypoints.
   - `notes.md` appends one verified summary block at the **top** on every session handoff.
2. **Mandatory Startup & Handoff Protocol (`AGENTS.md`):**
   - Read governance rules and topic KB before writing code; append verified results, file paths, and open risks before finishing.
3. **Deterministic Hygiene Gate (`scripts/check-workspace.mjs`):**
   - Runs outside the LLM to validate that required memory files exist, `manual.md` stays protected, and Markdown relative links resolve to real files.

---

## Quick Start

1. Copy [`AGENTS.template.md`](AGENTS.template.md) to `AGENTS.md` at your project root and customize project boundaries.
2. Create a topic folder under `knowledge-base/<topic>/` using the three-file template in [`knowledge-base/topic-example/`](knowledge-base/topic-example/).
3. Run the zero-dependency workspace validator in any CI hook or pre-handoff check:

```bash
node scripts/check-workspace.mjs
```

---

## License

MIT © [Qianyu (Jiahua Wang)](https://ssrqy.cn/work/)
