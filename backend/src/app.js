const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const apiLimiter = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// di balik proxy (Render/Railway) supaya rate limit membaca IP asli pengguna
if (env.nodeEnv === 'production') app.set('trust proxy', 1);

// API ini memang dipanggil dari domain frontend yang berbeda
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.frontendUrls })); // sebelum rate limiter, agar respons 429 tetap terbaca browser
app.use('/api', apiLimiter, weatherRoutes);

app.use(notFound);
app.use(errorHandler); // harus paling akhir

module.exports = app;