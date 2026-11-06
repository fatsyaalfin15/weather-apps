export type AirLevel = {
  label: string
  color: string
  tip: string
  pm25: string
  pm10: string
}

export const LEVELS: AirLevel[] = [
  {
    label: 'Baik',
    color: 'bg-green-500',
    tip: 'Udara bersih, aman untuk beraktivitas di luar.',
    pm25: '< 10',
    pm10: '< 20',
  },
  {
    label: 'Cukup Baik',
    color: 'bg-lime-500',
    tip: 'Kualitas udara dapat diterima untuk kebanyakan orang.',
    pm25: '10–25',
    pm10: '20–50',
  },
  {
    label: 'Sedang',
    color: 'bg-yellow-500',
    tip: 'Kelompok sensitif sebaiknya mengurangi aktivitas berat di luar.',
    pm25: '25–50',
    pm10: '50–100',
  },
  {
    label: 'Buruk',
    color: 'bg-orange-500',
    tip: 'Kurangi aktivitas di luar ruangan, pertimbangkan memakai masker.',
    pm25: '50–75',
    pm10: '100–200',
  },
  {
    label: 'Sangat Buruk',
    color: 'bg-red-500',
    tip: 'Hindari aktivitas di luar ruangan dan gunakan masker.',
    pm25: '≥ 75',
    pm10: '≥ 200',
  },
]