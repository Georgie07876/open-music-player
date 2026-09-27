// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    audiusSecret: "FBzqIBytzwD9BgjBKQF9GTDxFitQn6mFvdSzGi_nhCU=",
    public: {
      audiusKey: "0xc96a20e0e3bd914db274976d5b3b46564a610036",
    },
  },
});
