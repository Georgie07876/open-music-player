<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="global-player">
      <button
        type="button"
        class="global-player__btn global-player__btn--side"
        aria-label="Previous track"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M14.5 6.5 9 12l5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        class="global-player__btn global-player__btn--main"
        aria-label="Play"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 6.5v11L17.5 12z" fill="currentColor" />
        </svg>
      </button>

      <button
        type="button"
        class="global-player__btn global-player__btn--side"
        aria-label="Next track"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M9.5 6.5 15 12l-5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
.global-player {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.6rem 1.25rem;
  border: solid 2px #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.global-player__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.global-player__btn--side {
  width: 2.25rem;
  height: 2.25rem;
}

.global-player__btn--main {
  width: 3rem;
  height: 3rem;
}

.global-player__btn svg {
  display: block;
  width: 45%;
  height: 45%;
}

.global-player__btn:hover {
  background: #f4f4f4;
}

.global-player__btn:focus-visible {
  outline: 2px solid #333;
  outline-offset: 2px;
}
</style>
