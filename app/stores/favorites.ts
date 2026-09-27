import type { Track } from "~/utils/mock-tracks";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    tracksID: [] as Track[],
  }),
  actions: {
    add(track: Track) {
      if (!this.tracksID.some((item) => item.id === track.id)) {
        this.tracksID.push(track);
      }
    },
    remove(id: string) {
      this.tracksID = this.tracksID.filter((item) => item.id !== id);
    },
    toggle(track: Track) {
      if (this.tracksID.some((item) => item.id === track.id)) {
        this.remove(track.id);
      } else {
        this.add(track);
      }
    },
  },
  getters: {
    isFavorite: (state) => {
      return (id: string) => state.tracksID.some((item) => item.id === id);
    },
  },
});
