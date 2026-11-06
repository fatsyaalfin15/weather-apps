import type { Unit } from '../lib/units'

type Props = { unit: Unit; onChange: (unit: Unit) => void }

export default function UnitToggle({ unit, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Satuan suhu"
      className="flex overflow-hidden rounded-full bg-slate-200 text-sm font-medium dark:bg-slate-700"
    >
      {(['C', 'F'] as const).map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          className={`px-3 py-1.5 transition-colors ${
            unit === u
              ? 'bg-sky-600 text-white'
              : 'text-slate-600 hover:bg-slate-300 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          °{u}
        </button>
      ))}
    </div>
  )
}