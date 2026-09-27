# План проекта (перенесён для ориентира)

Источник: `docs/PROGRESS.md` и `docs/LEARNING.md` (читаю, не правлю). Актуально на 2026-09-27.

## Что за проект

Учебный проект **Open Music Player** на Nuxt 4. Пользователь учится Nuxt, агент выполняет брутворк.
Источник данных — **Audius REST API** (trending, search, track by id). Публичный ключ — в `runtimeConfig.public`; secret — только на сервере.
Цель — полноценный плеер: очередь, избранное, persistence, реальное аудио, деплой.

## Этапы курса

- [x] 1. Каркас и структура Nuxt
- [x] 2. Vue внутри Nuxt
- [x] 3. Routing и layout
- [x] 4. Внешний API и data fetching
- [x] 5. SSR и hydration
- [ ] 6. Состояние приложения — **мы здесь**
- [ ] 7. Persistence и browser APIs
- [ ] 8. Настоящий плеер
- [ ] 9. Composables и архитектура
- [ ] 10. Server / Nitro
- [ ] 11. Нормализация данных и TypeScript-граница
- [ ] 12. Middleware и plugins
- [ ] 13. SEO и rendering modes
- [ ] 14. UI polish, Tailwind, Nuxt Image
- [ ] 15. Caching и производительность
- [ ] 16. Production и deployment
- [ ] 17. Бонус: auth, testing, i18n, PWA

## Этап 6 — детали

Три уровня состояния: локальный (`ref`/`reactive`) / общий SSR-friendly (`useState`) / прикладной (Pinia).
Сторы: `player` (`currentTrack`, `queue`, `isPlaying`, `volume`); избранное — позже.

DoD этапа:

- [x] Play с карточки меняет текущий трек в store (`TrackCard` → `TrackList` → страница → `playerStore.playTrack`)
- [ ] Избранное доступно на `/favorites`
- [ ] Объяснение, почему громкость — store, а не `useFetch`

UI-заглушки этого этапа (без логики): `GlobalPlayer` (бар в layout) и `PlayerControls` (prev/play/next).

## Что дальше (важно для моих задач)

- **Этап 7**: persistence избранного (Pinia → `localStorage`), без hydration mismatch, через composable/plugin, а не из компонентов.
- **Этап 8**: настоящий плеер — `HTMLAudioElement` (`play`, `pause`, `currentTime`, `duration`, `volume`, `ended`, `timeupdate`, `canplay`, `error`), `useAudio()`; `GlobalPlayer` в layout: play/pause, progress + seek, volume, prev/next, очередь, автоплей следующего трека, обработка ошибки источника. Store не знает про DOM-аудио; `useAudio()` не знает про роутинг.

## Решения, влияющие на мои задачи

- 2026-09-21 / этап 4 / источник музыки — Audius REST API; публичный ключ в `runtimeConfig.public`, secret не на клиенте.
- 2026-09-24 / стек / Tailwind не в проекте до этапа 14.
- 2026-09-26 / процесс / UI-заглушки пишет агент по просьбе пользователя; логика и state — за пользователем.
- 2026-09-27 / процесс / агент не ведёт `docs/`, заметки агента живут в `.cline/`.
- Открытый вопрос: закрепляем ли npm как package manager.

## Карта файлов (на 2026-09-27)

| Путь                       | Что                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `nuxt.config.ts`           | `modules: ["@pinia/nuxt"]` на верхнем уровне, `runtimeConfig` с ключами Audius                   |
| `app/layouts/default.vue`  | header + `<GlobalPlayer />` в footer                                                             |
| `app/components/`          | `AppButton`, `Avatar`, `SearchInput`, `TrackList`, `TrackCard`, `GlobalPlayer`, `PlayerControls` |
| `app/pages/`               | `index` (trending), `search`, `favorites`, `playlists`, `track/[id]`                             |
| `app/stores/player.ts`     | Pinia store `player`                                                                             |
| `app/utils/mock-tracks.ts` | `Track`, `Album`, моки, `formatDuration`, `getInitials`                                          |
