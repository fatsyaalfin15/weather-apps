import type { AirQuality } from '../types/weather'
import { LEVELS } from '../lib/airLevels'

// Skala indeks OpenWeather: 1 sampai 5

function Pollutant({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-100 p-2 text-center dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

type Props = { air: AirQuality | null; loading: boolean }

export default function AirQualityCard({ air, loading }: Props) {
  const title = (
    <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      Kualitas udara
    </h3>
  )

  if (loading) {
    return (
      <section className="mt-6 animate-pulse" aria-busy="true">
        {title}
        <div className="h-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </section>
    )
  }

  if (!air) {
    return (
      <section className="mt-6">
        {title}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Data kualitas udara tidak tersedia.
        </p>
      </section>
    )
  }

  const index = Math.min(Math.max(Math.round(air.aqi), 1), 5)
  const level = LEVELS[index - 1]

  return (
    <section className="mt-6">
      {title}
      <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800/60">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${level.color}`}>
            {level.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Indeks {index} dari 5</span>
        </div>

        <div className="mt-3 flex gap-1" aria-hidden>
          {LEVELS.map((l, i) => (
            <div
              key={l.label}
              className={`h-2 flex-1 rounded-full ${l.color} ${i < index ? '' : 'opacity-25'}`}
            />
          ))}
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{level.tip}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Pollutant label="PM2.5" value={air.pm2_5} />
          <Pollutant label="PM10" value={air.pm10} />
          <Pollutant label="O₃" value={air.o3} />
          <Pollutant label="NO₂" value={air.no2} />
        </div>
        <p className="mt-2 text-right text-[11px] text-slate-400">satuan µg/m³</p>
      </div>
    </section>
  )
}