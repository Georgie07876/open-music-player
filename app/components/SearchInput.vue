<script setup lang="ts">
const query = defineModel<string>({ default: '' })
</script>

<template>
  <label class="search-input">
    <span class="search-input__label">Search</span>
    <input
      v-model="query"
      type="search"
      placeholder="Title or artist"
    >
  </label>
</template>

<style scoped>
.search-input {
  display: grid;
  gap: 0.35rem;
  max-width: 24rem;
}

.search-input__label {
  font-size: 0.85rem;
}

.search-input input {
  padding: 0.5rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
