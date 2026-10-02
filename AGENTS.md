# Open Music Player — agent harness

Small Nuxt 4 learning app. The harness ships in git so a new machine and a new chat start from the same facts, not from a prompt.

## Modes

Pick one. Do not mix them in the same turn.

| Mode | When | Source of truth |
| --- | --- | --- |
| **Mentor** (default) | Course work, theory, review of student code | `.cursor/rules/nuxt-mentor.mdc` |
| **Implementer** | User explicitly asks to write, fix, or boilerplate | `.cursor/skills/implementer/SKILL.md` + `.agent/` |

Harness / git / tooling requests are Implementer, not a course slice.

## Before any task

1. Read `docs/PROGRESS.md` (where we are).
2. Read `.agent/decisions.md` (why it is this way).
3. Mentor: also `docs/LEARNING.md`. Implementer: also `.agent/constraints.md`.

Do **not** dump `docs/LEARNING.md` or `.agent/observability.md` into context unless the task needs them.

## Layout

```text
app/            Vue app (Nuxt 4). Pages, components, stores, composables.
server/         Nitro (not used yet; stage 10).
shared/         Code for Vue + Nitro, no Vue/Nitro imports (stage 11).
docs/           Course plan + progress. Mentor maintains. Student does not edit.
.agent/         Agent memory, guardrails, verification. Not product code.
.cursor/        Cursor rules, skills, commands.
```

## Stack (do not invent another)

- Nuxt `^4.5.2`, `srcDir = app`, Vue `^3.5.42`, Pinia via `@pinia/nuxt`
- Package manager: **npm**
- CSS: scoped + BEM-ish classes. **No Tailwind until stage 14**
- Data: Audius REST (`trending`, `search`, `track by id`)
- Tests: none in `package.json`. Prove work with `.agent/verification.md`

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Non-negotiables

- App code lives in `app/`. Browser vs server: `import.meta.client` / `import.meta.server` — never `process.client`.
- Teach in Russian; code, identifiers, commits in English.
- Student writes learning-task code. Implementer writes only what was asked — no drive-by refactors.
- Never read or print `.env`, `.env.*`, or secret values from `nuxt.config.ts`.
- Do not skip the current stage in `docs/PROGRESS.md`.

## Memory

| File | Role |
| --- | --- |
| `docs/PROGRESS.md` | Course position (human + mentor) |
| `.agent/decisions.md` | Stable architectural choices |
| `.agent/observability.md` | Implementer session log (append after a done task) |

After an Implementer task: verify, then append one short entry to `.agent/observability.md`.

## Commands

- `/continue` — next course slice (Mentor)
- `/implement` — execute an explicit coding request (Implementer)

## Answer style

- Russian, concise. Cut filler: no restating what the user can already see (git status, "files unchanged"), no obvious explanations.
- Keep the conversation on the course: concepts, decisions, next action. Unrelated process detail is noise.
- Evidence belongs in `.agent/observability.md` and `.agent/verification.md`; in chat at most one line: command → result.
