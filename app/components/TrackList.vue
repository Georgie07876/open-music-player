<script setup lang="ts">
import type { Track } from '~/utils/mock-tracks'

defineProps<{
  tracks: Track[]
}>()

const emit = defineEmits<{
  play: [track: Track]
  favorite: [track: Track]
}>()
</script>

<template>
  <div>
    <p v-if="tracks.length === 0" class="track-list__empty">
      <slot name="empty">No tracks found.</slot>
    </p>
    <ul v-else class="track-list">
      <li v-for="track in tracks" :key="track.id">
        <TrackCard
          :track="track"
          @play="emit('play', $event)"
          @favorite="emit('favorite', $event)"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.track-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.track-list__empty {
  color: #666;
}
</style>
