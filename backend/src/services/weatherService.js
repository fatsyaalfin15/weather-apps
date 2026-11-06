const { request } = require('./openWeatherClient');
const TTLCache = require('../utils/cache');

const cache = new TTLCache(10 * 60 * 1000, 500);

function toWeather(d) {
  return {
    city: d.name || 'Lokasi Anda',
    country: d.sys.country,
    lat: d.coord.lat,
    lon: d.coord.lon,
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    wind: d.wind.speed,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
  };
}

// Data per 3 jam diringkas jadi: 5 hari (daily) + 24 jam ke depan (hourly)
function toForecast(d) {
  const offset = d.city.timezone;
  const days = {};

  for (const item of d.list) {
    const local = new Date((item.dt + offset) * 1000);
    const date = local.toISOString().slice(0, 10);
    (days[date] ??= []).push({ ...item, hour: local.getUTCHours() });
  }

  const daily = Object.entries(days)
    .slice(0, 5)
    .map(([date, items]) => {
      const noon = items.reduce((a, b) =>
        Math.abs(b.hour - 12) < Math.abs(a.hour - 12) ? b : a
      );
      return {
        date,
        min: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
        max: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
        description: noon.weather[0].description,
        icon: noon.weather[0].icon,
      };
    });

  const hourly = d.list.slice(0, 8).map((item) => {
    const local = new Date((item.dt + offset) * 1000);
    return {
      time: `${String(local.getUTCHours()).padStart(2, '0')}:00`,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      pop: Math.round((item.pop ?? 0) * 100), // peluang hujan (%)
    };
  });

  return { daily, hourly };
}

function locationParams({ city, lat, lon }) {
  return city ? { q: city } : { lat: lat.toFixed(2), lon: lon.toFixed(2) };
}

async function getData(endpoint, transform, query) {
  const { city, lat, lon } = query;
  // koordinat dibulatkan 2 desimal (~1 km) supaya cache lebih sering terpakai
  const key = `${endpoint}:${city ? city.toLowerCase() : `${lat.toFixed(2)},${lon.toFixed(2)}`}`;

  const cached = cache.get(key);
  if (cached) return cached;

  const raw = await request(`/data/2.5/${endpoint}`, {
    units: 'metric',
    lang: 'id',
    ...locationParams(query),
  });

  const data = transform(raw);
  cache.set(key, data);
  return data;
}

module.exports = {
  getCurrentWeather: (query) => getData('weather', toWeather, query),
  getForecast: (query) => getData('forecast', toForecast, query),
};