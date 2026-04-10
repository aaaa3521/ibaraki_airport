import { useState, useRef, useEffect, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Plane, Leaf, Package, Beef, Truck, User, ArrowRight, Navigation } from 'lucide-react'
import { FARMERS, AIRPORT } from '@/data/farmers'
import { useNavigate } from 'react-router-dom'
import { FLIGHTS } from '@/data/flights'

// ユーザーのモック位置（鉾田市付近）
const USER_LOCATION = { lat: 36.03, lng: 140.54 }

// トラックのルート: 空港 → 農家3軒 → 空港
const ROUTE_WAYPOINTS = [
  [AIRPORT.lat, AIRPORT.lng],
  [FARMERS[0].lat, FARMERS[0].lng],
  [FARMERS[1].lat, FARMERS[1].lng],
  [FARMERS[2].lat, FARMERS[2].lng],
  [AIRPORT.lat, AIRPORT.lng],
]

const SEGMENT_LABELS = [
  { from: '茨城空港', to: FARMERS[0].name, eta: '約8分' },
  { from: FARMERS[0].name, to: FARMERS[1].name, eta: '約12分' },
  { from: FARMERS[1].name, to: FARMERS[2].name, eta: '約10分' },
  { from: FARMERS[2].name, to: '茨城空港', eta: '約15分' },
]

const STEPS = 80
const INTERVAL_MS = 60

// アイコン定義
const PRODUCT_STYLES = {
  melon:        { Icon: Leaf,    color: '#4ade80', bg: '#052e16' },
  hoshiimo:     { Icon: Package, color: '#fbbf24', bg: '#1c1009' },
  hitachi_beef: { Icon: Beef,    color: '#f87171', bg: '#1c0a0a' },
}

function makeIcon(iconEl, opts = {}) {
  const { bg = '#003B6F', border = '#F5A800', size = 38, label = '', labelColor = '#F5A800' } = opts
  const svg = renderToStaticMarkup(iconEl)
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="
          background:${bg};border:2px solid ${border};border-radius:50%;
          width:${size}px;height:${size}px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 12px ${border}55,0 2px 8px rgba(0,0,0,0.5);
        ">${svg}</div>
        ${label ? `<div style="
          background:rgba(0,0,0,0.75);color:${labelColor};font-size:10px;font-weight:700;
          padding:2px 7px;border-radius:4px;white-space:nowrap;letter-spacing:0.3px;
          border:1px solid ${border}44;backdrop-filter:blur(4px);
        ">${label}</div>` : ''}
      </div>`,
    iconSize: [size, label ? size + 22 : size],
    iconAnchor: [size / 2, label ? size + 22 : size],
    popupAnchor: [0, -(label ? size + 22 : size)],
    className: '',
  })
}

function makeTruckIcon(glowing = false) {
  const svg = renderToStaticMarkup(createElement(Truck, { size: 18, color: '#0a0f1e', strokeWidth: 2.5 }))
  return L.divIcon({
    html: `
      <div style="
        background:#F5A800;border:2px solid #fff;border-radius:8px;
        width:36px;height:36px;display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 ${glowing ? 20 : 10}px #F5A800aa,0 2px 8px rgba(0,0,0,0.6);
        transform:rotate(0deg);
      ">${svg}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
    className: '',
  })
}

// トラックマーカー（smooth animation用）
function AnimatedTruck({ segment }) {
  const map = useMap()
  const markerRef = useRef(null)
  const timerRef = useRef(null)
  const stepRef = useRef(0)

  useEffect(() => {
    const start = ROUTE_WAYPOINTS[segment]
    const end = ROUTE_WAYPOINTS[segment + 1]

    if (!markerRef.current) {
      markerRef.current = L.marker(start, { icon: makeTruckIcon(true), zIndexOffset: 1000 }).addTo(map)
    }

    stepRef.current = 0
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      stepRef.current++
      if (stepRef.current > STEPS) { clearInterval(timerRef.current); return }
      const t = stepRef.current / STEPS
      const lat = start[0] + (end[0] - start[0]) * t
      const lng = start[1] + (end[1] - start[1]) * t
      markerRef.current?.setLatLng([lat, lng])
    }, INTERVAL_MS)

    return () => clearInterval(timerRef.current)
  }, [segment, map])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      if (markerRef.current) { map.removeLayer(markerRef.current); markerRef.current = null }
    }
  }, [map])

  return null
}

