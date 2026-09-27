<template>
  <section>
    <h1>Search</h1>
    <SearchInput v-model="query" />
    <p v-if="pending">Loading…</p>
    <p v-if="error">Could not load tracks.</p>
    <p v-else-if="lastAction">{{ lastAction }}</p>
    <TrackList
      v-else="!pending && !error"
      :tracks="tracks"
      @play="onPlay"
      @favorite="onFavorite"
    >
      <template #empty> No tracks match “{{ query }}”. </template>
    </TrackList>
  </section>
</template>

<script setup lang="ts">
import type { Track } from "~/utils/mock-tracks";

interface AudiusSearchResponse {
  data: unknown[];
}

const playerStore = usePlayerStore();
const query = computed({
  get() {
    return String(route.query.q ?? "");
  },
  set(value: string) {
    navigateTo({
      path: "/search",
      replace: true,
      query: value.trim() ? { q: value } : {},
    });
  },
});

const route = useRoute();

const config = useRuntimeConfig();
const {
  data: raw,
  pending,
  error,
} = await useFetch<AudiusSearchResponse>(
  "https://api.audius.co/v1/tracks/search",
  {
    // headers: {
    //   Authorization: `Bearer ${config.public.audiusSecret}`,
    // },
    query: {
      public_Key: config.public.audiusKey,
      query: query,
    },
  },
);

const tracks = computed(() => (raw.value?.data ?? []).map(toTrack));

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
