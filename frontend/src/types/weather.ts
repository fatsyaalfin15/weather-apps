export type Weather = {
  city: string
  country: string
  lat: number
  lon: number
  temp: number
  feelsLike: number
  humidity: number
  wind: number
  description: string
  icon: string
}

export type DailyForecast = {
  date: string
  min: number
  max: number
  description: string
  icon: string
}

export type HourlyForecast = {
  time: string
  temp: number
  icon: string
  description: string
  pop: number
}

export type ForecastData = {
  daily: DailyForecast[]
  hourly: HourlyForecast[]
}

export type AirQuality = {
  aqi: number
  pm2_5: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
}

export type CitySuggestion = {
  name: string
  state: string | null
  country: string
  lat: number
  lon: number
}

export type Query = { city: string } | { lat: number; lon: number }