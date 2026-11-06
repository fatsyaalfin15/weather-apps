const { rateLimit } = require('express-rate-limit');
const AppError = require('../utils/AppError');

// 100 request per 15 menit per IP (1 pencarian = 2 request)
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) =>
    next(new AppError('Terlalu banyak permintaan, coba lagi beberapa menit lagi', 429)),
});