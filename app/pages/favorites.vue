<template>
  <section>
    <h1>Favorites</h1>
    <TrackList :tracks="favoritesStore.tracksID">
      <template #empty> No favorite tracks yet. </template>
    </TrackList>
  </section>
</template>

<script setup lang="ts">
const favoritesStore = useFavoritesStore();
const favoriteTracks = computed(() => favoritesStore.tracksID);
</script>
