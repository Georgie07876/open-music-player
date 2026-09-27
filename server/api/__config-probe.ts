// Temporary validation probe — deleted after the check.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  return {
    hasKey: Boolean(config.audiusKey),
    keyLength: String(config.audiusKey).length,
    hasSecret: Boolean(config.audiusSecret),
    publicKeys: Object.keys(config.public ?? {}),
  }
})
