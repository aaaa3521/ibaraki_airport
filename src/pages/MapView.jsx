import { useState, useRef, useEffect, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Plane, Leaf, Package, Beef, Fish, Apple, Cherry, Truck, User, ArrowRight, Navigation } from 'lucide-react'
import { FARMERS, AIRPORT } from '@/data/farmers'
import { useNavigate } from 'react-router-dom'
import { FLIGHTS } from '@/data/flights'
import { fetchRoadRoute } from '@/services/routes'

// ユーザーのモック位置（鉾田市付近）
const USER_LOCATION = { lat: 36.03, lng: 140.54 }

// トラック3台の定義
const TRUCK_DEFS = [
  {
    id: 1, name: '茨城エリア',
    color: '#F5A800', textColor: '#7a5000',
    waypoints: [AIRPORT, FARMERS[0], FARMERS[1], FARMERS[2], AIRPORT],
  },
  {
    id: 2, name: '福島エリア',
    color: '#3b82f6', textColor: '#1e3a8a',
    waypoints: [AIRPORT, FARMERS[3], FARMERS[4], AIRPORT],
  },
  {
    id: 3, name: '栃木エリア',
    color: '#22c55e', textColor: '#14532d',
    waypoints: [AIRPORT, FARMERS[5], AIRPORT],
  },
]

// 農産物アイコン設定
const PRODUCT_STYLES = {
  melon:        { Icon: Leaf,    color: '#16a34a', bg: '#f0fdf4' },
  hoshiimo:     { Icon: Package, color: '#b45309', bg: '#fffbeb' },
  hitachi_beef: { Icon: Beef,    color: '#dc2626', bg: '#fff1f2' },
  hirame:       { Icon: Fish,    color: '#0284c7', bg: '#f0f9ff' },
  ringo:        { Icon: Apple,   color: '#e11d48', bg: '#fff1f2' },
  tochiotome:   { Icon: Cherry,  color: '#db2777', bg: '#fdf2f8' },
}

// アイコン生成
function makeMapIcon(iconEl, opts = {}) {
  const { bg = '#fff', border = '#003B6F', size = 38, label = '', labelColor = '#003B6F' } = opts
  const svg = renderToStaticMarkup(iconEl)
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="
          background:${bg};border:2px solid ${border};border-radius:50%;
          width:${size}px;height:${size}px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.18);
        ">${svg}</div>
        ${label ? `<div style="
          background:${border};color:white;font-size:10px;font-weight:700;
          padding:2px 7px;border-radius:4px;white-space:nowrap;
        ">${label}</div>` : ''}
      </div>`,
    iconSize: [size, label ? size + 22 : size],
    iconAnchor: [size / 2, label ? size + 22 : size],
    popupAnchor: [0, -(label ? size + 22 : size)],
    className: '',
  })
}

function makeTruckIcon(color) {
  const svg = renderToStaticMarkup(createElement(Truck, { size: 16, color: 'white', strokeWidth: 2.5 }))
  return L.divIcon({
    html: `<div style="
      background:${color};border:2px solid white;border-radius:8px;
      width:32px;height:32px;display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
    className: '',
  })
}

// トラックアニメーションコンポーネント
function AnimatedTruck({ route, color, truckId }) {
  const map = useMap()
  const markerRef = useRef(null)
  const indexRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!route || route.length < 2) return

    const icon = makeTruckIcon(color)
    if (markerRef.current) map.removeLayer(markerRef.current)
    markerRef.current = L.marker(route[0], { icon, zIndexOffset: 1000 + truckId }).addTo(map)
    indexRef.current = 0

    // 1周30秒を目安にインターバルを計算
    const intervalMs = Math.max(30, Math.floor(30000 / route.length))

    timerRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % route.length
      markerRef.current?.setLatLng(route[indexRef.current])
    }, intervalMs)

    return () => {
      clearInterval(timerRef.current)
      if (markerRef.current) { map.removeLayer(markerRef.current); markerRef.current = null }
    }
  }, [route, color, truckId, map])

  return null
}

