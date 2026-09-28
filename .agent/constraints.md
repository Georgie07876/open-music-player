# Implementer constraints

## Do not read

- `.env`, `.env.*` — secrets. `.env.example` only if the task is about env vars.
- Secret values inside `nuxt.config.ts` / `runtimeConfig`. Point at the key name, never the value.
- `node_modules/**` except a pinpoint source file to prove a runtime error. Mention that in the report.
- `.git/**` internals. `git status` / `git log` on read is fine.

## Do not change without an explicit ask

- `app/**`, `nuxt.config.ts`, `package.json`, lockfile, `.gitignore`, `README.md`
- `docs/**` (mentor writes course notes)
- Git: no commit / push / branch / checkout / reset / clean
- Dependencies: no `npm install` / uninstall, including Vitest and ESLint
- Generated `.nuxt/**` — readable, not editable

## Always

- No Tailwind before stage 14.
- `import.meta.client` / `import.meta.server` only.
- Do not jump ahead of `docs/PROGRESS.md` unless the task is harness, git, or tooling.
- SSR: no unguarded `window` / `document` / `localStorage` in setup.

## If the task needs a forbidden file or command

Stop. Say which file or action and why. Wait.
