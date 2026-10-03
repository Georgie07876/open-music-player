# Прогресс обучения — Open Music Player

Этот файл — живой контекст между сессиями. Ментор читает его в начале чата и обновляет в конце рабочей сессии.

## Сейчас

| Поле | Значение |
| --- | --- |
| Этап | **7.2 — CI** (этапы 1–7 и срез persistence закрыты) |
| Статус этапа | Пайплайн закоммичен (`b11e04f`), прогоны #1 и #2 зелёные (push и pull_request), триггеры подтверждены. Остался DoD-пункт «сломанный тип роняет проверку» |
| Следующий шаг | Сломать тип (`volume: "loud"` в `app/stores/player.ts`) → push → убедиться, что красный именно на шаге `Typecheck` → починить и запушить |
| Toolchain | Node **24.18.0** (nvm-windows, переключение вручную). Nuxt 4.5.2 требует `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` — на Node 20.19.0 был `EBADENGINE`. devDependencies: `typescript@^5.9.3`, `vue-tsc@^3.3.12`. `npm run typecheck` — зелёный. На домашнем ноутбуке (03.10) поставлена та же 24.18.0, `npm ci` → 597 пакетов, `typecheck` exit 0 |
| Дев-сервер | Nitro слушает только `localhost` → `[::1]`. Если IPv6-loopback недоступен (рабочий VPN), запускать `npm run dev -- --host 127.0.0.1` и открывать `http://127.0.0.1:3000`. Дома IPv6-loopback жив: `localhost:3000` → 200, обход не нужен |
| Язык обучения | Русский, код на английском |
| Tailwind | Не установлен и не в стартовом стеке. Появляется только на этапе 14 |

## Что уже есть в репозитории

- Layout, страницы `/`, `/search`, `/track/[id]`, `/favorites`, `/playlists`
- Данные треков с **Audius** через `useFetch` (trending, search, track by id)
- `toTrack` пока дублируется на страницах
- Play / Favorite: карточка → TrackList → `/`, `/search`, `/favorites` → player/favorites store
- `useFavoritesStore.tracks`, toggle, `isFavorite` — владелец домена; persistence избранного в `useFavorites()` + `plugins/favorites.client.ts`, ключ `omp:favorites:v1`
- Избранное переживает F5; компоненты о `localStorage` не знают. Долг: значение `Track[]` — снапшот, цель — ids + batch (этапы 10–11)
- `/track/[id]` без кнопки Play
- `npm run typecheck` (= `nuxt typecheck`); в `devDependencies` появились `typescript`, `vue-tsc` — до этапа 7.2 блока `devDependencies` не существовало вовсе
- Временный пробник `server/api/__config-probe.ts` удалён (лежал с первого коммита)

## Журнал сессий

### 2026-10-03 — перенос на домашний ноутбук: окружение под CI (код этапа не начат)

- **Расхождение окружения:** домашняя машина знала только Node 22.17.0 (ниже `^22.19.0` из `engines` Nuxt 4.5.2), а `node_modules` был без `typescript`/`vue-tsc` → `npm run typecheck` падал с «A type checker is required»
- **Что выяснено:** неподдерживаемый Node не роняет Nuxt — только `logger.warn` (`@nuxt/cli`, `checkEngines`); npm при `engine-strict=false` даёт лишь `EBADENGINE`
- **Решение ученика:** `.nvmrc` = точная `24.18.0` (не линия `24`); поставлена `nvm install/use 24.18.0`
- **Грабли Windows:** `npm ci` дважды падал (`EPERM` → `ENOTEMPTY` на `node_modules/anymatch/node_modules`) — каталог держал запущенный `npm run dev`, поверх файловые вотчеры VS Code. Порядок лечения: остановить дев-сервер → `rmdir /s /q node_modules` → `npm ci`
- **Результат:** `npm ci` → `added 597 packages` без `EBADENGINE`; `npm run typecheck` exit 0; дев-сервер снова на `localhost:3000` (SSR 200), `127.0.0.1:3000` не отвечает — Nitro слушает только `[::1]`
- **Срез 7.2 не сдвинулся:** `.nvmrc`, `engines`, `.github/workflows/*.yml`, строка в README всё ещё не созданы

### 2026-10-02 — этап 7.2 (CI): теория, инструменты, разбор драфта workflow

