# Журнал: как было → что сделал → что произошло → как есть сейчас

## 2026-09-26 — сессия 1 (до смены роли агента)

**Как было**
- `app/stores/player.ts`: `2304 Cannot find name 'defineStore'`, `2339 Property 'currentTrack' / 'isPlaying' does not exist on 'this'`.
- `app/components/TrackCard.vue`: `2552 Cannot find name 'usePlayerStore'` + неиспользуемая `const playerStore = usePlayerStore()`.
- Причина: `modules: ["@pinia/nuxt"]` лежал внутри `runtimeConfig` в `nuxt.config.ts`.
- `app/components/GlobalPlayer.vue` и `app/components/Plug.vue` — по 0 байт; `app/.nuxt/` (35 файлов) и `app/package-lock.json` — мусор от запуска `nuxi` из папки `app/`.

**Что сделал (по запросам пользователя)**
- Пользователь сам поднял `modules` на верхний уровень `nuxt.config.ts` (20:24) → `.nuxt` перегенерирован (20:25), ошибки ушли.
- Написал визуальную заглушку плеера (сначала в `GlobalPlayer.vue`); пользователь перенёс её в `PlayerControls.vue`, удалил `Plug.vue`, `GlobalPlayer.vue` остался пустым.
- Удалил `app/.nuxt` и `app/package-lock.json`.
- Написал `GlobalPlayer.vue`: бар = `<PlayerControls />` + ряд `mute | timeline | heart`, без логики и без store.
- Обновил `docs/PROGRESS.md` (по правилу из `.cursor`, которое с этого дня вне моей зоны).

**Что произошло (проверки)**
- `vue/compiler-sfc`: `sfc parse errors: 0`, `template compile errors: 0`, 1 scoped-стиль, 2134 → 2572 байта.
- `GET http://localhost:3000` → `status: 200`, в SSR-HTML: `global-player__row`, `global-player__timeline`, `aria-label="Mute"`, `aria-label="Add to favorites"`, `<h1>Home</h1>`.
- `.nuxt/components.d.ts` (21:01:12): есть `GlobalPlayer` и `PlayerControls`, `Plug` пропал.

**Как есть сейчас**
- `TrackCard` — презентационная, эмитит `play`/`favorite`; `/` и `/search` вызывают `playerStore.playTrack(track)`.
- `GlobalPlayer` + `PlayerControls` — визуальные заглушки без store-связи; `GlobalPlayer` смонтирован в `layouts/default.vue`.
- Тестового тулинга нет; dev-сервер работает на :3000.

**Открытые вопросы**
- Имя служебной папки: `.clibne` (как в запросе) или `.cline` / `.clinerules`.
- Оставить правки в `docs/PROGRESS.md` или откатить.
- Добавлять ли `/.clibne/` в `.gitignore`.
- `PlayerControls.vue`: обёртка `.container` (`padding: 1rem`) и классы `global-player*` — можно почистить; я не трогал.

## 2026-09-27 — сессия 2 (смена роли)

**Как было**
- Агент работал по менторскому протоколу из `.cursor/rules/nuxt-mentor.mdc`: читал `docs/`, вёл `docs/PROGRESS.md`, объяснял теорию.

**Что сделал**
- Создал `.clibne/`: `README.md`, `context.md`, `project-plan.md`, `verification.md`, `constraints.md`, `observability.md`.
- Перенёс план курса (этапы 1–17), текущий этап 6 и его DoD, решения, карту файлов.
- Зафиксировал владение проектом (пользователь + Cursor) и роль агента (исполнитель boilerplate по прямому запросу).

**Что произошло (проверки)**
- Перечисление файлов папки (см. отчёт сессии).
- Правок в коде проекта не делал: изменилось только добавление новой папки — подтверждено `git status --short`.

**Как есть сейчас**
- Агент читает `.clibne/` перед каждой задачей, не читает `.env*` и `.cursor/**`, не ведёт `docs/**`, код и конфиги меняет только по прямому запросу.

