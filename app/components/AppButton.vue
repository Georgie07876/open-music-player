<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit'
}>(), {
  type: 'button'
})
</script>

<template>
  <button class="app-button" :type="type">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.app-button:hover {
  background: #f4f4f4;
}
</style>
