require('dotenv').config();

if (!process.env.OPENWEATHER_API_KEY) {
  console.error('PERINGATAN: OPENWEATHER_API_KEY belum diisi di Environment Variables Vercel!');
  // Jangan gunakan process.exit(1) di serverless Vercel karena akan memicu 502 Bad Gateway
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiKey: process.env.OPENWEATHER_API_KEY,
  frontendUrls: (process.env.FRONTEND_URL ?? 'http://localhost:5134')
    .split(',')
    .map((s) => s.trim()),
};