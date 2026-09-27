<template>
  <section>
    <h1>Home</h1>
    <p>Mock trending tracks. No API yet.</p>
    <p v-if="pending">Loading…</p>
    <p v-else-if="error">Could not load tracks.</p>
    <p v-else>{{ lastAction }}</p>

    <TrackList :tracks="tracks" @play="onPlay" @favorite="onFavorite" />
  </section>
</template>

<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

interface AudiusListResponse {
  data: unknown[];
}

const playerStore = usePlayerStore();
const config = useRuntimeConfig();
const {
  data: raw,
  pending,
  error,
} = await useFetch<AudiusListResponse>(
  "https://api.audius.co/v1/tracks/trending",
  {
    // headers: {
    //   Authorization: `Bearer ${config.public.audiusSecret}`,
    // },
    query: {
      public_Key: config.public.audiusKey,
    },
  },
);

const tracks = computed(() => {
  const list = raw.value?.data ?? [];
  return list.map(toTrack);
});

const lastAction = ref("");

function onPlay(track: Track) {
  playerStore.playTrack(track);
}

function onFavorite(track: Track) {
  lastAction.value = `Favorite: ${track.title}`;
}

function toTrack(raw: any): Track {
  return {
    id: String(raw.id),
    title: raw.title,
    artist: raw.user?.name ?? "Unknown Artist",
    duration: Number(raw.duration ?? 0),
  };
}
</script>
