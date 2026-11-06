type Props = { dark: boolean; onToggle: () => void }

export default function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className="rounded-full bg-slate-200 px-3 py-1.5 text-lg hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}