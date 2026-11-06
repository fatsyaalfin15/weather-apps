export default function WeatherSkeleton() {
  const panel =
    'animate-pulse rounded-2xl bg-white/85 p-4 shadow-xl backdrop-blur-md sm:p-5 dark:bg-slate-900/85'
  const bar = 'rounded bg-slate-300 dark:bg-slate-700'
  const box = 'rounded-lg bg-slate-200 dark:bg-slate-800'

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat data cuaca">
      <div className={panel}>
        <div className={`h-3 w-24 ${bar}`} />
        <div className="mt-3 flex items-center justify-between">
          <div className="space-y-2">
            <div className={`h-6 w-40 ${bar}`} />
            <div className={`h-4 w-28 ${bar}`} />
          </div>
          <div className={`h-14 w-24 ${bar}`} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-20 ${box}`} />
          ))}
        </div>
      </div>

      <div className={panel}>
        <div className={`h-4 w-36 ${bar}`} />
        <div className={`mt-3 h-36 ${box}`} />
      </div>

      <div className={panel}>
        <div className={`h-4 w-32 ${bar}`} />
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-28 ${box}`} />
          ))}
        </div>
      </div>
    </div>
  )
}