import type { CSSProperties } from 'react'

export default function Hero() {
  return (
    <header className="py-8 text-center sm:py-12">
      <div className="anim-float mx-auto mb-3 w-fit text-5xl" aria-hidden>
        ⛅
      </div>
      <h1 className="anim-fade-up text-balance text-3xl font-extrabold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-5xl">
        Selamat Datang di Web Informasi Cuaca Terbaru
      </h1>
      <p
        className="anim-fade-up mx-auto mt-3 max-w-xl text-sm text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] sm:text-base"
        style={{ '--delay': '0.15s' } as CSSProperties}
      >
        Pantau cuaca, kualitas udara, dan prakiraan untuk kota mana pun, langsung dari satu tempat.
      </p>
    </header>
  )
}