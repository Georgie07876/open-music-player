import { useFavorites } from "~/composables/useFavorites";
export default defineNuxtPlugin(() => {
  useFavorites();
});
