const { apiKey } = require('../config/env');
const AppError = require('../utils/AppError');

const BASE = 'https://api.openweathermap.org';

async function request(path, params = {}) {
  const qs = new URLSearchParams({ ...params, appid: apiKey });

  let res;
  try {
    res = await fetch(`${BASE}${path}?${qs}`, { signal: AbortSignal.timeout(8000) });
  } catch {
    throw new AppError('Layanan cuaca tidak merespons', 502);
  }

  if (res.status === 404) throw new AppError('Lokasi tidak ditemukan', 404);
  if (!res.ok) {
    // hanya status yang dicatat, jangan URL (ada API key di dalamnya)
    console.error(`[OpenWeather] ${path} gagal, status ${res.status}`);
    throw new AppError('Gagal mengambil data cuaca', 502);
  }
  return res.json();
}

module.exports = { request };