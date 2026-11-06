const { request } = require('./openWeatherClient');
const AppError = require('../utils/AppError');
const TTLCache = require('../utils/cache');

const cache = new TTLCache(15 * 60 * 1000, 500);
const round1 = (n) => Math.round(n * 10) / 10;

async function getAirQuality({ lat, lon }) {
  const la = lat.toFixed(2);
  const lo = lon.toFixed(2);
  const key = `${la},${lo}`;

  const cached = cache.get(key);
  if (cached) return cached;

  const raw = await request('/data/2.5/air_pollution', { lat: la, lon: lo });
  const item = raw.list?.[0];
  if (!item) throw new AppError('Data kualitas udara tidak tersedia', 404);

  const c = item.components;
  const data = {
    aqi: item.main.aqi, // 1 (baik) sampai 5 (sangat buruk)
    pm2_5: round1(c.pm2_5),
    pm10: round1(c.pm10),
    o3: round1(c.o3),
    no2: round1(c.no2),
    so2: round1(c.so2),
    co: round1(c.co),
  };

  cache.set(key, data);
  return data;
}

module.exports = { getAirQuality };