import { convertTemp, type Unit } from '../lib/units'
import type { DailyForecast } from '../types/weather'

function formatDay(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

type Props = { forecast: DailyForecast[]; unit: Unit }

export default function ForecastList({ forecast, unit }: Props) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Prakiraan 5 hari
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="rounded-lg bg-slate-100 p-2 text-center text-xs dark:bg-slate-800"
          >
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {formatDay(day.date)}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="mx-auto"
            />
            <p className="font-semibold text-slate-900 dark:text-white">
              {convertTemp(day.max, unit)}°
            </p>
            <p className="text-slate-500 dark:text-slate-400">{convertTemp(day.min, unit)}°</p>
          </div>
        ))}
      </div>
    </div>
  )
}