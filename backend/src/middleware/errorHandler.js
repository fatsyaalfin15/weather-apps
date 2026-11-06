const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError('Endpoint tidak ditemukan', 404));
}

// Express mengenali error handler dari 4 parameternya, jadi `next` wajib ada
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const known = err instanceof AppError;
  if (!known) console.error(err); // error tak terduga: catat di server, jangan bocor ke klien

  res.status(known ? err.statusCode : 500).json({
    message: known ? err.message : 'Terjadi kesalahan pada server',
  });
}

module.exports = { notFound, errorHandler };