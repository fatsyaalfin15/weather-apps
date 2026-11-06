import { useEffect, useState } from 'react'
import { searchCities } from '../lib/api'
import type { CitySuggestion } from '../types/weather'

export function useCitySuggestions(input: string, enabled: boolean) {
  const [results, setResults] = useState<CitySuggestion[]>([])
  const [fetching, setFetching] = useState(false)

  const q = input.trim()
  const active = enabled && q.length >= 2

  useEffect(() => {
    if (!active) return

    const controller = new AbortController()
    // jeda 350 ms: request baru dikirim setelah pengguna berhenti mengetik
    const timer = setTimeout(async () => {
      setFetching(true)
      try {
        const data = await searchCities(q, controller.signal)
        if (!controller.signal.aborted) setResults(data)
      } catch {
        if (!controller.signal.aborted) setResults([])
      } finally {
        if (!controller.signal.aborted) setFetching(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort() // batalkan request lama
    }
  }, [q, active])

  return {
    suggestions: active ? results : [],
    loading: active && fetching,
  }
}