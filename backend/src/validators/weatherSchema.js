const { z } = require('zod');

const CITY_REGEX = /^[\p{L}\p{M}\s.,'’-]+$/u;

const coord = (min, max) =>
  z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, 'Koordinat harus berupa angka')
    .transform(Number)
    .refine((n) => n >= min && n <= max, `Koordinat harus antara ${min} dan ${max}`);

const cityName = (min) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? 'Nama kota tidak boleh kosong' : `Ketik minimal ${min} huruf`)
    .max(100, 'Nama kota terlalu panjang')
    .regex(CITY_REGEX, 'Nama kota mengandung karakter yang tidak valid');

const weatherQuery = z
  .object({
    city: cityName(1).optional(),
    lat: coord(-90, 90).optional(),
    lon: coord(-180, 180).optional(),
  })
  .refine((q) => q.city || (q.lat !== undefined && q.lon !== undefined), {
    message: 'Isi parameter city, atau lat dan lon sekaligus',
  });

const airQuery = z.object({
  lat: coord(-90, 90),
  lon: coord(-180, 180),
});

const citiesQuery = z.object({ q: cityName(2) });

module.exports = { weatherQuery, airQuery, citiesQuery };