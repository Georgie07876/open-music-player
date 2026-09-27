<script setup lang="ts">
defineProps<{
  initials: string
}>()
</script>

<template>
  <span class="avatar" aria-hidden="true">{{ initials }}</span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: #e8e8e8;
  font-size: 0.8rem;
  font-weight: 700;
}
</style>
