import type { Track } from "~/utils/mock-tracks";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    tracks: [] as Track[],
  }),
  actions: {
    add(track: Track) {
      if (!this.tracks.some((item) => item.id === track.id)) {
        this.tracks.push(track);
      }
    },
    remove(id: string) {
      this.tracks = this.tracks.filter((item) => item.id !== id);
    },
    toggle(track: Track) {
      if (this.tracks.some((item) => item.id === track.id)) {
        this.remove(track.id);
      } else {
        this.add(track);
      }
    },
  },
  getters: {
    isFavorite: (state) => {
      return (id: string) => state.tracks.some((item) => item.id === id);
    },
  },
});