export default function MapView() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([null, null, null])
  const [loading, setLoading] = useState(true)

  // ルート取得
  useEffect(() => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY ?? ''
    console.log('[ORS] APIキー確認:', apiKey ? `先頭10文字: ${apiKey.slice(0, 10)}...` : '❌ 未設定（直線フォールバック）')
    Promise.all(
      TRUCK_DEFS.map(truck => fetchRoadRoute(truck.waypoints, apiKey))
    ).then(results => {
      setRoutes(results)
      setLoading(false)
    })
  }, [])

  // 空港アイコン
  const airportIcon = makeMapIcon(
    createElement(Plane, { size: 20, color: '#F5A800', strokeWidth: 2 }),
    { bg: '#003B6F', border: '#F5A800', size: 42, label: '茨城空港', labelColor: '#F5A800' }
  )
  // ユーザーアイコン
  const userIcon = makeMapIcon(
    createElement(User, { size: 16, color: '#003B6F', strokeWidth: 2 }),
    { bg: '#e0eaf5', border: '#003B6F', size: 32, label: 'あなた', labelColor: '#003B6F' }
  )

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-[#003B6F] text-white px-4 py-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5A800] flex items-center justify-center flex-shrink-0">
              <Truck size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold">集荷マップ</h1>
              <p className="text-blue-200 text-xs mt-0.5">3エリア同時追跡</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            {loading ? 'ルート取得中...' : '追跡中'}
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <MapContainer
          center={[36.6, 140.35]}
          zoom={8}
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* 各トラックのルートライン */}
          {TRUCK_DEFS.map((truck, i) =>
            routes[i] && routes[i].length > 1 ? (
              <Polyline
                key={truck.id}
                positions={routes[i]}
                pathOptions={{ color: truck.color, weight: 3, opacity: 0.5, dashArray: '6 4' }}
              />
            ) : null
          )}

          {/* 空港ピン */}
          <Marker position={[AIRPORT.lat, AIRPORT.lng]} icon={airportIcon}>
            <Popup>
              <div className="font-bold text-[#003B6F] text-sm">茨城空港</div>
              <div className="text-xs text-slate-500 mt-1">本日 4便運航中</div>
            </Popup>
          </Marker>

          {/* ユーザー位置 */}
          <Marker position={[USER_LOCATION.lat, USER_LOCATION.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold text-sm">あなたの現在位置</div>
              <div className="text-xs text-slate-400 mt-0.5">鉾田市付近</div>
            </Popup>
          </Marker>

          {/* 農家ピン */}
          {FARMERS.map((farmer) => {
            const style = PRODUCT_STYLES[farmer.product]
            if (!style) return null
            const icon = makeMapIcon(
              createElement(style.Icon, { size: 16, color: style.color, strokeWidth: 2 }),
              { bg: style.bg, border: style.color, size: 36, label: farmer.name, labelColor: style.color }
            )
            return (
              <Marker key={farmer.id} position={[farmer.lat, farmer.lng]} icon={icon}>
                <Popup>
                  <div className="min-w-[150px]">
                    <div className="font-bold text-sm text-[#003B6F]">{farmer.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{farmer.city}</div>
                    <div className="text-xs mt-1.5 space-y-0.5">
                      <div>品目: <strong>{farmer.productName}</strong></div>
                      <div>本日出荷: <strong>{farmer.todayBoxes}箱</strong></div>
                    </div>
                    <button
                      onClick={() => navigate('/booking', { state: { flight: FLIGHTS[1] } })}
                      className="mt-2 w-full text-xs bg-[#F5A800] text-white font-bold rounded px-2 py-1.5 flex items-center justify-center gap-1"
                    >
                      予約する <ArrowRight size={11} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* 3台のトラックアニメーション */}
          {TRUCK_DEFS.map((truck, i) =>
            routes[i] ? (
              <AnimatedTruck
                key={truck.id}
                route={routes[i]}
                color={truck.color}
                truckId={truck.id}
              />
            ) : null
          )}
        </MapContainer>
      </div>

      {/* ステータスパネル */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto space-y-2">
          {TRUCK_DEFS.map((truck) => (
            <div key={truck.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: truck.color }}
              >
                <Truck size={15} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">T{truck.id}</span>
                  <span className="text-xs text-slate-500">{truck.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Navigation size={9} style={{ color: truck.color }} />
                  <span className="truncate" style={{ color: truck.color }}>
                    {truck.waypoints.slice(1, -1).map(w => w.name).join(' → ')}
                  </span>
                </div>
              </div>
              <div
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${truck.color}20`, color: truck.color }}
              >
                運行中
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
