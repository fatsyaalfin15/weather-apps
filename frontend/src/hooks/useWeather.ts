import { useCallback, useRef, useState } from 'react'
import { getAir, getForecast, getWeather } from '../lib/api'
import type { AirQuality, ForecastData, Query, Weather } from '../types/weather'

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [air, setAir] = useState<AirQuality | null>(null)
  const [airLoading, setAirLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const latest = useRef(0)

  // label: nama yang ditampilkan (dipakai saat memilih dari autocomplete)
  const search = useCallback(
    async (query: Query, label?: string): Promise<Weather | null> => {
      const q: Query = 'city' in query ? { city: query.city.trim() } : query
      if ('city' in q && !q.city) return null

      const id = ++latest.current
      setLoading(true)
      setError('')
      setAir(null)
      setAirLoading(false)

      try {
        const [raw, f] = await Promise.all([getWeather(q), getForecast(q)])
        if (id !== latest.current) return null

        const w = label ? { ...raw, city: label } : raw
        setWeather(w)
        setForecast(f)

        // kualitas udara dimuat terpisah: kalau gagal, cuaca tetap tampil
        setAirLoading(true)
        getAir(w.lat, w.lon)
          .then((a) => {
            if (id === latest.current) setAir(a)
          })
          .catch(() => {})
          .finally(() => {
            if (id === latest.current) setAirLoading(false)
          })

        return w
      } catch (err) {
        if (id === latest.current) {
          setWeather(null)
          setForecast(null)
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        }
        return null
      } finally {
        if (id === latest.current) setLoading(false)
      }
    },
    []
  )

  return { weather, forecast, air, airLoading, loading, error, search }
}