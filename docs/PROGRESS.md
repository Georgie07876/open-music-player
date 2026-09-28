# Прогресс обучения — Open Music Player

Этот файл — живой контекст между сессиями. Ментор читает его в начале чата и обновляет в конце рабочей сессии.

## Сейчас

| Поле | Значение |
| --- | --- |
| Этап | **6 — состояние приложения** (этап 5 закрыт) |
| Статус этапа | Срез 6.1 «плеер» закрыт. Дальше срез 6.2 — избранное в памяти |
| Следующий шаг | Ученик: предплан файлов для favorites store. Код после сверки |
| Язык обучения | Русский, код на английском |
| Tailwind | Не установлен и не в стартовом стеке. Появляется только на этапе 14 |

## Что уже есть в репозитории

- Layout, страницы `/`, `/search`, `/track/[id]`, `/favorites`, `/playlists`
- Данные треков с **Audius** через `useFetch` (trending, search, track by id)
- `toTrack` пока дублируется на страницах
- Play → `playerStore.playTrack(track)` (карточка → список → `/` и `/search` → store)
- `playTrack` ставит `currentTrack`, `isPlaying` и кладёт трек в `queue`, если его там нет
- `GlobalPlayer` читает `currentTrack` (title/artist). `PlayerControls` пока без логики
- Favorite по-прежнему текст на странице; стора избранного нет
- `/track/[id]` без кнопки Play

## Журнал сессий

### 2026-09-28 — harness L2 (не этап курса)

- Собрана переносимая обвязка агента: `AGENTS.md`, `.cursor/rules|skills|commands`, `.agent/`, `.clinerules`
- Старые заметки `.cline/*` (кроме README-указателя) заменены: план курса больше не дублируется, память — `docs/PROGRESS.md` + `.agent/decisions.md`
- Два режима: Mentor (курс) и Implementer (явный запрос на код/tooling)
- Намеренно нет MCP, RAG и eval-фреймворка — размер проекта этого не требует

### 2026-09-27 — срез 6.1 закрыт

- Импорт `Track`, `volume: 0.8`, очередь в `playTrack`
- Footer показывает текущий трек. `/track/[id]` без Play — сознательно отложено
- Этап 6 не закрыт: нет favorites store

### 2026-09-26 — этап 6, срез 1: Pinia и «эмит меняет store»

- Причина ошибок `2304 defineStore` / `2552 usePlayerStore` / `2339 this.*`: `modules: ["@pinia/nuxt"]` стоял внутри `runtimeConfig`. Перенесён на верхний уровень (правка ученика), `.nuxt` перегенерирован — ошибки ушли
- Цепочка событий: `onPlay` на `/` и `/search` вызывает `playerStore.playTrack(track)`; из `TrackCard` убран неиспользуемый `usePlayerStore()` — карточка осталась презентационной
- `Plug.vue` удалён, контролы переехали в `PlayerControls.vue`; заглушку `GlobalPlayer` (controls + `mute | timeline | heart`) написал ментор по просьбе ученика
- Ловушка: пустой `.vue` (0 байт), на который ссылается шаблон, роняет сборку — «At least one `<template>` or `<script>` is required in a single file component»
- Удалён мусор `app/.nuxt` и `app/package-lock.json` (след запуска `nuxi` из папки `app/`)

### 2026-09-25 — checkpoint этапа 5

- setup дважды (сервер, затем клиент) — верно; поправили: клиент не печатает HTML заново, а гидрирует
- mismatch vs «misses»; `import.meta.client` ≠ совпадение шаблона — добрали
- Зонд `localStorage` с `/favorites` убран
- Этап 5 закрыт

### 2026-09-24 — протокол сессий

- Ученик зафиксировал порядок: теория → пересказ и правки → задача среза → план файлов → реализация с ревью по ходу → контрольные → следующий этап
- Заметки ведёт ментор. Ученик в `docs/` и `.cursor/` не работает
- Tailwind в `package.json` нет. Не ставить раньше этапа 14
- Этап 5 начат только теорией, код проекта не трогали

### 2026-09-21 — checkpoint этапа 4

- useFetch vs $fetch: реактивность + без второго запроса при hydration — верно; добрали «зачем нам это мешает»
- TrackCard без fetch: переиспользование — верно; добрали «кто владеет данными»
- search = массив, track by id = один объект — верно
- Этап 4 закрыт. API: Audius

### 2026-09-21 — track/[id] на Audius

- Страница трека работает на live API

### 2026-09-13 — уточнение этапа 4 / выбор API

- Отсеяли MusicBrainz, Spotify, Яндекс Музыку
- Взяли Audius

## Чеклист этапов

- [x] 1. Каркас и структура Nuxt
- [x] 2. Vue внутри Nuxt
- [x] 3. Routing и layout
- [x] 4. Внешний API и data fetching
- [x] 5. SSR и hydration
- [ ] 6. Состояние приложения
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

## Решения

- 2026-09-26 / этап 6 / UI-заглушки (GlobalPlayer) пишет ментор по просьбе ученика; логика и state — за учеником
- 2026-09-21 / этап 4 / источник музыки — Audius REST API / публичный ключ в runtimeConfig.public; secret не на клиенте
- 2026-09-28 / процесс / harness: `AGENTS.md` + `.agent/` + Cursor rules/skills/commands. Mentor vs Implementer. Старый `.cline/` (кроме README) не источник правды
- 2026-09-24 / процесс / цикл: теория → пересказ → задача → план → код ученика и ревью по ходу → контрольные → следующий этап. Заметки пишет ментор
- 2026-09-24 / стек / Tailwind не в проекте; этап 14
- 2026-09-12 / процесс / код пишет ученик

## Открытые вопросы

- npm оставляем как package manager (сейчас в проекте npm)?

## Банк вопросов для повторения

- Почему `setup` в Nuxt выполняется дважды?
- Чем `import.meta.client` в `setup` отличается от чтения в `onMounted`?
- Почему на странице `useFetch`, а не `$fetch` в setup/`onMounted`?
- Почему `TrackCard` не ходит в API сам?
- Чем ответ search отличается от track by id?
- Чем `NuxtLink` отличается от `<a href>`?
- Почему плеер будет в layout?

## Как продолжить в новом чате

> Начинаем этап 6. Смотри `docs/PROGRESS.md`.
