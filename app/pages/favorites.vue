<template>
  <section>
    <h1>Favorites</h1>
    <p>
      Favorites are not saved yet. That comes later with state and localStorage.
    </p>
    <TrackList :tracks="favoriteTracks">
      <template #empty> No favorite tracks yet. </template>
    </TrackList>
  </section>
</template>

<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

const favoriteTracks: Track[] = [];
</script>