## 2026-09-27 — сессия 3 (сверка состояния после правок пользователя)

**Как было (на момент сессии 1)**
- `GlobalPlayer.vue` — 2572 байта, `<script setup lang="ts">` с комментариями, `.global-player__timeline { height: 0.375rem }`.

**Что произошло**
- Пользователь правил компоненты между сессиями, я этого не делал: `GlobalPlayer.vue` (26.09 21:48, 2218 байт) — убрал комментарии, оставил пустой `<script setup lang="ts"></script>`, поднял таймлайн до `height: 1rem`; `PlayerControls.vue` (27.09 12:27, 2359 байт) — тоже пустой `<script setup lang="ts"></script>`.
- Проверка SFC из `verification.md` упала на `compileScript`: `[@vue/compiler-sfc] SFC contains no <script> tags`. Причина: `parse()` **отбрасывает пустой блок** `<script setup>` — пробник по трём SFC дал `scriptSetup: no` для `GlobalPlayer.vue` и `PlayerControls.vue`, `scriptSetup: yes` (185 символов) для `TrackCard.vue`.
- Ошибка была в моей инструкции, не в проекте: в `verification.md` добавлен guard перед `compileScript` и пометка про пустой скрипт.

**Что произошло (проверки)**
- Пробник: `parse errors: 0` у всех трёх SFC; блоки `template` + `styles` на месте.
- `GET http://localhost:3000` (порт слушает) → `status: 200`, маркеры `global-player__timeline`, `global-player__btn`, `track-card`, `aria-label="Mute"`, `<h1>Home</h1>`.
- Временные скрипты удалены (`Get-ChildItem -Filter '.check*'` пусто); `git status --short` — из нового только `.clibne/`.

**Как есть сейчас**
- `GlobalPlayer.vue` (2218 б) и `PlayerControls.vue` (2359 б) — валидные SFC с пустыми `<script setup lang="ts">`; собираются и рендерятся.
- Папка заметок переименована пользователем: `.clibne/` → `.cline/` (6 файлов, отслеживается git, 27.09).
- `docs/PROGRESS.md` — правки прошлой сессии решено оставить.

## 2026-09-27 — сессия 4: плеер зафиксирован при скролле

**Как было**
- `.app-main { padding: 1.25rem }` — обычный блок; layout рендерил `header` + `<main>` + `<footer><GlobalPlayer /></footer>` в потоке, без растяжки на высоту вьюпорта и без позиционирования. Плеер был виден только в самом низу страницы и уезжал при скролле.
- У `.global-player` не было `background`, поэтому вынести бар из потока было нельзя без просвечивающего контента.

**Что сделал (прямой запрос: «плеер зафиксирован и двигается вместе со скроллом»)**
- `app/app.vue`: `.app-main` → `display: flex; flex-direction: column; min-height: 100vh; box-sizing: border-box`; `padding: 1.25rem` убран (перенесён в `.app-content`).
- `app/layouts/default.vue`: `<main class="app-content">` + `.app-content { flex: 1 1 auto; padding: 1.25rem }`; `<footer class="app-footer">` + `.app-footer { position: sticky; bottom: 0; z-index: 10 }`.
- `app/components/GlobalPlayer.vue`: добавлен `background: #fff` в `.global-player`.

**Что произошло (проверки)**
- SFC-проверка (`app/layouts/default.vue`, `app/components/GlobalPlayer.vue`) — вывод в отчёте сессии: parse/template errors `0`.
- SSR: `/`, `/favorites`, `/playlists`, `/search` → `status: 200`; в HTML есть `app-content`, `app-footer`, `global-player__timeline`.
- Временный скрипт `.check-sfc.tmp.mjs` удалён.

