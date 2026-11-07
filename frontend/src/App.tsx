import { useRef, useState, type CSSProperties } from 'react'
import ActivityTips from './components/ActivityTips'
import AirQualityCard from './components/AirQualityCard'
import AirQualityGuide from './components/AirQualityGuide'
import ForecastList from './components/ForecastList'
import Hero from './components/Hero'
import HistoryList from './components/HistoryList'
import HourlyChart from './components/HourlyChart'
import LocationButton from './components/LocationButton'
import Panel from './components/Panel'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import UnitToggle from './components/UnitToggle'
import WeatherBackground from './components/WeatherBackground'
import WeatherCard from './components/WeatherCard'
import WeatherSkeleton from './components/WeatherSkeleton'
import { useDarkMode } from './hooks/useDarkMode'
import { useGeolocation } from './hooks/useGeolocation'
import { useSearchHistory } from './hooks/useSearchHistory'
import { useUnit } from './hooks/useUnit'
import { useWeather } from './hooks/useWeather'
import type { CitySuggestion } from './types/weather'

const delay = (s: number) => ({ '--delay': `${s}s` }) as CSSProperties

export default function App() {
  const [city, setCity] = useState('')
  const detailRef = useRef<HTMLDivElement>(null)

  const { weather, forecast, air, airLoading, loading, error, search } = useWeather()
  const { history, add, clear } = useSearchHistory()
  const { dark, toggle } = useDarkMode()
  const { unit, setUnit } = useUnit()
  const { locate, locating, error: geoError, clearError } = useGeolocation()

  const busy = loading || locating
  const message = geoError || error

  const scrollToDetail = () =>
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  async function runSearch(name: string) {
    clearError()
    scrollToDetail()
    const found = await search({ city: name })
    if (found) add(found.city)
  }

  async function selectSuggestion(c: CitySuggestion) {
    clearError()
    setCity(c.name)
    scrollToDetail()
    const found = await search({ lat: c.lat, lon: c.lon }, c.name)
    if (found) add(c.name)
  }

  async function searchMyLocation() {
    const coords = await locate()
    if (!coords) return
    scrollToDetail()
    const found = await search(coords)
    if (found) setCity('') // hasil lokasi tidak dimasukkan ke riwayat
  }

  const placeKey = weather ? `${weather.lat},${weather.lon}` : ''

  return (
    <main className="relative isolate overflow-x-hidden">
      <WeatherBackground icon={weather?.icon} temp={weather?.temp} />

      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-12 pt-4">
        {/* Bilah atas */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white drop-shadow">⛅ Cek Cuaca</span>
          <div className="flex items-center gap-2">
            <UnitToggle unit={unit} onChange={setUnit} />
            <ThemeToggle dark={dark} onToggle={toggle} />
          </div>
        </div>

        <Hero />

        {/* Pencarian */}
        <Panel className="anim-fade-up mx-auto max-w-2xl">
          <SearchBar
            value={city}
            loading={busy}
            onChange={setCity}
            onSubmit={() => runSearch(city)}
            onSelect={selectSuggestion}
          />
          <LocationButton busy={busy} onClick={searchMyLocation} />

          {message && (
            <p className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
              {message}
            </p>
          )}
        </Panel>

        {/* Detail + samping */}
        <div
          ref={detailRef}
          className="mt-6 grid scroll-mt-4 grid-cols-1 items-start gap-4 lg:grid-cols-3"
        >
          {/* Kolom utama */}
          <div className="min-w-0 space-y-4 lg:col-span-2">
            {loading && <WeatherSkeleton />}

            {!loading && !weather && (
              <Panel>
                <div className="py-8 text-center">
                  <div className="text-4xl" aria-hidden>
                    🌤️
                  </div>
                  <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
                    Belum ada kota dipilih
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Cari kota di atas atau gunakan lokasimu untuk melihat detail cuaca.
                  </p>
                </div>
              </Panel>
            )}

            {!loading && weather && (
              <div key={placeKey} className="space-y-4">
                <div className="anim-fade-up">
                  <Panel>
                    <WeatherCard weather={weather} unit={unit} />
                  </Panel>
                </div>

                <div className="anim-fade-up" style={delay(0.05)}>
                  <Panel>
                    <ActivityTips weather={weather} forecast={forecast} air={air} unit={unit} />
                  </Panel>
                </div>

                {forecast && (
                  <>
                    <div className="anim-fade-up" style={delay(0.1)}>
                      <Panel>
                        <HourlyChart hourly={forecast.hourly} unit={unit} />
                      </Panel>
                    </div>
                    <div className="anim-fade-up" style={delay(0.2)}>
                      <Panel>
                        <ForecastList forecast={forecast.daily} unit={unit} />
                      </Panel>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Kolom samping */}
          <div className="min-w-0 space-y-4">
            {!loading && weather && (
              <div key={placeKey} className="anim-fade-up" style={delay(0.2)}>
                <Panel>
                  <AirQualityCard air={air} loading={airLoading} />
                </Panel>
              </div>
            )}

            <Panel title="Panduan kualitas udara" subtitle="Skala indeks 1–5 (OpenWeather)">
              <AirQualityGuide activeIndex={air ? Math.round(air.aqi) : undefined} />
            </Panel>

            <Panel title="Riwayat pencarian">
              <HistoryList
                history={history}
                onSelect={(c) => {
                  setCity(c)
                  runSearch(c)
                }}
                onClear={clear}
              />
            </Panel>
          </div>
        </div>
      </div>
    </main>
  )
}