import type { Track } from "~/utils/mock-tracks";

const STORAGE_KEY = "omp:favorites:v1";

function isTrackList(value: unknown): value is Track[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item?.id === "string")
  );
}

export function useFavorites() {
  const store = useFavoritesStore();

  watch(
    () => store.tracks,
    (newTracks) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTracks));
    },
    { deep: true },
  );
  useNuxtApp().hook("app:mounted", () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }
    try {
      const parsed: unknown = JSON.parse(saved);

      if (!isTrackList(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      store.tracks = parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  });
}
