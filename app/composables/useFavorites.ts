export function useFavorites() {
  const store = useFavoritesStore();
  watch(
    () => store.tracks,
    (newTracks) => {
      window.localStorage.setItem(
        "omp:favorites:v1",
        JSON.stringify(newTracks),
      );
    },
    { deep: true },
  );
  useNuxtApp().hook("app:mounted", () => {
    const savedTracks = window.localStorage.getItem("omp:favorites:v1");
    if (savedTracks) {
      store.tracks = JSON.parse(savedTracks);
    }
  });
}
