const app = require('./src/app');
const { port, nodeEnv } = require('./src/config/env');

// Jalankan app.listen hanya saat di laptop (development)
if (nodeEnv !== 'production') {
  app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
}

// WAJIB untuk Vercel agar tidak 502 Bad Gateway:
module.exports = app;