**Как есть сейчас**
- Бар плеера приклеен к нижней кромке вьюпорта при скролле (`position: sticky`) и растянут на ширину страницы; на коротких страницах стоит у низа (за счёт `min-height: 100vh` + `flex: 1 1 auto`).
- Побочный эффект: `header` стал во всю ширину (раньше был вложен в padding `.app-main`), отступы страниц переехали в `.app-content`.
- CSS-правила подтверждены по отдаваемому браузеру стилевому модулю (`/_nuxt/layouts/default.vue?vue&type=style&index=0&lang.css`, status 200): `.app-footer { position: sticky; bottom: 0; z-index: 10 }`. Визуальную проверку скроллом делает пользователь.

## 2026-09-27 — сессия 5: шапка (nav) зафиксирована при скролле

**Как было**
- `.app-header` — обычный flex-блок: `display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-bottom: 1px solid #ddd`. Своего фона не было, позиционирования тоже — при скролле шапка уезжала вверх.

**Что сделал (прямой запрос: «так же давай зафиксируем nav»)**
- `app/layouts/default.vue`: в `.app-header` добавлены `position: sticky; top: 0; z-index: 10; background: #fff`. Остальные свойства не менял.

**Что произошло (проверки)**
- SFC-проверка `app/layouts/default.vue` и `app/components/GlobalPlayer.vue` → parse/template errors `0`.
- SSR `/` → `status: 200`; маркеры `app-header`, `app-content`, `app-footer`, `global-player__timeline`.
- Временный скрипт `.check-sfc.tmp.mjs` удалён.

**Как есть сейчас**
- И шапка, и бар плеера прилипают к краям вьюпорта (`sticky top: 0` / `sticky bottom: 0`), контент скроллится между ними; у обоих белый фон и `z-index: 10`.
- CSS-правила подтверждены в отдаваемом браузеру стилевом модуле: `.app-header { position: sticky; top: 0; z-index: 10; background: #fff }` (status 200). Метод добавлен в `verification.md` как проверка 2b. Визуальный скролл — за пользователем.


## 2026-09-27 — сессия 6: диагностика `git push` (только чтение, правок нет)

**Как было (симптом)**
- `git commit` прошёл: root-commit `b4ea7c4`, 36 файлов. Но `git push -u origin main` дал две разные ошибки:
  1) `error: src refspec main does not match any` (до `git branch -M main`);
  2) после переименования ветки: `remote: Invalid username or token. Password authentication is not supported for Git operations.` → `fatal: Authentication failed`.
- Гипотеза пользователя: «нужно настроить SSH».

**Что сделал (только чтение; ни конфиг git, ни remote, ни ключи не трогал)**
- `git remote -v` → `origin https://github.com/Georgie07876/open-music-player.git` (HTTPS).
- `git branch -vv` → `main b4ea7c4 first commit`; рабочее дерево чистое.
- `git config --show-origin --get-all credential.helper` → `manager` (Git Credential Manager 2.8.0 из `C:/Program Files/Git/etc/gitconfig`).
- `cmdkey /list | Select-String github` → пусто: сохранённых креденшелов нет.
- `git credential fill` (с `GCM_INTERACTIVE=never`, `GIT_TERMINAL_PROMPT=0`) → `fatal: could not read Username` ⇒ готового креденшела нет, промпт отключён.
- `git -c credential.helper= ls-remote <https-url>` → exit 0 без ссылок ⇒ репозиторий существует, **публичный и пустой**.
- `ssh -T -o BatchMode=yes git@github.com` → `Permission denied (publickey)`; в `~/.ssh` только `known_hosts`; служба `ssh-agent` — `Stopped / Disabled`; `gh` не установлен; ssh-клиент OpenSSH 9.5p2 есть.
- `git config --global user.name/user.email` → `Name your mom` / `zazazazazazazajdfiu@mail.ru` (мусорные значения; этим подписан коммит).

