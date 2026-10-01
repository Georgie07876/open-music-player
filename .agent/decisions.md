# Decisions (stable)

Read this instead of reconstructing history. Add a line when a choice is made; do not narrate sessions here.

## Product

- Music source: **Audius REST** (`trending`, `search`, `track by id`).
- Public Audius key: `runtimeConfig.public`. Secret: server-only. Never log either.
- Player bar lives in `app/layouts/default.vue`, not in `TrackCard`.
- Favorites persistence (stage 7, agreed 2026-10-01): `localStorage`, key `omp:favorites:v1`, value `Track[]`.
  - **Known debt**: `Track[]` is a snapshot and goes stale. Target shape is ids + batch fetch; Audius `/v1/tracks?id=…` returns **403**, so ids cannot be re-hydrated today → stage 10 (server proxy) or stage 11.
  - Read **after hydration** (`nuxtApp.hook("app:mounted")`); write with `watch(() => store.tracks, save, { deep: true })`. Both live in `useFavorites()`, called once from `plugins/favorites.client.ts`. Pages, components and the store stay unaware of `localStorage`.
  - `localStorage` over cookie: nothing server-rendered depends on favorites, and a cookie would ship the whole track list on every request (~4 KB cap).
- Audius API (verified 2026-10-01): `trending`/`search` answer 200 with no key at all and with a bogus `public_Key`; no batch-by-ids endpoint; `Access-Control-Allow-Origin: *`.

## Stack

- Package manager: **npm**.
- Tailwind: stage 14 only. Until then: scoped CSS, BEM-ish classes.
- Pinia module: top-level `modules` in `nuxt.config.ts`, never nested in `runtimeConfig`.
- After config/module edits: `npx nuxi prepare` (or `npm run dev`) and restart the TS server if Volar is stale.
- Dev server on Windows: Nitro binds `localhost` → `[::1]` **only**. If IPv6 loopback is broken (work VPN / Xray TUN), the browser gets `ERR_CONNECTION_REFUSED`. Then run `npm run dev -- --host 127.0.0.1` and open `http://127.0.0.1:3000`.
- Without a VPN some corporate networks cannot reach `api.audius.co`: the SSR fetch fails and pages render the empty/error state. The request is made by Node, not by the browser.

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
- Plugin bodies run **before** hydration (`nuxt/dist/app/entry.js`: `applyPlugins` → `app:beforeMount` → `mount()` → `app:mounted`) → reading `localStorage` in a plugin body = hydration mismatch. Read in `onMounted`, or in `nuxtApp.hook("app:mounted")`.
- `onMounted` outside a component (e.g. inside a plugin) is a **silent no-op**: Vue only warns "no active component instance" and the hook is never registered (`@vue/runtime-core`, `injectHook`).
- `watch(() => store.tracks, cb)` without `{ deep: true }` misses in-place mutations (`push`); `remove`/`filter` replaces the ref and does fire. Pinia `$subscribe` is `{ deep: true }` by default.
- Watchers and `$subscribe` created in a page's `setup` die on route change (`unmountComponent` → `instance.scope.stop()`); Pinia `$subscribe` needs `{ detached: true }` to survive.
- A layout instance survives navigation (`NuxtLayout` key = layout name) but is recreated on a layout switch. `app.vue` is never recreated.
- Auto-imports come from **exports**: a 0-byte file in `composables/` exports nothing → no `useFavorites` auto-import. The reserved dir is `plugins/`, not `plagins/` — the wrong name is scanned by nothing (0 hits in `.nuxt/`).
