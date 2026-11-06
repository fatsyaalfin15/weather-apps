type Props = {
  history: string[]
  onSelect: (city: string) => void
  onClear: () => void
}

export default function HistoryList({ history, onSelect, onClear }: Props) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Belum ada riwayat. Kota yang kamu cari akan muncul di sini.
      </p>
    )
  }

  return (
    <>
      <ul className="space-y-1">
        {history.map((city) => (
          <li key={city}>
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span aria-hidden>🕘</span>
              <span className="truncate">{city}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Hapus riwayat
      </button>
    </>
  )
}