**Что произошло (выводы)**
- Ошибка 1 — рассинхрон имён веток: коммит создан на `master` (нет `init.defaultBranch`), пушили `main`. Пользователь исправил сам (`git branch -M main`).
- Ошибка 2 — аутентификация: HTTPS-пуш требует токен или SSH-ключ, GitHub не принимает пароль. SSH-гипотеза верна по сути, но на машине **вообще нет ключей** и агент выключен.
- Репозиторий пустой и публичный ⇒ после настройки доступов пуш пройдёт без force и без merge.

**Как есть сейчас**
- Ничего не изменено. Пользователю предложены три пути (SSH / PAT / gh CLI) с точными командами и отмечено, что локальную часть могу выполнить по его слову.
- Отдельно помечено: `user.name`/`user.email` — мусорные, коммит подписан ими; стоит поправить до пуша (`git commit --amend --reset-author`).

## 2026-09-27 — сессия 7: SSH починен, git пошёл через Windows OpenSSH

**Как было (симптом)**
- После `git remote set-url origin git@github.com:...` команда `git ls-remote origin` падала: `Could not create directory '/c/Users/\303\345\356\360\343\350\351/.ssh' (No such file or directory)` → `git@github.com: Permission denied (publickey)`.

**Что сделал**
- Диагностика: ключ `C:\Users\Георгий\.ssh\id_ed25519` (+ `.pub`, создан в 14:18) существует; `ssh` в PATH = `C:\Windows\System32\OpenSSH\ssh.exe` (кириллицу в пути понимает), но `git` по умолчанию вызывает `C:\Program Files\Git\usr\bin\ssh.exe` (MSYS), который ломается на не-ASCII имени профиля (`\303\345\356\360\343\350\351` = UTF-8 «Георгий» в мусорной кодировке), поэтому `~/.ssh` для него не существует.
- `core.sshCommand`, `GIT_SSH`, `GIT_SSH_COMMAND` были пусты, `HOME` — пуст.
- Применил: `git config --global core.sshCommand "C:/Windows/System32/OpenSSH/ssh.exe"`. Откат: `git config --global --unset core.sshCommand`.

**Что произошло (проверки)**
- `ssh -T -o BatchMode=yes git@github.com` → `Hi Georgie07876! You've successfully authenticated, but GitHub does not provide shell access.` (exit 1 — это норма).
- `git ls-remote origin` (с `GIT_SSH_COMMAND=<ssh> -o BatchMode=yes`) → `exit: 0`, вывод пуст ⇒ доступ работает, репозиторий пустой.
- Отпечаток ключа: `SHA256:kgLjJ1wzEg2mi11Wc4yqcgfGApebfT1LTxOnF7f5PpU home-pc-win11 (ED25519)`.
- Состояние git: коммит `982b5dd`, автор `Georgie07876 <zazazazazazazazajdfiu@mail.ru>`; локально только `main`, на remote ветвей нет, пуш ещё не выполнялся; в рабочем дереве некоммитнутая правка `.cline/observability.md`.
- GitHub API (`/users/Georgie07876`): login `Georgie07876`, id `113280545` ⇒ noreply-адрес `113280545+Georgie07876@users.noreply.github.com`.

**Как есть сейчас**
- `main` и `dev` запушены пользователем и синхронизированы с origin (`617c4bb`); автор коммита — `Georgie07876 <113280545+Georgie07876@users.noreply.github.com>` (вариант B).
- Приватный ключ не читался и нигде не печатался; в браузере GitHub пользователь добавил ключ сам.

## 2026-09-27 — сессия 8: коммит журнала + трек и исполнитель в плеере

**Как было**
- `.cline/observability.md` был изменён и не закоммичен на ветке `dev`.
- В `app/components/GlobalPlayer.vue` лежала **незакоммиченная попытка пользователя**: `const playerStore = usePlayerStore()` в скрипте и текст трека **внутри** `.global-player__timeline` (`<p class="global-player__timeline-text" v-if="playerStore.currentTrack">`). Логика верная, но таймлайн — высотой `1rem` с `overflow: hidden` и `border-radius: 999px`, поэтому текст не виден; класса `.global-player__timeline-text` в стилях не было вовсе.

