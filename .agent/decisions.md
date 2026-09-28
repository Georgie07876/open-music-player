# Decisions (stable)

Read this instead of reconstructing history. Add a line when a choice is made; do not narrate sessions here.

## Product

- Music source: **Audius REST** (`trending`, `search`, `track by id`).
- Public Audius key: `runtimeConfig.public`. Secret: server-only. Never log either.
- Player bar lives in `app/layouts/default.vue`, not in `TrackCard`.
- Favorites persist later (stage 7). Until then, memory-only Pinia.

## Stack

- Package manager: **npm**.
- Tailwind: stage 14 only. Until then: scoped CSS, BEM-ish classes.
- Pinia module: top-level `modules` in `nuxt.config.ts`, never nested in `runtimeConfig`.
- After config/module edits: `npx nuxi prepare` (or `npm run dev`) and restart the TS server if Volar is stale.

## Process

- Learning code: the student writes it. Mentor does not implement unless asked after a stuck attempt.
- UI stubs on stage 6 (GlobalPlayer chrome): Implementer may write them when asked; player/favorites **logic** stays with the student.
- Course notes: mentor updates `docs/PROGRESS.md`. Implementer updates `.agent/observability.md`.
- Language: Russian with the student; English in code.

## Known traps

- Empty `.vue` (0 bytes) referenced from a template → build dies ("At least one `<template>` or `<script>` is required").
- `usePlayerStore()` destructured without `storeToRefs` → lost reactivity.
- Store used inside a click handler instead of setup → extra instances / lost SSR context.
- `nuxi` launched from `app/` creates junk `app/.nuxt` and `app/package-lock.json` — delete, do not commit.
