export const FLIGHTS = [
  {
    id: 'SKY201',
    departure: '茨城 (IBR)',
    arrival: '神戸 (UKB)',
    arrivalCity: '神戸',
    departureTime: '07:40',
    arrivalTime: '09:20',
    date: '2026-05-10',
    aircraft: 'Boeing 737-800',
    totalBelly: { volume: 45.0, weight: 18000 },
    usedBelly: { volume: 12.3, weight: 4100 },
    status: 'on_time',
    gate: '2',
  },
  {
    id: 'SKY203',
    departure: '茨城 (IBR)',
    arrival: '那覇 (OKA)',
    arrivalCity: '那覇',
    departureTime: '10:15',
    arrivalTime: '13:05',
    date: '2026-05-10',
    aircraft: 'Boeing 737-800',
    totalBelly: { volume: 45.0, weight: 18000 },
    usedBelly: { volume: 18.7, weight: 6200 },
    status: 'on_time',
    gate: '1',
  },
  {
    id: 'SKY205',
    departure: '茨城 (IBR)',
    arrival: '福岡 (FUK)',
    arrivalCity: '福岡',
    departureTime: '14:30',
    arrivalTime: '16:15',
    date: '2026-05-10',
    aircraft: 'Boeing 737-800',
    totalBelly: { volume: 45.0, weight: 18000 },
    usedBelly: { volume: 8.9, weight: 2950 },
    status: 'on_time',
    gate: '3',
  },
  {
    id: 'SKY207',
    departure: '茨城 (IBR)',
    arrival: '神戸 (UKB)',
    arrivalCity: '神戸',
    departureTime: '18:20',
    arrivalTime: '19:55',
    date: '2026-05-10',
    aircraft: 'Boeing 737-800',
    totalBelly: { volume: 45.0, weight: 18000 },
    usedBelly: { volume: 21.4, weight: 7100 },
    status: 'boarding',
    gate: '2',
  },
]

export function getAvailableBelly(flight) {
  return {
    volume: Math.round((flight.totalBelly.volume - flight.usedBelly.volume) * 10) / 10,
    weight: flight.totalBelly.weight - flight.usedBelly.weight,
  }
}

export function getCapacityPercent(flight) {
  return Math.round((flight.usedBelly.weight / flight.totalBelly.weight) * 100)
}
