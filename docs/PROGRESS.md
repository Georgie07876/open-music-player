# Прогресс обучения — Open Music Player

Этот файл — живой контекст между сессиями. Ментор читает его в начале чата и обновляет в конце рабочей сессии.

## Сейчас

| Поле | Значение |
| --- | --- |
| Этап | **7.2 — CI** (этапы 1–7 и срез persistence закрыты) |
| Статус этапа | В плане. Кода пайплайна нет |
| Следующий шаг | Теория CI, затем пайплайн: `npm ci`, типы, `nuxt build` |
| Дев-сервер | Nitro слушает только `localhost` → `[::1]`. Если IPv6-loopback недоступен (рабочий VPN), запускать `npm run dev -- --host 127.0.0.1` и открывать `http://127.0.0.1:3000` |
| Язык обучения | Русский, код на английском |
| Tailwind | Не установлен и не в стартовом стеке. Появляется только на этапе 14 |

## Что уже есть в репозитории

- Layout, страницы `/`, `/search`, `/track/[id]`, `/favorites`, `/playlists`
- Данные треков с **Audius** через `useFetch` (trending, search, track by id)
- `toTrack` пока дублируется на страницах
- Play / Favorite: карточка → TrackList → `/`, `/search`, `/favorites` → player/favorites store
- `useFavoritesStore.tracks`, toggle, `isFavorite`. **Без localStorage** — срез 7.1 не сделан
- Заготовки под срез 7.1: `app/composables/useFavorites.ts` (0 байт) и `app/plagins/favorites.client.ts` (0 байт). Папка `plagins` — опечатка (нужно `plugins`), Nuxt её не сканирует
- `/track/[id]` без кнопки Play

## Журнал сессий

### 2026-10-01 — checkpoint этапа 7

- Код: `useFavorites` + `plugins/favorites.client.ts`, ключ `omp:favorites:v1`, ученик подтвердил сохранение
- SSR: поправили «dev не запустится» → падает рендер запроса, не процесс `npm run dev`
- Cookie: не «значение не меняется», а сервер должен знать его до HTML
- Этап 7 закрыт. Этап 8 не начинали: пауза на корректировку плана

### 2026-10-01 — этап 7, срез 1: теория, диагностика рабочей машины (код не написан)

- **Симптомы:** без VPN данные с API не приходят; с VPN сайт отдаёт `ERR_CONNECTION_REFUSED`.
- **Разбор:** Nitro слушает только `[::1]:3000`. При поднятом Happ (Xray, TUN) IPv6-loopback мёртв (`ping -6 ::1` → General failure, TCP на `::1` не идёт ни к одному живому слушателю), а `127.0.0.1` работает → браузер до сервера не доходит. Обход без правки конфига: `npm run dev -- --host 127.0.0.1`
- **Данные:** без VPN корпоративная сеть не пускает на `api.audius.co`. Запрос делает сервер (SSR-`useFetch`), а не браузер. Через туннель Node получает 200 за ~0.9 с
- **Не причина:** ключ Audius (endpoint отвечает 200 и без ключа, и с мусорным `public_Key`), CORS (`*`), системный прокси (нет), файрвол
- **Теория среза:** persistence, таблица хранилищ, `localStorage` недоступен на сервере, mismatch vs постгидратационный патч, кто владеет записью, cookie vs `localStorage`, время жизни подписки
- **Пересказ ученика:** верно про `localStorage` и `onMounted`; уточнили, что `import.meta.client` — константа сборки, а не проверка в рантайме. Ошибка: на вопрос про смерть подписки ответил про F5 — разобрали `instance.scope.stop()` и Pinia `onScopeDispose`
- **Ловушки в плане ученика:** `onMounted` внутри плагина не регистрируется (нет инстанса, только warn); плагины выполняются **до** гидратации; `watch` без `deep` не видит `push`
- **Итоговые решения:** ключ `omp:favorites:v1`, значение `Track[]` (снапшот, долг — ids + batch), чтение через `nuxtApp.hook("app:mounted")`, запись `watch(..., { deep: true })`, вызов `useFavorites()` из `app/plugins/favorites.client.ts`
- **Срез не закрыт:** оба файла по 0 байт, код не написан, DoD не проверялся

