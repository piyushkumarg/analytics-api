export const appEnvConfig = () => ({
  apiKey: process.env.API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  THROTTLE_LIMIT: process.env.THROTTLE_LIMIT || 1,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
  JWT_SECRET: process.env.JWT_SECRET,
});