import { useEffect, useState } from 'react'
import type { Unit } from '../lib/units'

const KEY = 'weather-unit'

function load(): Unit {
  try {
    return localStorage.getItem(KEY) === 'F' ? 'F' : 'C'
  } catch {
    return 'C'
  }
}

export function useUnit() {
  const [unit, setUnit] = useState<Unit>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, unit)
    } catch {
      // abaikan
    }
  }, [unit])

  return { unit, setUnit }
}