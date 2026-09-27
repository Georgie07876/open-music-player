<template>
  <p v-if="pending">Loading…</p>
  <p v-else-if="error">Could not load track.</p>
  <section v-else-if="track">
    <h1>{{ track.title }}</h1>
    <p>{{ track.artist }}</p>
  </section>
  <p v-else>Track not found.</p>
</template>

<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

interface AudiusTrackResponse {
  data: unknown;
}

const route = useRoute();
const id = computed(() => String(route.params.id));
const config = useRuntimeConfig();

const {
  data: raw,
  pending,
  error,
} = await useFetch<AudiusTrackResponse>(
  () => `https://api.audius.co/v1/tracks/${id.value}`,
  {
    query: {
      public_Key: config.public.audiusKey,
    },
  },
);
const track = computed(() => {
  const item = raw.value?.data;
  return item ? toTrack(item) : null;
});

function toTrack(raw: any): Track {
  return {
    id: String(raw.id),
    title: raw.title,
    artist: raw.user?.name ?? "Unknown Artist",
    duration: Number(raw.duration ?? 0),
  };
}
</script>
