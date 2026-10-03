<template>
  <div class="global-player">
    <div class="global-player__top">
      <div v-if="playerStore.currentTrack" class="global-player__now">
        <span class="global-player__title">{{
          playerStore.currentTrack?.title
        }}</span>
        <span class="global-player__artist">{{
          playerStore.currentTrack?.artist
        }}</span>
      </div>

      <PlayerControls class="global-player__controls" />
    </div>

    <div class="global-player__row">
      <button type="button" class="global-player__btn" aria-label="Mute">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 9.5h3.2L11 6.2v11.6L7.2 14.5H4z" fill="currentColor" />
          <path
            d="M15 9.5l5 5M20 9.5l-5 5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div class="global-player__timeline">
        <div class="global-player__timeline-fill" />
      </div>

      <button
        type="button"
        class="global-player__btn"
        aria-label="Add to favorites"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M12 21 3.6 12.6a5 5 0 0 1 7.07-7.07L12 6.83l1.33-1.3a5 5 0 0 1 7.07 7.07z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore();
</script>

<style scoped>
.global-player {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-top: 1px solid #ddd;
  background: #fff;
}

.global-player__top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

.global-player__controls {
  grid-column: 2;
}

.global-player__now {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
}

.global-player__title {
  overflow: hidden;
  font-size: 0.95rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.global-player__artist {
  overflow: hidden;
  color: #666;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.global-player__row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.75rem;
}

.global-player__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.global-player__btn svg {
  display: block;
  width: 55%;
  height: 55%;
}

.global-player__btn:hover {
  background: #f4f4f4;
}

.global-player__btn:focus-visible {
  outline: 2px solid #333;
  outline-offset: 2px;
}

.global-player__timeline {
  flex: 1 1 auto;
  min-width: 0;
  height: 1rem;
  border-radius: 999px;
  background: #e8e8e8;
  overflow: hidden;
}

.global-player__timeline-fill {
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: #333;
}
</style>
