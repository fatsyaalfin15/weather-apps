const { request } = require('./openWeatherClient');
const TTLCache = require('../utils/cache');

const cache = new TTLCache(24 * 60 * 60 * 1000, 1000);

async function searchCities(q) {
  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const list = await request('/geo/1.0/direct', { q, limit: 5 });

  const seen = new Set();
  const data = [];
  for (const c of list) {
    const id = `${c.name}|${c.state ?? ''}|${c.country}`;
    if (seen.has(id)) continue; // buang duplikat
    seen.add(id);
    data.push({
      name: c.name,
      state: c.state ?? null,
      country: c.country,
      lat: c.lat,
      lon: c.lon,
    });
  }

  cache.set(key, data);
  return data;
}

module.exports = { searchCities };