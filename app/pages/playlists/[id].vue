<template>
  <section v-if="album">
    <h1>{{ album.title }}</h1>
    <p>{{ album.artist }}</p>
  </section>
  <p v-else>Track not found.</p>
</template>

<script setup>
const route = useRoute();

const album = computed(() => {
  const id = String(route.params.id);
  return mockAlbums.find((item) => item.id === id);
});
</script>
