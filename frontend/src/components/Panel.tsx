import type { ReactNode } from 'react'

type Props = {
  title?: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export default function Panel({ title, subtitle, className = '', children }: Props) {
  return (
    <section
      className={`min-w-0 rounded-2xl bg-white/85 p-4 shadow-xl backdrop-blur-md sm:p-5 dark:bg-slate-900/85 ${className}`}
    >
      {title && (
        <header className="mb-3">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}