export default function MapView() {
  const navigate = useNavigate()
  const [segment, setSegment] = useState(0)

  // セグメントを自動進行
  useEffect(() => {
    const totalMs = STEPS * INTERVAL_MS + 1500 // 移動時間 + 停車時間
    const timer = setInterval(() => {
      setSegment(s => (s + 1) % (ROUTE_WAYPOINTS.length - 1))
    }, totalMs)
    return () => clearInterval(timer)
  }, [])

  const seg = SEGMENT_LABELS[segment]

  // アイコン生成
  const airportIcon = makeIcon(
    createElement(Plane, { size: 20, color: '#F5A800', strokeWidth: 2 }),
    { bg: '#001a3a', border: '#F5A800', size: 42, label: '茨城空港', labelColor: '#F5A800' }
  )
  const userIcon = makeIcon(
    createElement(User, { size: 18, color: '#00d4ff', strokeWidth: 2 }),
    { bg: '#001833', border: '#00d4ff', size: 36, label: 'あなた', labelColor: '#00d4ff' }
  )

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-[#0a0f1e]">
      {/* Header */}
      <header className="bg-[#0a0f1e] border-b border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5A800] flex items-center justify-center">
              <Truck size={16} color="#0a0f1e" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white text-base font-bold leading-tight">集荷マップ</h1>
              <p className="text-slate-500 text-xs">リアルタイム追跡</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            追跡中
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 260px)' }}>
        <MapContainer
          center={[36.2, 140.45]}
          zoom={10}
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* 全ルートの点線 */}
          <Polyline
            positions={ROUTE_WAYPOINTS}
            pathOptions={{ color: '#F5A800', weight: 2, dashArray: '6 5', opacity: 0.35 }}
          />

          {/* 空港ピン */}
          <Marker position={[AIRPORT.lat, AIRPORT.lng]} icon={airportIcon}>
            <Popup className="dark-popup">
              <div className="text-sm font-bold text-white">茨城空港</div>
              <div className="text-xs text-slate-400 mt-0.5">本日 4便運航中</div>
            </Popup>
          </Marker>

          {/* ユーザー位置 */}
          <Marker position={[USER_LOCATION.lat, USER_LOCATION.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm font-bold">あなたの現在位置</div>
              <div className="text-xs text-slate-400 mt-0.5">鉾田市付近</div>
            </Popup>
          </Marker>

          {/* 農家ピン */}
          {FARMERS.map((farmer) => {
            const { Icon, color, bg } = PRODUCT_STYLES[farmer.product] ?? {}
            const icon = makeIcon(
              createElement(Icon, { size: 17, color, strokeWidth: 2 }),
              { bg, border: color, size: 38, label: farmer.name, labelColor: color }
            )
            return (
              <Marker key={farmer.id} position={[farmer.lat, farmer.lng]} icon={icon}>
                <Popup>
                  <div className="min-w-[150px]">
                    <div className="font-bold text-sm">{farmer.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{farmer.city}</div>
                    <div className="text-xs mt-1.5 space-y-0.5">
                      <div>品目: <strong>{farmer.productName}</strong></div>
                      <div>本日出荷: <strong>{farmer.todayBoxes}箱</strong></div>
                    </div>
                    <button
                      onClick={() => navigate('/booking', { state: { flight: FLIGHTS[1] } })}
                      className="mt-2 w-full text-xs bg-[#F5A800] text-[#0a0f1e] font-bold rounded px-2 py-1.5 flex items-center justify-center gap-1"
                    >
                      予約する <ArrowRight size={11} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* トラックアニメーション */}
          <AnimatedTruck segment={segment} key={segment} />
        </MapContainer>
      </div>

      {/* Go タクシー風ステータスパネル */}
      <div className="bg-[#0d1420] border-t border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto">
          {/* トラック情報 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F5A800] flex items-center justify-center flex-shrink-0">
                <Truck size={18} color="#0a0f1e" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-white text-sm font-bold">集荷トラック #IBR-01</div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Navigation size={10} className="text-[#F5A800]" />
                  <span className="text-[#F5A800] font-medium">{seg.from}</span>
                  <ArrowRight size={10} className="text-slate-500" />
                  <span className="text-white">{seg.to}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#F5A800] text-lg font-bold">{seg.eta}</div>
              <div className="text-slate-500 text-xs">到着予定</div>
            </div>
          </div>

          {/* ルートステップ */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {ROUTE_WAYPOINTS.slice(0, -1).map((_, i) => {
              const label = i === 0 ? '空港' : FARMERS[i - 1]?.name ?? ''
              const done = i < segment
              const active = i === segment
              return (
                <div key={i} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`flex flex-col items-center gap-0.5`}>
                    <div className={`w-2 h-2 rounded-full ${
                      done ? 'bg-emerald-500' : active ? 'bg-[#F5A800] animate-pulse' : 'bg-slate-700'
                    }`} />
                    <span className={`text-[10px] whitespace-nowrap ${
                      done ? 'text-emerald-500' : active ? 'text-[#F5A800] font-bold' : 'text-slate-600'
                    }`}>{label}</span>
                  </div>
                  {i < ROUTE_WAYPOINTS.length - 2 && (
                    <div className={`w-6 h-px mb-3 ${done ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              )
            })}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${segment === ROUTE_WAYPOINTS.length - 2 && false ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              <span className="text-[10px] text-slate-600">空港</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
