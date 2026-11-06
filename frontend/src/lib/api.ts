import type { AirQuality, CitySuggestion, ForecastData, Query, Weather } from '../types/weather'

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new Error('Tidak dapat terhubung ke server')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Terjadi kesalahan')
  return data
}

function toQueryString(q: Query) {
  const params = new URLSearchParams()
  if ('city' in q) {
    params.set('city', q.city)
  } else {
    params.set('lat', q.lat.toFixed(4))
    params.set('lon', q.lon.toFixed(4))
  }
  return params.toString()
}

export const getWeather = (q: Query) =>
  fetchJson<Weather>(`/api/weather?${toQueryString(q)}`)

export const getForecast = (q: Query) =>
  fetchJson<ForecastData>(`/api/forecast?${toQueryString(q)}`)

export const getAir = (lat: number, lon: number) =>
  fetchJson<AirQuality>(`/api/air?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`)

export const searchCities = (q: string, signal?: AbortSignal) =>
  fetchJson<CitySuggestion[]>(`/api/cities?q=${encodeURIComponent(q)}`, signal)

