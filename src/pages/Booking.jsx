import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Leaf, Package, Beef, Fish, Apple, Cherry, Bot, ArrowRight } from 'lucide-react'
import { FLIGHTS, getAvailableBelly, getCapacityPercent } from '@/data/flights'
import { PRODUCTS } from '@/data/products'
import { calcPricePerKg, calcTotal } from '@/data/pricing'
import { getCargoRecommendation } from '@/services/claude'

const PRODUCT_ICONS = {
  melon:        { Icon: Leaf,    color: '#16a34a' },
  hoshiimo:     { Icon: Package, color: '#b45309' },
  hitachi_beef: { Icon: Beef,    color: '#dc2626' },
  hirame:       { Icon: Fish,    color: '#0284c7' },
  ringo:        { Icon: Apple,   color: '#e11d48' },
  tochiotome:   { Icon: Cherry,  color: '#db2777' },
}

export default function Booking() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const flight = state?.flight ?? FLIGHTS[0]

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [boxes, setBoxes] = useState(50)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const avail = getAvailableBelly(flight)
  const pct = getCapacityPercent(flight)

  const pricePerKg = 1000
  const totalKg = selectedProduct ? Number(boxes) || 0 : 0
  const totalPrice = pricePerKg * totalKg

  const fetchAI = useCallback(async (product) => {
    if (!product) return
    setAiLoading(true)
    setAiText('')
    const text = await getCargoRecommendation({
      flight, product, boxes,
      availableCapacity: avail,
      estimatedPrice: calcTotal(calcPricePerKg(flight, product, pct), boxes, product).totalPrice,
    })
    setAiText(text)
    setAiLoading(false)
  }, [flight, boxes, avail, pct])

  useEffect(() => {
    if (selectedProduct) fetchAI(selectedProduct)
  }, [selectedProduct])

  const handleConfirm = () => {
    const bookingId = `IBR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
    navigate('/confirm', { state: { flight, product: selectedProduct, boxes, totalKg, totalPrice, bookingId } })
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      <header className="bg-[#003B6F] text-white px-4 py-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-blue-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">ベリーカーゴ予約</h1>
            <p className="text-xs text-blue-200">{flight.id} 茨城 → {flight.arrivalCity}  {flight.departureTime}発</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto w-full px-4 py-4 space-y-4">

        {/* Flight summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['利用可能容積', `${avail.volume}m³`],
              ['利用可能重量', `${avail.weight.toLocaleString()}kg`],
              ['到着時刻', flight.arrivalTime],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-lg font-bold text-[#003B6F]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product selector */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-700 mb-3">農産物を選択</h2>
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {PRODUCTS.map((p) => {
              const { Icon, color } = PRODUCT_ICONS[p.id] ?? {}
              const active = selectedProduct?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    active ? 'border-[#F5A800] bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    active ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    {Icon && <Icon size={20} color={active ? color : '#94a3b8'} strokeWidth={2} />}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight text-slate-700">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.origin}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quantity */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            >
              <h2 className="text-sm font-bold text-slate-700 mb-3">
                数量（kg）
                <span className="text-xs text-slate-400 font-normal ml-2">最大 {avail.weight.toLocaleString()}kg まで</span>
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={boxes}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    if (raw === '') { setBoxes(''); return }
                    const n = parseInt(raw, 10)
                    setBoxes(Math.min(avail.weight, Math.max(1, n)))
                  }}
                  onBlur={() => {
                    const n = parseInt(boxes, 10)
                    if (!n || n < 1) setBoxes(1)
                  }}
                  className="w-28 text-center text-2xl font-bold text-[#003B6F] border border-slate-300 rounded-lg py-2 focus:outline-none focus:border-[#003B6F]"
                />
                <span className="text-sm text-slate-500">kg</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Recommendation */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#003B6F] flex items-center justify-center">
                  <Bot size={15} color="white" strokeWidth={2} />
                </div>
                <h2 className="text-sm font-bold text-slate-700">AI推奨アドバイス</h2>
              </div>
              {aiLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                  <p className="text-xs text-slate-400 mt-2">AIが分析中...</p>
                </div>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiText}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            >
              <h2 className="text-sm font-bold text-slate-700 mb-3">料金見積</h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>基本運賃</span>
                  <span>¥{pricePerKg}/kg × {totalKg}kg</span>
                </div>
                <div className="border-t border-slate-100 pt-1.5 flex justify-between font-bold text-base">
                  <span className="text-slate-800">合計</span>
                  <span className="text-[#003B6F]">¥{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm button */}
        <AnimatePresence>
          {selectedProduct && !aiLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              onClick={handleConfirm}
              className="w-full bg-[#F5A800] hover:bg-[#e09900] active:bg-[#cc8800] text-white font-bold text-lg py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              今すぐ予約確定 <ArrowRight size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
