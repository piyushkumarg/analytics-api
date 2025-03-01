export const appEnvConfig = () => ({
  apiKey: process.env.API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  THROTTLE_LIMIT: process.env.THROTTLE_LIMIT || 1,
});
