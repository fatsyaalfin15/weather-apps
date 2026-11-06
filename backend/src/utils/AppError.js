// Error yang kita buat sendiri dan aman ditampilkan ke pengguna
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;