# `.agent/` — harness memory

Not product code. This folder is the agent's long-term memory and verification layer so a new chat does not start from zero.

## Files

| File | Layer (from the harness model) | When to read |
| --- | --- | --- |
| `decisions.md` | Memory | Every task |
| `constraints.md` | Guardrails | Implementer tasks |
| `context.md` | Role | Implementer tasks |
| `verification.md` | Tests / evals | After product edits |
| `observability.md` | Observability | Append after Implementer work; read only if debugging a past session |
| `checks/` | Tests | When the matching check applies |

Course plan and current stage live in `docs/`, not here. Do not copy them.

Canonical entry point for every tool: `../AGENTS.md`.
