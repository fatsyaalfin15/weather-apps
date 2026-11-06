type Props = { busy: boolean; onClick: () => void }

export default function LocationButton({ busy, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="mt-3 w-full rounded-lg border border-sky-600 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-50 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-950"
    >
      {busy ? 'Mencari lokasi...' : '📍 Gunakan lokasi saya'}
    </button>
  )
}