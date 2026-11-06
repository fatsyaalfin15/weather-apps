import { useEffect, useState } from 'react'

const KEY = 'weather-history'

function load(): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(history))
    } catch {
      // localStorage tidak tersedia, abaikan
    }
  }, [history])

  const add = (city: string) =>
    setHistory((prev) =>
      [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, 5)
    )

  const clear = () => setHistory([])

  return { history, add, clear }
}