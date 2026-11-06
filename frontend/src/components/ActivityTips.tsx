import { convertTemp, type Unit } from '../lib/units'
import type { AirQuality, ForecastData, Weather } from '../types/weather'

type Tone = 'good' | 'info' | 'warn' | 'danger'
type Tip = { icon: string; title: string; text: string; tone: Tone }

const BORDER: Record<Tone, string> = {
  good: 'border-green-500',
  info: 'border-sky-500',
  warn: 'border-amber-500',
  danger: 'border-red-500',
}

const PRIORITY: Record<Tone, number> = { danger: 0, warn: 1, info: 2, good: 3 }

function buildTips(
  weather: Weather,
  forecast: ForecastData | null,
  air: AirQuality | null,
  unit: Unit
): Tip[] {
  const tips: Tip[] = []
  const code = weather.icon.slice(0, 2)

  // Hujan: kondisi sekarang, atau peluang tertinggi dalam 24 jam ke depan
  const hourly = forecast?.hourly ?? []
  const rainiest = hourly.length
    ? hourly.reduce((a, b) => (b.pop > a.pop ? b : a))
    : undefined

  if (code === '11') {
    tips.push({
      icon: '⛈️',
      title: 'Ada petir',
      text: 'Hindari lapangan terbuka dan berteduh di dalam bangunan.',
      tone: 'danger',
    })
  } else if (code === '09' || code === '10') {
    tips.push({
      icon: '🌧️',
      title: 'Sedang hujan',
      text: 'Bawa payung atau jas hujan, dan hati-hati berkendara karena jalan licin.',
      tone: 'warn',
    })
  } else if (rainiest && rainiest.pop >= 60) {
    tips.push({
      icon: '☂️',
      title: 'Bawa payung',
      text: `Peluang hujan ${rainiest.pop}% sekitar pukul ${rainiest.time} (waktu setempat).`,
      tone: 'warn',
    })
  } else if (rainiest && rainiest.pop >= 30) {
    tips.push({
      icon: '🌦️',
      title: 'Kemungkinan hujan',
      text: `Peluang hujan ${rainiest.pop}% sekitar pukul ${rainiest.time}. Payung lipat bisa jadi cadangan.`,
      tone: 'info',
    })
  }

  if (code === '13') {
    tips.push({
      icon: '❄️',
      title: 'Bersalju',
      text: 'Pakai pakaian hangat dan alas kaki yang tidak licin.',
      tone: 'warn',
    })
  }

  if (code === '50') {
    tips.push({
      icon: '🌫️',
      title: 'Jarak pandang terbatas',
      text: 'Nyalakan lampu kendaraan dan kurangi kecepatan.',
      tone: 'warn',
    })
  }

  // Suhu (memakai suhu terasa, dalam °C dari server)
  const feels = weather.feelsLike
  const feelsText = `${convertTemp(feels, unit)}°${unit}`

  if (feels >= 38) {
    tips.push({
      icon: '🥵',
      title: 'Panas ekstrem',
      text: `Terasa seperti ${feelsText}. Hindari aktivitas berat di luar saat siang dan minum air secara teratur.`,
      tone: 'danger',
    })
  } else if (feels >= 32) {
    tips.push({
      icon: '☀️',
      title: 'Cuaca panas',
      text: `Terasa seperti ${feelsText}. Pakai tabir surya dan topi, serta perbanyak minum.`,
      tone: 'warn',
    })
  } else if (feels <= 5) {
    tips.push({
      icon: '🥶',
      title: 'Sangat dingin',
      text: `Terasa seperti ${feelsText}. Pakai pakaian berlapis dan batasi waktu di luar.`,
      tone: 'warn',
    })
  } else if (feels <= 18) {
    tips.push({
      icon: '🧥',
      title: 'Udara sejuk',
      text: `Terasa seperti ${feelsText}. Bawa jaket.`,
      tone: 'info',
    })
  } else {
    tips.push({
      icon: '😊',
      title: 'Suhu nyaman',
      text: `Terasa seperti ${feelsText}, nyaman untuk beraktivitas.`,
      tone: 'good',
    })
  }

  // Angin (m/s)
  if (weather.wind >= 15) {
    tips.push({
      icon: '🌪️',
      title: 'Angin sangat kencang',
      text: 'Hindari berada di dekat pohon atau papan reklame, dan tunda aktivitas di tempat terbuka.',
      tone: 'danger',
    })
  } else if (weather.wind >= 10) {
    tips.push({
      icon: '💨',
      title: 'Angin kencang',
      text: 'Amankan barang ringan di luar dan hati-hati saat berkendara.',
      tone: 'warn',
    })
  }

  // Kelembapan
  if (weather.humidity >= 85 && feels >= 28) {
    tips.push({
      icon: '💧',
      title: 'Udara lembap',
      text: 'Terasa gerah. Pilih pakaian tipis yang menyerap keringat.',
      tone: 'info',
    })
  }

  // Kualitas udara (muncul setelah datanya selesai dimuat)
  if (air) {
    const aqi = Math.round(air.aqi)
    if (aqi >= 5) {
      tips.push({
        icon: '😷',
        title: 'Udara tidak sehat',
        text: 'Hindari aktivitas di luar. Gunakan masker bila harus keluar.',
        tone: 'danger',
      })
    } else if (aqi === 4) {
      tips.push({
        icon: '😷',
        title: 'Kualitas udara buruk',
        text: 'Kurangi aktivitas fisik di luar dan pertimbangkan memakai masker.',
        tone: 'warn',
      })
    } else if (aqi === 3) {
      tips.push({
        icon: '🌫️',
        title: 'Udara kurang segar',
        text: 'Kelompok sensitif sebaiknya mengurangi aktivitas berat di luar.',
        tone: 'info',
      })
    } else {
      tips.push({
        icon: '🍃',
        title: 'Udara bersih',
        text: 'Kualitas udara baik untuk beraktivitas di luar.',
        tone: 'good',
      })
    }
  }

  return tips.sort((a, b) => PRIORITY[a.tone] - PRIORITY[b.tone]).slice(0, 5)
}

function getVerdict(tips: Tip[]) {
  if (tips.some((t) => t.tone === 'danger')) {
    return { label: 'Sebaiknya batasi aktivitas di luar', color: 'bg-red-500' }
  }
  if (tips.some((t) => t.tone === 'warn')) {
    return { label: 'Perlu persiapan sebelum keluar', color: 'bg-amber-500' }
  }
  return { label: 'Cocok untuk beraktivitas di luar', color: 'bg-green-500' }
}

type Props = {
  weather: Weather
  forecast: ForecastData | null
  air: AirQuality | null
  unit: Unit
}

export default function ActivityTips({ weather, forecast, air, unit }: Props) {
  const tips = buildTips(weather, forecast, air, unit)
  const verdict = getVerdict(tips)

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Saran aktivitas
      </h3>

      <span
        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${verdict.color}`}
      >
        {verdict.label}
      </span>

      <ul className="mt-3 space-y-2">
        {tips.map((t) => (
          <li
            key={t.title}
            className={`flex gap-3 rounded-lg border-l-4 bg-slate-100 p-3 dark:bg-slate-800 ${BORDER[t.tone]}`}
          >
            <span className="text-xl" aria-hidden>
              {t.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {t.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[11px] text-slate-400">
        Saran dibuat otomatis dari data cuaca dan bukan pengganti informasi resmi.
      </p>
    </section>
  )
}