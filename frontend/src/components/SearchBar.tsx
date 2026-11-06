import { useEffect, useId, useRef, useState } from 'react'
import { useCitySuggestions } from '../hooks/useCitySuggestions'
import type { CitySuggestion } from '../types/weather'

type Props = {
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onSelect: (city: CitySuggestion) => void
}

export default function SearchBar({ value, loading, onChange, onSubmit, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const { suggestions, loading: searching } = useCitySuggestions(value, open)

  // tutup dropdown saat klik di luar
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function pick(city: CitySuggestion) {
    setOpen(false)
    setActive(-1)
    onSelect(city)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      pick(suggestions[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && suggestions.length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setOpen(false)
        onSubmit()
      }}
      className="flex gap-2"
    >
      <div ref={wrapRef} className="relative min-w-0 flex-1">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Masukkan nama kota..."
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
        />

        {searching && (
          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        )}

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            {suggestions.map((c, i) => (
              <li
                key={`${c.lat},${c.lon}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(c)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === active ? 'bg-sky-100 dark:bg-slate-700' : ''
                }`}
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">{c.name}</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  {[c.state, c.country].filter(Boolean).join(', ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-50 sm:px-4"
      >
        {loading ? 'Memuat...' : 'Cari'}
      </button>
    </form>
  )
}