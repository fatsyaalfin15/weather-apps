import type { CSSProperties } from 'react'
import { getScene, type Scene } from '../lib/weatherTheme'

// Semua gradasi tetap bernuansa biru
const GRADIENTS: Record<Scene, string> = {
  'clear-day': 'from-sky-400 via-blue-500 to-blue-700',
  'clear-night': 'from-blue-950 via-indigo-950 to-slate-900',
  clouds: 'from-slate-500 via-blue-500 to-blue-800',
  rain: 'from-slate-600 via-blue-700 to-blue-950',
  thunder: 'from-slate-800 via-blue-900 to-indigo-950',
  snow: 'from-sky-300 via-sky-500 to-blue-700',
  mist: 'from-slate-500 via-blue-400 to-blue-700',
}

const CLOUD_COUNT: Record<Scene, number> = {
  'clear-day': 2,
  'clear-night': 0,
  clouds: 4,
  rain: 4,
  thunder: 4,
  snow: 3,
  mist: 0,
}

const css = (s: Record<string, string | number>) => s as CSSProperties
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

// Posisi dibuat dari rumus tetap (bukan acak) supaya tidak berubah tiap render
const CLOUDS = [
  { top: 8, w: 280, h: 70, dur: 110, delay: -20 },
  { top: 22, w: 360, h: 90, dur: 150, delay: -90 },
  { top: 40, w: 240, h: 60, dur: 95, delay: -50 },
  { top: 55, w: 320, h: 80, dur: 130, delay: -10 },
]

const DROPS = range(70).map((i) => ({
  left: (i * 37.7) % 100,
  h: 14 + (i % 4) * 6,
  dur: 0.7 + (i % 5) * 0.12,
  delay: -((i * 0.31) % 1.2),
}))

const FLAKES = range(45).map((i) => ({
  left: (i * 53.3) % 100,
  size: 4 + (i % 4) * 2,
  dur: 8 + (i % 6) * 1.5,
  delay: -((i % 9) * 1.3),
}))

const STARS = range(40).map((i) => ({
  left: (i * 29.7) % 100,
  top: (i * 23.3) % 75,
  size: i % 3 === 0 ? 3 : 2,
  dur: 2 + (i % 4),
  delay: (i % 7) * 0.5,
}))

const FOG = [
  { top: 22, dur: 18, delay: 0 },
  { top: 45, dur: 24, delay: -8 },
  { top: 68, dur: 30, delay: -15 },
]

function Cloud({ c, tone }: { c: (typeof CLOUDS)[number]; tone: string }) {
  return (
    <div
      className="anim-drift absolute left-0"
      style={css({ top: `${c.top}%`, width: c.w, height: c.h, '--dur': `${c.dur}s`, '--delay': `${c.delay}s` })}
    >
      <div className={`absolute inset-x-0 bottom-0 h-2/3 rounded-full blur-lg ${tone}`} />
      <div className={`absolute bottom-1/4 left-[15%] h-full w-[45%] rounded-full blur-lg ${tone}`} />
      <div className={`absolute bottom-1/3 right-[12%] h-4/5 w-[38%] rounded-full blur-lg ${tone}`} />
    </div>
  )
}

export default function WeatherBackground({ icon }: { icon?: string }) {
  const { scene, night } = getScene(icon)
  const heavy = scene === 'clouds' || scene === 'rain' || scene === 'thunder'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* semua gradasi ditumpuk, yang aktif ditampilkan: transisi halus antar cuaca */}
      {(Object.keys(GRADIENTS) as Scene[]).map((s) => (
        <div
          key={s}
          className={`absolute inset-0 bg-linear-to-br transition-opacity duration-1000 ${GRADIENTS[s]} ${
            s === scene ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* malam hari dengan langit berawan/hujan dibuat lebih gelap */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          night && scene !== 'clear-night' ? 'bg-slate-950/40' : 'bg-transparent'
        }`}
      />

      <div key={scene} className="anim-fade-in absolute inset-0">
        {scene === 'clear-day' && (
          <div className="absolute right-[8%] top-[6%]">
            <div className="anim-sun h-28 w-28 rounded-full bg-amber-200/80 shadow-[0_0_80px_30px_rgba(253,230,138,0.45)] sm:h-36 sm:w-36" />
          </div>
        )}

        {scene === 'clear-night' && (
          <>
            <div className="absolute right-[10%] top-[8%] h-20 w-20 rounded-full bg-slate-100/90 shadow-[0_0_60px_15px_rgba(226,232,240,0.35)]" />
            {STARS.map((s, i) => (
              <span
                key={i}
                className="anim-twinkle absolute rounded-full bg-white"
                style={css({
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  '--dur': `${s.dur}s`,
                  '--delay': `${s.delay}s`,
                })}
              />
            ))}
          </>
        )}

        {CLOUDS.slice(0, CLOUD_COUNT[scene]).map((c, i) => (
          <Cloud key={i} c={c} tone={heavy ? 'bg-slate-200/25' : 'bg-white/25'} />
        ))}

        {(scene === 'rain' || scene === 'thunder') &&
          DROPS.map((d, i) => (
            <span
              key={i}
              className="anim-fall absolute top-0 w-0.5 rounded-full bg-linear-to-b from-transparent to-sky-100/70"
              style={css({ left: `${d.left}%`, height: d.h, '--dur': `${d.dur}s`, '--delay': `${d.delay}s` })}
            />
          ))}

        {scene === 'thunder' && <div className="anim-flash absolute inset-0 bg-white" />}

        {scene === 'snow' &&
          FLAKES.map((f, i) => (
            <span
              key={i}
              className="anim-snow absolute top-0 rounded-full bg-white/80"
              style={css({
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                '--dur': `${f.dur}s`,
                '--delay': `${f.delay}s`,
              })}
            />
          ))}

        {scene === 'mist' &&
          FOG.map((f, i) => (
            <div
              key={i}
              className="anim-fog absolute left-[-10%] h-24 w-[120%] rounded-full bg-white/20 blur-2xl"
              style={css({ top: `${f.top}%`, '--dur': `${f.dur}s`, '--delay': `${f.delay}s` })}
            />
          ))}
      </div>

      {/* dark mode: redupkan seluruh latar */}
      <div className="absolute inset-0 hidden bg-black/35 dark:block" />
    </div>
  )
}