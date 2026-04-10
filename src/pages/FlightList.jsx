import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, ArrowRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { FLIGHTS, getAvailableBelly, getCapacityPercent } from '@/data/flights'
import CapacityBar from '@/components/CapacityBar'

const STATUS_LABEL = { on_time: '定刻', delayed: '遅延', boarding: '搭乗中' }
const STATUS_COLOR = {
  on_time:  'text-emerald-700 bg-emerald-50 border border-emerald-200',
  delayed:  'text-red-700 bg-red-50 border border-red-200',
  boarding: 'text-amber-700 bg-amber-50 border border-amber-200',
}

export default function FlightList() {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState('time')
  const [sortAsc, setSortAsc] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const sorted = [...FLIGHTS].sort((a, b) => {
    const va = sortKey === 'time' ? a.departureTime : a.arrivalCity
    const vb = sortKey === 'time' ? b.departureTime : b.arrivalCity
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronsUpDown size={12} className="inline ml-0.5" />
    return sortAsc
      ? <ChevronUp size={12} className="inline ml-0.5" />
      : <ChevronDown size={12} className="inline ml-0.5" />
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <header className="bg-[#003B6F] text-white px-4 py-4 shadow-md">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-[#F5A800] flex items-center justify-center flex-shrink-0">
              <Plane size={20} color="white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">茨城空港 ベリーカーゴ</h1>
              <p className="text-xs text-blue-200">Ibaraki Airport Belly Cargo System</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-blue-200">
            <span>2026年5月10日（日）</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              最終更新 {lastUpdated.getHours()}:{String(lastUpdated.getMinutes()).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Sort bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">並び替え</span>
          {[['time', '出発時刻'], ['dest', '発着先']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${
                sortKey === key
                  ? 'bg-[#003B6F] text-white border-[#003B6F]'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-[#003B6F]'
              }`}
            >
              {label}<SortIcon k={key} />
            </button>
          ))}
        </div>
      </div>

      {/* Flight cards */}
      <div className="flex-1 px-4 py-3 max-w-lg mx-auto w-full">
        <AnimatePresence mode="popLayout">
          {sorted.map((flight, i) => {
            const avail = getAvailableBelly(flight)
            const pct = getCapacityPercent(flight)
            const pricePerKg = Math.round(
              120
              * (flight.arrivalCity === '那覇' ? 1.6 : flight.arrivalCity === '福岡' ? 1.2 : 1.0)
              * (pct < 30 ? 1.3 : pct > 70 ? 0.85 : 1.0)
            )

            return (
              <motion.div
                key={flight.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 mb-3 overflow-hidden"
              >
                <div className="flex items-start justify-between px-4 pt-3 pb-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400 tracking-wide">{flight.id}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base font-bold text-[#003B6F]">{flight.departureTime}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span className="text-base font-bold text-slate-700">{flight.arrivalTime}</span>
                      <span className="text-sm font-semibold text-slate-700">{flight.arrivalCity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[flight.status]}`}>
                      {STATUS_LABEL[flight.status]}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">ゲート {flight.gate}番</div>
                  </div>
                </div>

                <div className="px-4 pb-2">
                  <CapacityBar percent={pct} />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{avail.volume}m³ / {avail.weight.toLocaleString()}kg 利用可能</span>
                    <span className="font-semibold text-[#003B6F]">¥{pricePerKg}/kg</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-4 py-2 flex justify-end">
                  <button
                    onClick={() => navigate('/booking', { state: { flight } })}
                    className="flex items-center gap-1.5 bg-[#F5A800] hover:bg-[#e09900] text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-colors"
                  >
                    予約する <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
