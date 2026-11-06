import { convertTemp, type Unit } from '../lib/units'
import type { HourlyForecast } from '../types/weather'

const COL = 60 // lebar tiap kolom (px)
const H = 84
const TOP = 26
const BOTTOM = 12

type Props = { hourly: HourlyForecast[]; unit: Unit }

export default function HourlyChart({ hourly, unit }: Props) {
  if (hourly.length < 2) return null

  const temps = hourly.map((h) => convertTemp(h.temp, unit))
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = max - min || 1
  const W = COL * hourly.length
  const plotH = H - TOP - BOTTOM

  const points = temps.map((t, i) => ({
    x: COL * i + COL / 2,
    y: max === min ? TOP + plotH / 2 : TOP + ((max - t) / span) * plotH,
  }))

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const last = points[points.length - 1]
  const area = `${line} L${last.x},${H} L${points[0].x},${H} Z`

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Prakiraan per 3 jam
      </h3>

      <div className="overflow-x-auto rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
        <div style={{ width: W }}>
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Grafik suhu per 3 jam"
            className="block text-sky-500 dark:text-sky-300"
          >
            <defs>
              <linearGradient id="hourly-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={area} fill="url(#hourly-fill)" />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((p, i) => (
              <g key={hourly[i].time}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  strokeWidth="2"
                  className="fill-white stroke-current"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="fill-slate-800 text-[11px] font-semibold dark:fill-slate-100"
                >
                  {temps[i]}°
                </text>
              </g>
            ))}
          </svg>

          <div className="flex">
            {hourly.map((h) => (
              <div key={h.time} style={{ width: COL }} className="text-center text-xs">
                <img
                  src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                  alt={h.description}
                  className="mx-auto h-9 w-9"
                />
                <p className="font-medium text-slate-700 dark:text-slate-300">{h.time}</p>
                <p className="text-sky-600 dark:text-sky-300">💧{h.pop}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}