**Что сделал**
1. Коммит журнала: `git add .cline/observability.md` → `docs(cline): log git push diagnosis and ssh fix` → `git push` (`617c4bb..2a85138 dev -> dev`).
2. `app/components/GlobalPlayer.vue` (запрос: «выводить текущий играющий трек из store и исполнителя в плеере после play по треку»):
   - добавлен ряд `.global-player__top` (grid `1fr auto 1fr`): слева `.global-player__now` (title + artist), в центр — `<PlayerControls class="global-player__controls" />`;
   - у `PlayerControls` появился класс-однофамилец и правило `.global-player__controls { grid-column: 2 }` — контролы остаются по центру и при пустом сторе, и при выбранном треке (без «прыжка» разметки);
   - текст убран из таймлайна, элемент `.global-player__timeline-text` удалён;
   - стили `.global-player__now/__title/__artist` (ellipsis, приглушённый артист); авторская строка `const playerStore = usePlayerStore()` оставлена.

**Что произошло (проверки)**
- SFC-проверка `GlobalPlayer.vue` → `parse errors: 0`, `template errors: 0`.
- SSR `GET /` → `status: 200`; маркеры `global-player__top`, `global-player__controls`, `global-player__row`, `global-player__timeline`, `app-footer`; `global-player__now` в SSR **отсутствует** (трек не выбран) — ожидаемо верно.
- CSS-модуль `/_nuxt/components/GlobalPlayer.vue?vue&type=style&index=0&lang.css` → 200, 8673 б, содержит `global-player__now`, `global-player__title`, `grid-template-columns: 1fr auto 1fr`.
- JS-модуль `/_nuxt/components/GlobalPlayer.vue` → 200, 10831 б, содержит `currentTrack` и `usePlayerStore`.
- Интерактив (клик Play → появился текст) автоматически не проверяется: браузера и тест-тулинга нет. Проверяет пользователь.

**Как есть сейчас**
- Плеер показывает `title` и `artist` из `playerStore.currentTrack` после клика Play на карточке (`/` или `/search`).
- Эту правку пользователь закоммитил и запушил сам (`1883b8f`, вместе с моими заметками), позже переписал коммит → `092d330`; хвост «и запушу в dev» из текста агента в сообщении остался.

## 2026-09-27 — сессия 9: очередь в сторе + `volume` числом

**Как было**
- `app/stores/player.ts`: `volume: null as number | null` — смешивало «ещё не задали» и «выключено»; `queue: <Track[]>[]` не наполнялся: `playTrack` менял только `currentTrack` и `isPlaying`, то есть очередь была мёртвым состоянием.

**Что сделал (по прямому запросу)**
- `volume: 0.8` — число (диапазон 0..1, как у `HTMLAudioElement.volume`).
- `playTrack` дополнен: если в `queue` нет трека с таким `id` — `push`; иначе только `currentTrack`/`isPlaying`. Дублей нет.

**Что произошло (проверки)**
- Новый переиспользуемый тест `.cline/checks/player-store.check.mjs` (описан в `verification.md`, проверка 4b): компилирует реальный файл стора, подменяет автоимпорт `defineStore` настоящим из Pinia, создаёт store и проверяет значения → **11/11 PASS** (начальное состояние, очередь 1 при повторе того же `id`, 2 при новом `id`, последний элемент очереди, `currentTrack`).
- Отданный dev-сервером модуль `/_nuxt/stores/player.ts` (200, 2158 б) содержит `queue.some((item) => item.id === track.id)`, `this.queue.push(track)` и `volume: .8`.
- Мусора не осталось: `.check-*` в корне нет, временный transformed-файл удаляет сам тест.

