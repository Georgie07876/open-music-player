<template>
  <section>
    <h1>Favorites</h1>
    <p>{{ lastAction }}</p>
    <TrackList
      :tracks="favoritesStore.tracks"
      @play="onPlay"
      @favorite="onFavorite"
    >
      <template #empty> No favorite tracks yet. </template>
    </TrackList>
  </section>
</template>

<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

const favoritesStore = useFavoritesStore();
const playerStore = usePlayerStore();
function onPlay(track: Track) {
  playerStore.playTrack(track);
}

const lastAction = ref("");

function onFavorite(track: Track) {
  const wasFavorite = favoritesStore.isFavorite(track.id);
  favoritesStore.toggle(track);
  lastAction.value = wasFavorite
    ? "Removed from favorites"
    : "Added to favorites";
}
</script>
