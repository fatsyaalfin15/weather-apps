const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const apiLimiter = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// 1. Selalu aktifkan trust proxy agar express-rate-limit tidak error di Vercel
app.set('trust proxy', 1);

// 2. Konfigurasi Helmet agar tidak memblokir akses lintas domain
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// 3. Izinkan akses CORS dari semua domain (termasuk semua preview & production URL Vercel)
app.use(cors());

app.use(express.json());

// Route opsional untuk mengecek apakah server backend hidup saat dibuka langsung di browser
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Weather API Server is running' });
});

// 4. Pasang rate limiter dan routes di /api
app.use('/api', apiLimiter, weatherRoutes);

app.use(notFound);
app.use(errorHandler); // harus paling akhir

module.exports = app;