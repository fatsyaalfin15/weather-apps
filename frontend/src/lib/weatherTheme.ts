export type Scene =
  | 'clear-day'
  | 'clear-night'
  | 'clouds'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'mist'

// Menerjemahkan kode ikon OpenWeather (mis. "10d") menjadi suasana latar
export function getScene(icon?: string): { scene: Scene; night: boolean } {
  if (!icon) return { scene: 'clear-day', night: false }

  const night = icon.endsWith('n')
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