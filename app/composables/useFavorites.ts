const favorites = useFavoritesStore();

onMounted(() => {
  if (!favorites) return [];
  window.localStorage.getItem("key", "value");
});
