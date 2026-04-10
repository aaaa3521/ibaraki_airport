import { useState, useRef, useEffect, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Plane, Leaf, Package, Beef, MapPin, ArrowRight } from 'lucide-react'
import { FARMERS, AIRPORT } from '@/data/farmers'
import { useNavigate } from 'react-router-dom'
import { FLIGHTS } from '@/data/flights'

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const PRODUCT_ICON_MAP = {
  melon:        { Icon: Leaf,    color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
  hoshiimo:     { Icon: Package, color: '#b45309', bg: '#fffbeb', border: '#d97706' },
  hitachi_beef: { Icon: Beef,    color: '#dc2626', bg: '#fff1f2', border: '#dc2626' },
}

function makeFarmerIcon(productId, name) {
  const { Icon, color, bg, border } = PRODUCT_ICON_MAP[productId] ?? PRODUCT_ICON_MAP.hoshiimo
  const iconSvg = renderToStaticMarkup(createElement(Icon, { size: 18, color, strokeWidth: 2 }))
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="
          background:${bg};border:2px solid ${border};border-radius:50%;
          width:40px;height:40px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.18);
        ">${iconSvg}</div>
        <div style="
          background:${color};color:white;font-size:10px;font-weight:700;
          padding:2px 7px;border-radius:6px;white-space:nowrap;
          box-shadow:0 1px 4px rgba(0,0,0,0.15);letter-spacing:0.2px;
        ">${name}</div>
      </div>`,
    iconSize: [40, 66],
    iconAnchor: [20, 66],
    popupAnchor: [0, -66],
    className: '',
  })
}

function makeAirportIcon() {
  const planeSvg = renderToStaticMarkup(createElement(Plane, { size: 22, color: 'white', strokeWidth: 2 }))
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="
          background:#003B6F;border:2.5px solid #F5A800;border-radius:50%;
          width:48px;height:48px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 3px 12px rgba(0,0,0,0.28);
        ">${planeSvg}</div>
        <div style="
          background:#F5A800;color:#003B6F;font-size:10px;font-weight:800;
          padding:2px 8px;border-radius:6px;white-space:nowrap;
          box-shadow:0 1px 4px rgba(0,0,0,0.15);letter-spacing:0.3px;
        ">茨城空港</div>
      </div>`,
    iconSize: [48, 72],
    iconAnchor: [24, 72],
    popupAnchor: [0, -72],
    className: '',
  })
}

const airportIcon = makeAirportIcon()

function AnimatedRoute({ from, active }) {
  const map = useMap()
  const timerRef = useRef(null)
  const polyRef = useRef(null)

  useEffect(() => {
    if (!active) {
      if (polyRef.current) { map.removeLayer(polyRef.current); polyRef.current = null }
      clearTimeout(timerRef.current)
      return
    }
    const start = [from.lat, from.lng]
    const end = [AIRPORT.lat, AIRPORT.lng]
    const steps = 40
    const points = Array.from({ length: steps + 1 }, (_, i) => [
      start[0] + (end[0] - start[0]) * (i / steps),
      start[1] + (end[1] - start[1]) * (i / steps),
    ])
    const line = L.polyline([], { color: '#F5A800', weight: 3, dashArray: '8 5', opacity: 0.9 }).addTo(map)
    polyRef.current = line
    let step = 0
    function draw() {
      if (step <= steps) { line.setLatLngs(points.slice(0, step + 1)); step++; timerRef.current = setTimeout(draw, 30) }
    }
    draw()
    return () => { clearTimeout(timerRef.current); if (polyRef.current) { map.removeLayer(polyRef.current); polyRef.current = null } }
  }, [active, from, map])

  return null
}

export default function MapView() {
  const navigate = useNavigate()
  const [activeRoute, setActiveRoute] = useState(null)

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="bg-[#003B6F] text-white px-4 py-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F5A800] flex items-center justify-center flex-shrink-0">
            <MapPin size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold">農家マップ</h1>
            <p className="text-xs text-blue-200 mt-0.5">茨城県内の出荷農家と最適ルート</p>
          </div>
        </div>
      </header>

      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 210px)' }}>
        <MapContainer
          center={[36.2, 140.45]}
          zoom={10}
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <Marker position={[AIRPORT.lat, AIRPORT.lng]} icon={airportIcon}>
            <Popup>
              <div className="font-bold text-[#003B6F] text-sm">茨城空港</div>
              <div className="text-xs text-slate-500 mt-1">本日 4便運航中</div>
            </Popup>
          </Marker>

          {FARMERS.map((farmer) => (
            <Marker
              key={farmer.id}
              position={[farmer.lat, farmer.lng]}
              icon={makeFarmerIcon(farmer.product, farmer.name)}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <div className="font-bold text-sm text-[#003B6F]">{farmer.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{farmer.city}</div>
                  <div className="text-xs mt-1.5 space-y-0.5">
                    <div>品目: <strong>{farmer.productName}</strong></div>
                    <div>本日出荷: <strong>{farmer.todayBoxes}箱</strong></div>
                  </div>
                  <button
                    onClick={() => setActiveRoute(farmer)}
                    className="mt-2 w-full text-xs bg-[#F5A800] text-white rounded px-2 py-1.5 font-bold"
                  >
                    ルート表示
                  </button>
                  <button
                    onClick={() => navigate('/booking', { state: { flight: FLIGHTS[1] } })}
                    className="mt-1 w-full text-xs bg-[#003B6F] text-white rounded px-2 py-1.5 font-bold flex items-center justify-center gap-1"
                  >
                    予約する <ArrowRight size={11} />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {activeRoute && <AnimatedRoute from={activeRoute} active={true} key={activeRoute.id} />}
        </MapContainer>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-slate-400 mb-2">農家をタップしてルート表示・予約へ</p>
          <div className="flex flex-wrap gap-2">
            {FARMERS.map((f) => {
              const { Icon, color } = PRODUCT_ICON_MAP[f.product] ?? {}
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveRoute(activeRoute?.id === f.id ? null : f)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeRoute?.id === f.id
                      ? 'bg-[#003B6F] border-[#003B6F] text-white font-bold'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-[#003B6F]'
                  }`}
                >
                  {Icon && <Icon size={12} color={activeRoute?.id === f.id ? 'white' : color} strokeWidth={2} />}
                  {f.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