### 2026-09-28 — checkpoint этапа 6

- громкость/трек не useFetch: не JSON с API — верно
- очередь не в GlobalPlayer: emit не доходит до соседа в layout — верно; F5 тут ни при чём
- поиск без Pinia — верно
- Этап 6 закрыт

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
- [x] 6. Состояние приложения
- [x] 7. Persistence и browser APIs
- [ ] 7.2 CI: типы и `nuxt build` на push
- [ ] 7.3 ESLint и Husky
- [ ] 8. Настоящий плеер
- [ ] 9. Composables и архитектура
- [ ] 9.1 Storybook для кнопки и карточки
- [ ] 10. Server / Nitro
- [ ] 11. Нормализация данных и TypeScript-граница
- [ ] 12. Middleware и plugins
- [ ] 13. SEO и rendering modes
- [ ] 14. UI polish, Tailwind, Nuxt Image
- [ ] 15. Caching и производительность
- [ ] 16. Production и deployment
- [ ] 16.1 Docker-образ того же build
- [ ] 17. Бонус: auth + Mongo, testing, Sonar, i18n, PWA

## Решения

- 2026-10-01 / этап 7 / избранное: `localStorage` (не cookie), ключ `omp:favorites:v1`, значение `Track[]` — снапшот. Долг: ids + batch-запрос (этапы 10–11), т.к. `/v1/tracks?id=` у Audius отдаёт 403
- 2026-10-01 / этап 7 / чтение — после гидратации (`nuxtApp.hook("app:mounted")`), запись — `watch(..., { deep: true })`; всё в `useFavorites()`, вызванном один раз из `plugins/favorites.client.ts`
- 2026-10-01 / окружение / рабочая машина: VPN ломает IPv6-loopback → дев-сервер запускать с `--host 127.0.0.1`. Правку `nuxt.config.ts` ученик делать отказался
- 2026-09-26 / этап 6 / UI-заглушки (GlobalPlayer) пишет ментор по просьбе ученика; логика и state — за учеником
- 2026-09-21 / этап 4 / источник музыки — Audius REST API / публичный ключ в runtimeConfig.public; secret не на клиенте
- 2026-09-28 / процесс / harness: `AGENTS.md` + `.agent/` + Cursor rules/skills/commands. Mentor vs Implementer. Старый `.cline/` (кроме README) не источник правды
- 2026-09-24 / процесс / цикл: теория → пересказ → задача → план → код ученика и ревью по ходу → контрольные → следующий этап. Заметки пишет ментор
- 2026-09-24 / стек / Tailwind не в проекте; этап 14
- 2026-10-01 / план / до этапа 8: CI, затем ESLint+Husky. Storybook — подэтап 9.1. Docker — 16.1. Mongo — только в этапе 17 вместе с серверным избранным
- 2026-10-01 / процесс / перед задачей с новым API Nuxt ментор показывает пустой каркас файла и когда он выполняется. Логику среза пишет ученик
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
- Почему очередь не хранить только в `GlobalPlayer`?
- Почему громкость не `useFetch`?
- Почему `localStorage` на сервере — это падение, а не пустое значение?
- Чем hydration mismatch отличается от постгидратационного патча?
- Почему `watch`, объявленный в `setup` страницы, теряет данные при переходах?
- Когда cookie честнее `localStorage`?
- Почему `onMounted` не работает в плагине и что использовать вместо него?

## Как продолжить в новом чате

> Продолжаем этап 7, срез 1. Теория и ТЗ согласованы, кода нет: наполнить `app/composables/useFavorites.ts`, создать `app/plugins/favorites.client.ts` (папку `plagins` переименовать в `plugins`). Смотри `docs/PROGRESS.md`.