- **Теория:** зачем CI (третья машина, отзыв до ревью), словарь workflow/job/step/runner/event, config as code, `npm ci` vs `npm install`, typecheck vs build, версия Node, секреты в публичном репозитории
- **Окружение:** локальный Node 20.19.0 не поддерживается Nuxt (`EBADENGINE`); ученик переключил nvm на **24.18.0** (npm 11.16.0). Число пакетов при том же lockfile изменилось 588 → 598: воспроизводимость даёт и версия инструмента, а не только lockfile
- **Ловушка TypeScript 7:** `npm install -D typescript vue-tsc` поставил `typescript@7.0.2`, а `vue-tsc@3.3.12` грузит `typescript/lib/tsc` через `require.resolve`; TS 7 закрыл это поле `exports` → `ERR_PACKAGE_PATH_NOT_EXPORTED`. Откат на `typescript@5` (5.9.3) — `npm run typecheck` зелёный. Peer-диапазон `>=5.0.0` у `vue-tsc` соврал
- **Сделано учеником:** `npm pkg set scripts.typecheck="nuxt typecheck"`; удалён `server/api/__config-probe.ts`
- **Разбор драфта workflow:** job ≠ step — ученик написал три job'а (`CI`, `Types`, `Nuxt:build`), каждый на своей чистой VM без репозитория и `node_modules`; нужен **один job с тремя step**. Плюс ошибки: нет `actions/checkout` (на раннере нет кода), нет `actions/setup-node` (версия Node не наша), потерян триггер `pull_request`, id `Nuxt:build` с двоеточием — минное поле
- **Решения:** версия Node — `.nvmrc` (читает `actions/setup-node`) + `engines` (декларация); CI — один job на `ubuntu-latest`, шаги `checkout → setup-node → npm ci → typecheck → build`, триггеры `push` + `pull_request`
- **Срез не закрыт:** `.nvmrc`, `engines`, workflow и строка в `README` не созданы; `package.json`/`package-lock.json` изменены и не закоммичены (иначе `npm ci` в CI упадёт на рассинхроне lockfile)

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
- 2026-10-02 / процесс / при новом этапе — исчерпывающее объяснение всех концепций (включая базовые Vue/Nuxt), без каркасов и шаблонов кода: объяснение должно позволить ученику самому вывести состав файлов и написание. Обязательно сравнение наивного и идиоматичного пути. Код — только по прямому запросу ученика
- 2026-10-02 / процесс / в чате: кратко, без очевидного и без пересказа того, что видно из git; доказательства — в `.agent/`, в чате максимум одна строка «команда → результат»
- 2026-10-02 / этап 7.2 / CI: один job на `ubuntu-latest`, шаги `actions/checkout` → `actions/setup-node` (читает `.nvmrc`) → `npm ci` → `npm run typecheck` → `npm run build`; триггеры `push` + `pull_request`. Job'ы не делят файловую систему, поэтому три отдельных job'а означали бы три установки зависимостей
- 2026-10-02 / стек / версия Node фиксируется двумя способами: `.nvmrc` — источник для CI, `engines` в `package.json` — декларация поддержки. nvm-windows `.nvmrc` не читает: локально переключение вручную
- 2026-10-02 / стек / `typescript` запинен на `^5.9.3`: TypeScript 7 закрыл `exports` и ломает `vue-tsc` (`require.resolve("typescript/lib/tsc")` → `ERR_PACKAGE_PATH_NOT_EXPORTED`). Nuxt-проекты пока сидят на 5.x
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
- Почему в CI `npm ci`, а не `npm install`?
- Чем job отличается от step и почему у них разная файловая система?
- Зачем на раннере `actions/checkout`, если код уже в репозитории?
- Почему проверка типов и сборка — два шага, а не один?

## Как продолжить в новом чате

> Продолжаем Open Music Player. Этап 7 закрыт, идём по **7.2 (CI)**: теория и инструменты уже готовы (Node 24.18.0, `vue-tsc` на `typescript@5.9.3`, `npm run typecheck` зелёный, связка «композабл ← плагин» для избранного готова). Осталось: `.nvmrc` + `engines`, файл в `.github/workflows/`, строка в `README`, затем пуш и проверка красного на намеренно сломанном типе. Workflow пишет ученик, ментор ревьюит. Смотри `docs/PROGRESS.md`.