**Как есть сейчас**
- Очередь наполняется без дублей по `id`, `volume` = `0.8`; pause/toggle у `playTrack` по-прежнему нет (следующий срез).
- Всё закоммичено и запушено в `dev` (`origin/dev` = `cf0da40`): `ef69d50` — store (очередь + volume), `2e8b719` — `.cline` (тест стора + заметки), `cf0da40` — правка пользователя в `app/pages/index.vue`. Рабочее дерево чистое.
- `origin/main` пока на `617c4bb` — слияние `dev → main` не делалось (по процессу: через Pull Request).

## 2026-09-28 — harness L2 (Cursor + portable agents)

**Как было**
- Одна always-on менторская правило, плюс папка `.cline/` с дублем плана курса, расплывчатой ролью Cline и опечатками (`.clibne`). Нет `AGENTS.md`, нет scoped rules, нет skills/commands. Контекст копился и расходился с `docs/`.

**Что сделал**
- `AGENTS.md` — вход для Cursor / Cline / Codex. Два режима: Mentor / Implementer.
- `.cursor/rules`: mentor (always), guardrails (always, коротко), conventions (globs на `app/`).
- Skills `mentor-session` и `implementer`; команды `/continue` и `/implement`.
- Память и проверки перенесены в `.agent/` (`decisions.md` вместо копипасты LEARNING). `.cline/` оставлен как указатель.

**Что произошло (проверки)**
- Файлы на месте; продукт (`app/`) не менялся. Это tooling, не фича плеера.

**Как есть сейчас**
- Новый чат на любом ПК читает git-harness, а не «как получится из промпта».
- Не подключены MCP, RAG, eval-фреймворк — рано для размера репо.

## 2026-10-02 — проверка закрытого среза 7.1 на домашней машине (harness)

**Как было**
- Срез 7.1 (persistence избранного) закрыт дома, репозиторий чистый (`a4f3cbf`), папка `plagins` удалена, файлы наполнены. `.nuxt/` оставался от 29.09 — то есть сгенерирован ещё до появления композабла.

**Что сделал**
- Только чтение и `npx nuxi prepare`. Код продукта не менял.
- Поправил 3 устаревшие строки в `docs/PROGRESS.md` («Что уже есть», «Как продолжить»): они противоречили факту закрытого среза.

**Что произошло (проверки: команда → результат)**
- `git show --name-status a4f3cbf` → `D app/plagins/favorites.client.ts`, `A app/plugins/favorites.client.ts` — это перенос, а не вторая папка рядом.
- `npx nuxi prepare` → «Types generated in .nuxt»; `git status` после — чисто (`.nuxt` в `.gitignore`).
- `.nuxt/imports.d.ts:36` → `export { useFavorites } from '../app/composables/useFavorites';`
- `.nuxt/types/plugins.d.ts:23` → `InjectionType<typeof import("../../app/plugins/favorites.client")>` — плагин реально подключён.
- Дев-сервер не запущен (порт 3000 пуст), поэтому браузерные проверки DoD в этой сессии не воспроизводились.

**Как есть сейчас**
- Связка «композабл ← плагин» подтверждена по сгенерированным типам, а не «по виду кода».
- Расхождение с согласованным ТЗ в `app/composables/useFavorites.ts`: нет `try/catch` вокруг `JSON.parse`, нет проверки `Array.isArray` и `removeItem`, ключ захардкожен дважды. DoD-чекбоксы этапа 7 в `docs/LEARNING.md` остались `[ ]`, при том что в `docs/PROGRESS.md` этап закрыт.

**Открытые вопросы**
- Оставить незащищённый `JSON.parse` до этапа 8 или закрыть мини-срезом сейчас (битый ключ способен уронить приложение).
- Тикать ли DoD-чекбоксы этапа 7 в `docs/LEARNING.md`.

## 2026-10-02 — микро-срез 7.1a: проверка предложенного кода + правка правил

