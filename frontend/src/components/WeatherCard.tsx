import { convertTemp, type Unit } from '../lib/units'
import type { Weather } from '../types/weather'

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-2 text-center sm:p-3 dark:bg-slate-800">
      <p className="text-lg" aria-hidden>
        {icon}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

type Props = { weather: Weather; unit: Unit }

export default function WeatherCard({ weather, unit }: Props) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Cuaca saat ini
      </p>

      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-slate-800 sm:text-2xl dark:text-white">
            {weather.city}, {weather.country}
          </h2>
          <p className="capitalize text-slate-600 dark:text-slate-300">{weather.description}</p>
        </div>

        <div className="flex shrink-0 items-center">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-16 w-16 sm:h-20 sm:w-20"
          />
          <p className="text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
            {convertTemp(weather.temp, unit)}°{unit}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon="🌡️" label="Terasa" value={`${convertTemp(weather.feelsLike, unit)}°${unit}`} />
        <Stat icon="💧" label="Kelembapan" value={`${weather.humidity}%`} />
        <Stat icon="💨" label="Angin" value={`${weather.wind} m/s`} />
      </div>
    </div>
  )
}