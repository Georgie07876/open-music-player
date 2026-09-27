<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

defineProps<{
  track: Track;
}>();

const emit = defineEmits<{
  play: [track: Track];
  favorite: [track: Track];
}>();
</script>

<template>
  <article class="track-card">
    <Avatar :initials="getInitials(track.artist)" />

    <div class="track-card__info">
      <NuxtLink :to="`/track/${track.id}`">{{ track.title }}</NuxtLink>
      <p>{{ track.artist }}</p>
    </div>

    <span class="track-card__duration">{{
      formatDuration(track.duration)
    }}</span>

    <div class="track-card__actions">
      <AppButton @click="emit('play', track)">Play</AppButton>
      <AppButton @click="emit('favorite', track)">Favorite</AppButton>
    </div>
  </article>
</template>

<style scoped>
.track-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.35rem 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.track-card__info p {
  margin: 0.15rem 0 0;
  color: #555;
}

.track-card__duration {
  color: #666;
  font-variant-numeric: tabular-nums;
}

.track-card__actions {
  grid-column: 2 / -1;
  display: flex;
  gap: 0.5rem;
}
a {
  color: inherit;
  text-decoration: none;
}
</style>
