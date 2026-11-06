import { useCallback, useState } from 'react'

export type Coords = { lat: number; lon: number }

function messageFor(err: GeolocationPositionError) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.'
    case err.POSITION_UNAVAILABLE:
      return 'Lokasi tidak dapat ditentukan.'
    case err.TIMEOUT:
      return 'Pencarian lokasi terlalu lama, coba lagi.'
    default:
      return 'Gagal mengambil lokasi.'
  }
}

export function useGeolocation() {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  const clearError = useCallback(() => setError(''), [])

  const locate = useCallback((): Promise<Coords | null> => {
    setError('')

    if (!('geolocation' in navigator)) {
      setError('Browser kamu tidak mendukung geolokasi.')
      return Promise.resolve(null)
    }

    setLocating(true)
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false)
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        },
        (err) => {
          setLocating(false)
          setError(messageFor(err))
          resolve(null)
        },
        { timeout: 10000, maximumAge: 5 * 60 * 1000 }
      )
    })
  }, [])

  return { locate, locating, error, clearError }
}