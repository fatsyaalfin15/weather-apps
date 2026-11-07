export type Scene =
  | 'clear-day'
  | 'clear-night'
  | 'clouds'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'mist'

const SNOW_MAX_TEMP = 1 // °C: suhu segini atau lebih dingin menampilkan salju

// Menerjemahkan kode ikon OpenWeather (mis. "10d") dan suhu menjadi suasana latar
export function getScene(icon?: string, temp?: number): { scene: Scene; night: boolean } {
  if (!icon) return { scene: 'clear-day', night: false }

  const night = icon.endsWith('n')

  // suhu dingin: tampilkan salju, apa pun kondisi dari OpenWeather
  if (temp !== undefined && temp <= SNOW_MAX_TEMP) return { scene: 'snow', night }

  switch (icon.slice(0, 2)) {
    case '01':
    case '02':
      return { scene: night ? 'clear-night' : 'clear-day', night }
    case '03':
    case '04':
      return { scene: 'clouds', night }
    case '09':
    case '10':
      return { scene: 'rain', night }
    case '11':
      return { scene: 'thunder', night }
    case '13':
      return { scene: 'snow', night }
    case '50':
      return { scene: 'mist', night }
    default:
      return { scene: 'clear-day', night }
  }
}