import type { Track } from "~/utils/mock-tracks";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null as Track | null,
    isPlaying: false,
    queue: <Track[]>[],
    volume: "loud" | Number,
  }),
  actions: {
    playTrack(track: Track) {
      this.currentTrack = track;
      this.isPlaying = true;
      if (!this.queue.some((item) => item.id === track.id)) {
        this.queue.push(track);
      }
    },
  },
});