**Что сделал**
- Проверил предложенный (не применённый) `useFavorites`: временный чек по образцу `.agent/checks/player-store.check.mjs` — реальный файл через `transformWithOxc`, стабы `useFavoritesStore` / `watch` / `useNuxtApp` / `localStorage`, 7 сценариев. Текущий код → 9 FAIL (throw в `app:mounted`, `tracks` стал строкой), предложенный → 17/17 PASS. Временные файлы удалены.
- Обновил правила: `.cursor/rules/nuxt-mentor.mdc` и `.cursor/skills/mentor-session/SKILL.md` — исчерпывающее объяснение концепций вместо каркасов, никаких шаблонов кода; `AGENTS.md` — секция «Answer style» (без очевидного, доказательства в `.agent/`); `docs/PROGRESS.md` — решения 2026-10-02.
- Код продукта не менял: `app/composables/useFavorites.ts` остался как есть, ждёт решения ученика.

**Открытые вопросы**
- Применять ли код микро-среза и переносить ли чек в `.agent/checks/use-favorites.check.mjs` (нужен явный запрос).

**Как было**
- Проект перенесён с домашней машины на рабочую, `npm install` сделан, но данные с API не приходили, а с включённым VPN сайт отдавал `ERR_CONNECTION_REFUSED`. Пользователь подозревал код/ключ API.

**Что сделал**
- Только чтение и диагностика. Код продукта **не менял**: правку `nuxt.config.ts` пользователь отклонил.
- Изменены только заметки: `docs/PROGRESS.md` (позиция курса, журнал, решения, банк вопросов, «как продолжить»); `.agent/decisions.md` (persistence + окружение + ловушки); `.agent/verification.md` (рецепт проверки persistence).
- Провёл менторскую сессию среза 7.1: теория → пересказ → две итерации плана → ТЗ.

**Что произошло (проверки: команда → результат)**
- `Get-NetTCPConnection -LocalPort 3000` → `::1` LISTENING, PID 34688 (`nuxi dev`, старт 10:26).
- `127.0.0.1:3000` → «target machine actively refused»; TCP на `::1` не проходит даже к другим живым слушателям (`::1:42050`), а `127.0.0.1:65529/54112/62473` → OK.
- `ping -6 ::1` → **General failure** (100 % loss). `Get-NetRoute -AddressFamily IPv4` → `0.0.0.0/0` через `happ-xray` с метрикой 0; у `happ-xray` `IPv6Connectivity: NoTraffic`.
- `node -e "dns.lookup('api.audius.co')"` → 8.6.112.0 / 8.47.69.0; `node -e "fetch(...trending...)"` → **HTTP 200 за 889 мс** (через туннель).
- `https://api.audius.co/v1/tracks/trending` без параметров → 200, 650 КБ; с мусорным `public_Key` → 200; заголовок `access-control-allow-origin: *`.
- `https://api.audius.co/v1/tracks?id=…` → **403** (пакетного запроса по id нет).
- Прокси: `ProxyEnable=0`, `netsh winhttp show proxy` → Direct access, env-proxy нет. Файрвол включён, но причина не в нём.
- Исходники (точечно, для доказательства поведения): `nuxt/dist/app/entry.js` (порядок `applyPlugins` → `mount` → `app:mounted`), `pinia/dist/pinia.js` (`detached`/`getCurrentScope`, `$subscribeOptions = { deep: true }`), `@vue/runtime-core` (`scope.stop()` при unmount, `injectHook` warn вне setup), `nuxt/dist/app/components/nuxt-layout.js` (key = имя layout).
- `.nuxt/`: `imports.d.ts` → только `useFavoritesStore`; `types/plugins.d.ts` → `favorites` отсутствует; поиск `plagins` по всему `.nuxt/` → **ни одного совпадения**.

