# Проверки (доказательства)

В проекте **нет** тест-инструментов: `vitest`, `vue-tsc`, `eslint` не установлены, в `package.json` нет скрипта `test`.
Поэтому доказательства — компиляция SFC, SSR-рендер живой страницы, состояние `.nuxt/*.d.ts` и чистота репозитория.
Юнит-тесты — только по прямому запросу (сначала `npm i -D vitest @nuxt/test-utils`; это правка `package.json`, значит требует разрешения).

## 1. SFC компилируется (для каждого правленного `.vue`)

Временный скрипт кладу в корень проекта (внутри проекта — чтобы резолвились зависимости), затем удаляю.

```js
// .check-sfc.tmp.mjs
import fs from "node:fs";
import { parse, compileTemplate, compileScript } from "vue/compiler-sfc";

const file = "app/components/GlobalPlayer.vue"; // ← проверяемый файл
const src = fs.readFileSync(file, "utf8");
const { descriptor, errors } = parse(src, { filename: file });

console.log("bytes:", src.length);
console.log("sfc parse errors:", errors.length, errors.map(String).join(" | "));
console.log("has template:", Boolean(descriptor.template), "| has script setup:", Boolean(descriptor.scriptSetup));

const tpl = compileTemplate({ source: descriptor.template.content, filename: file, id: "check" });
console.log("template compile errors:", tpl.errors.length, tpl.errors.map(String).join(" | "));
console.log("style blocks:", descriptor.styles.length, "| scoped:", descriptor.styles.map((s) => s.scoped).join(","));

if (descriptor.script || descriptor.scriptSetup) {
  compileScript(descriptor, { id: "check" });
  console.log("script compiled ok");
} else {
  console.log("no <script> block: template-only SFC is valid, nothing to compile");
}
```

```powershell
node .check-sfc.tmp.mjs; Remove-Item .check-sfc.tmp.mjs -Force; 'temp removed: ' + (-not (Test-Path .check-sfc.tmp.mjs))
```

Критерий: `bytes > 0`, `sfc parse errors: 0`, `template compile errors: 0`.

Важно: вызывать `compileScript` без защиты нельзя — на SFC без скрипта (например, пустой `<script setup lang="ts"></script>`) он падает с `SFC contains no <script> tags`. Это не ошибка проекта, а ограничение самой проверки, поэтому в скрипте стоит guard.

## 2. Страница живая end-to-end

Dev-сервер обычно уже запущен на :3000 (`npm run dev`). Проверка без браузера:

```powershell
try { $r = Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing -TimeoutSec 90; 'status: ' + $r.StatusCode; 'matches: ' + (($r.Content | Select-String -Pattern 'global-player__timeline|aria-label="Mute"' -AllMatches).Matches.Value | Sort-Object -Unique) -join ' | ' } catch { 'REQUEST ERROR: ' + $_.Exception.Message; if ($_.Exception.Response) { 'status: ' + [int]$_.Exception.Response.StatusCode } }
```

Критерий: `status: 200` и в HTML присутствуют маркеры изменённой разметки. Ошибка Vite даёт 500 или страницу с трейсбеком.

## 2b. CSS-правила реально отдаются браузеру (для правок со стилями)

В SSR-HTML стилей нет (тегов `<style>` — ноль); они приходят отдельными `<link rel="stylesheet">`. Проверяем содержимое этих ссылок:

```powershell
$r = Invoke-WebRequest 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 60
$hrefs = [regex]::Matches($r.Content, '<link rel="stylesheet" href="([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($h in $hrefs) { $c = Invoke-WebRequest ('http://localhost:3000' + $h) -UseBasicParsing; if ($c.Content -match 'app-header') { 'HIT ' + $h + ' | status: ' + $c.StatusCode; [regex]::Match($c.Content, '\.app-header\s*\{[^}]*\}').Value } }
```

Адрес модуля стилей SFC в dev: `/_nuxt/<путь файла от корня Vite>?vue&type=style&index=0&lang.css`, например `/_nuxt/layouts/default.vue?vue&type=style&index=0&lang.css` для `app/layouts/default.vue`.
JS-модуль того же компонента лежит рядом: `/_nuxt/<путь от каталога `app/`>` — например `/_nuxt/components/GlobalPlayer.vue` (проверено: 200, в теле есть `usePlayerStore` и `currentTrack`). Оба адреса отдают dev-сервер напрямую, без авторизации.
Критерий: `status: 200` и в теле — актуальное правило (например `position: sticky`).
Доказывает: браузер получает именно эти CSS-правила. Не доказывает: как браузер их применит при скролле — это смотрит пользователь.

## 3. Типы и автоимпорты (после правок конфига, модулей, новых файлов)

```powershell
npx nuxi prepare
Select-String -Path .nuxt/imports.d.ts,.nuxt/components.d.ts,.nuxt/types/plugins.d.ts -Pattern 'usePlayerStore|defineStore|PlayerControls|pinia'
```

Критерий: нужный автоимпорт или плагин присутствует в `.nuxt/*.d.ts`.
Если VS Code показывает старые ошибки — «TypeScript: Restart TS Server».

## 4. Репозиторий не замусорен

```powershell
git status --short
Get-ChildItem app -Force | Select-Object Name,Length
```

Критерий: появились только файлы заявленного объёма; временные скрипты удалены; чужие файлы не тронуты (сверить даты/состав до и после).

## 4b. Runtime-тест стора (поведение, а не «выглядит правильно»)

Скрипт: `.agent/checks/player-store.check.mjs`. Запуск:

```powershell
node .agent/checks/player-store.check.mjs
```

Что делает: компилирует `app/stores/player.ts` через esbuild → пишет временный `.check-store.transformed.tmp.mjs` в корень проекта → объявляет `globalThis.defineStore` (настоящий из `pinia`, потому что в Nuxt он автоимпортируется и в чистом node не существует) → импортирует модуль → создаёт Pinia и проверяет фактические значения, печатая `PASS/FAIL`.
Критерий: `ALL CHECKS PASSED`, exit code `0`, временный файл удалён.
Замечания: `transformWithEsbuild` в Vite 7 помечен deprecated (`transformWithOxc`) — предупреждение безвредно; esbuild нормализует литералы (`0.8` → `.8`), поэтому не проверяйте отданный код строками вида `volume: 0.8` — строковая проверка даст ложный `False`.

## 5. Что доказательством НЕ считается

- «Код выглядит правильно», «должно работать».
- Вывод по памяти без запуска команды.
- «Ошибок в консоли не было» без указания, что именно запускалось.

## Шаблон отчёта

```text
Задача: …
Проверка:
- команда → результат
Вывод: работает / не работает (что именно не сходится)
Ограничения проверки: … (если проверить нечем — сказать прямо)
```
