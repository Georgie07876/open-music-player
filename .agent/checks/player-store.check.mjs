// Runtime check for app/stores/player.ts (see .agent/verification.md, check 4b).
// Runs the real store file through esbuild, injects Nuxt's auto-imported
// defineStore as a global, then exercises the store with real Pinia.
// Usage: node .agent/checks/player-store.check.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createPinia, defineStore, setActivePinia } from "pinia";
import { transformWithEsbuild } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const srcFile = path.join(root, "app", "stores", "player.ts");
const outFile = path.join(root, ".check-store.transformed.tmp.mjs");

const source = fs.readFileSync(srcFile, "utf8");
const { code } = await transformWithEsbuild(source, srcFile, {
  format: "esm",
  target: "esnext",
});

fs.writeFileSync(outFile, code, "utf8");
globalThis.defineStore = defineStore;

let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"} | ${label} | actual: ${JSON.stringify(actual)} | expected: ${JSON.stringify(expected)}`,
  );
};

try {
  const mod = await import(pathToFileURL(outFile).href);
  setActivePinia(createPinia());
  const store = mod.usePlayerStore();

  check("initial currentTrack", store.currentTrack, null);
  check("initial isPlaying", store.isPlaying, false);
  check("initial queue", store.queue, []);
  check("initial volume", store.volume, 0.8);

  store.playTrack({ id: "1", title: "Night Drive", artist: "Nova Line", duration: 214 });
  check("after play: currentTrack.id", store.currentTrack?.id, "1");
  check("after play: isPlaying", store.isPlaying, true);
  check("after play: queue length", store.queue.length, 1);

  store.playTrack({ id: "1", title: "Night Drive", artist: "Nova Line", duration: 214 });
  check("same id again: queue length (no duplicates)", store.queue.length, 1);

  store.playTrack({ id: "2", title: "Soft Signal", artist: "Amber Room", duration: 198 });
  check("new id: queue length", store.queue.length, 2);
  check("new id: last in queue", store.queue[store.queue.length - 1]?.id, "2");
  check("new id: currentTrack.id", store.currentTrack?.id, "2");
} finally {
  fs.unlinkSync(outFile);
}

console.log(failures === 0 ? "ALL CHECKS PASSED" : `FAILURES: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
