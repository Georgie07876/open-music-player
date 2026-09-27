export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null as Track | null,
    isPlaying: false,
    queue: <Track[]>[],
    volume: null as number | null,
  }),
  actions: {
    playTrack(track: Track) {
      this.currentTrack = track;
      this.isPlaying = true;
    },
  },
});
