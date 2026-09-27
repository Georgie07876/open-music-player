<template>
  <header class="app-header">
    <strong>Open Music Player</strong>
    <nav class="app-nav">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/search">Search</NuxtLink>
      <NuxtLink to="/favorites">Favorites</NuxtLink>
      <NuxtLink to="/playlists">Playlists</NuxtLink>
    </nav>
  </header>
  <main class="app-content"><slot /></main>
  <footer class="app-footer"><GlobalPlayer /></footer>
</template>

<script lang="ts"></script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #ddd;
}

.app-nav {
  display: flex;
  gap: 1rem;
}

.app-nav a {
  color: #333;
}

.app-nav a.router-link-active {
  font-weight: 700;
}

.app-content {
  flex: 1 1 auto;
  padding: 1.25rem;
}

.app-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
</style>