**Как есть сейчас**
- Диагноз рабочей машины: (1) Nitro слушает только `::1`, а VPN ломает IPv6-loopback → браузер не доходит до дев-сервера; (2) без VPN сеть офиса не пускает на `api.audius.co`. Код и ключ API ни при чём.
- Обход: `npm run dev -- --host 127.0.0.1`, адрес `http://127.0.0.1:3000`.
- Срез 7.1 не закрыт: `app/composables/useFavorites.ts` и `app/plagins/favorites.client.ts` (папка с опечаткой, Nuxt её не видит) существуют, но по 0 байт; код не написан; DoD не проверялся.
- `git status`: `M docs/PROGRESS.md`, `M .agent/*`, `M package-lock.json` (след `npm install`), `?? app/composables/`, `?? app/plagins/`.

**Открытые вопросы**
- Переименует ли пользователь `app/plagins/` в `app/plugins/` сам (я `app/**` не трогал) — иначе плагин молча не подключится.
- Дома IPv6-loopback, вероятно, жив, поэтому `--host` там может быть не нужен; проверить при первом запуске.

## 2026-10-02 — этап 7.2 (CI): инструменты, ловушка TS 7, разбор драфта workflow

**Как было**
- 7.2 не начат: в `package.json` не было блока `devDependencies` и скрипта `typecheck`; каталога `.github/` не существовало; локальный Node 20.19.0 не поддерживается Nuxt (`EBADENGINE` на каждой установке).

**Что сделал**
- Теория CI (workflow/job/step/runner/event, config as code, `npm ci` vs `npm install`, typecheck vs build, версия Node, секреты в публичном репозитории) и разбор драфта workflow ученика. Workflow не писал — его пишет ученик.
- Точечные проверки и правка окружения; обновил `docs/PROGRESS.md`, `.agent/decisions.md`, `.agent/verification.md`.

**Что произошло (команда → результат)**
- `node -v` → v24.18.0 (переключил ученик), `npm -v` → 11.16.0; `npm ci` → `EBADENGINE` исчез, `postinstall → nuxt prepare`, added 598 (на npm 10 и том же lockfile было 588).
- `npm install -D typescript vue-tsc` → `typescript@7.0.2` + `vue-tsc@3.3.12`; `npm run typecheck` → `ERR_PACKAGE_PATH_NOT_EXPORTED: './lib/tsc'`. У TS 7 в `exports` только `./package.json`, `.`, `./unstable/*`.
- `npm install -D typescript@5` → 5.9.3; `npm run typecheck` → пусто, `LASTEXITCODE=0`.
- `npm ci` → `npm warn allow-scripts esbuild@0.28.2 (postinstall: node install.js)`; при этом `node_modules/esbuild/bin/esbuild` и `@esbuild/win32-x64/esbuild.exe` на месте (бинарь приходит платформенным пакетом, скрипт ни при чём).
- GitHub API: `private: false` → Actions на стандартных раннерах бесплатен; `default_branch` = `main` (не `master`).
- Драфт ученика: три job'а (`CI`, `Types`, `Nuxt:build`) — каждый на своей VM без checkout и без `node_modules`; триггер только `push`.
- `git status` на момент фиксации: `M package.json`, `M package-lock.json`, `D server/api/__config-probe.ts` (удалил ученик), `M app/composables/useFavorites.ts` (микро-срез 7.1a), правки заметок и правил.

**Как есть сейчас**
- Инструменты стоят, `typecheck` зелёный, правок типов не потребовалось. Пайплайна нет: `.nvmrc`, `engines`, `.github/workflows/*.yml`, строка в `README` не созданы.
- `npm install -D` меняет lockfile → коммитить вместе с `package.json`, иначе `npm ci` в CI упадёт на рассинхроне (ожидаемое поведение).

**Открытые вопросы**
- `.nvmrc`: точная версия (`24.18.0`) или линия (`24`) — решает ученик.
- Секрет `audiusSecret` закоммичен в `nuxt.config.ts`; правильная форма (только env) — этап 10.







