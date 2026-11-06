import { LEVELS } from '../lib/airLevels'

const TERMS = [
  {
    name: 'PM2.5',
    text: 'Partikel sangat halus (di bawah 2,5 µm) dari asap kendaraan, pembakaran, dan kebakaran lahan. Bisa masuk jauh ke paru-paru.',
  },
  {
    name: 'PM10',
    text: 'Partikel debu yang lebih kasar (di bawah 10 µm), misalnya debu jalan dan konstruksi.',
  },
  {
    name: 'O₃',
    text: 'Ozon permukaan, terbentuk dari reaksi polusi di bawah sinar matahari. Dapat mengiritasi saluran napas.',
  },
  {
    name: 'NO₂',
    text: 'Gas dari knalpot kendaraan dan pembangkit listrik. Dapat memicu gangguan pernapasan.',
  },
]

type Props = { activeIndex?: number }

export default function AirQualityGuide({ activeIndex }: Props) {
  return (
    <div>
      <ul className="space-y-1.5">
        {LEVELS.map((l, i) => {
          const active = activeIndex === i + 1
          return (
            <li
              key={l.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                active
                  ? 'bg-sky-100 ring-2 ring-sky-500 dark:bg-slate-700'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <span className={`h-3 w-3 shrink-0 rounded-full ${l.color}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {i + 1}. {l.label}
                  {active && (
                    <span className="ml-2 text-xs font-normal text-sky-700 dark:text-sky-300">
                      (lokasi ini)
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PM2.5 {l.pm25} · PM10 {l.pm10} µg/m³
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-medium text-sky-700 dark:text-sky-300">
          Apa arti PM2.5, PM10, O₃, dan NO₂?
        </summary>
        <dl className="mt-2 space-y-2">
          {TERMS.map((t) => (
            <div key={t.name}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{t.name}</dt>
              <dd className="text-slate-600 dark:text-slate-300">{t.text}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="mt-3 text-[11px] text-slate-400">
        Indeks memakai skala OpenWeather (1–5), berbeda dari ISPU resmi Indonesia atau US AQI.
      </p>
    </div>
  )
}