import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, MapPin, Package, ArrowRight, CheckCircle } from 'lucide-react'

const INFO = [
  { icon: MapPin,   label: '集荷場所',   value: '田中農場（茨城県鉾田市）' },
  { icon: Package,  label: '集荷農産物', value: '茨城メロン 50kg' },
  { icon: MapPin,   label: '目的地',     value: '茨城空港' },
]

export default function TruckRequest() {
  const navigate = useNavigate()
  const [arranged, setArranged] = useState(false)

  return (
    <div style={{ minHeight: '100svh', background: '#FFFFFF', fontFamily: '"Noto Sans JP", sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Truck size={20} color="#111827" strokeWidth={1.8} />
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>トラックを手配する</span>
      </header>

      <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Info card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={15} color="#6B7280" strokeWidth={1.8} />
                <span style={{ fontSize: 13, color: '#6B7280', width: 80, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arranged message */}
        {arranged && (
          <div style={{ background: '#F0F4FF', border: '1px solid #C7D7F5', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle size={20} color="#1E3A5F" strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1E3A5F' }}>手配完了！2時間後に到着予定です</span>
          </div>
        )}

        {/* Buttons */}
        {!arranged ? (
          <button
            onClick={() => setArranged(true)}
            style={{
              width: '100%', background: '#1E3A5F', color: '#FFFFFF',
              border: 'none', borderRadius: 8, padding: '14px 0',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Truck size={16} color="#FFFFFF" strokeWidth={2} />
            トラックを呼ぶ
          </button>
        ) : (
          <button
            onClick={() => navigate('/flights')}
            style={{
              width: '100%', background: '#1E3A5F', color: '#FFFFFF',
              border: 'none', borderRadius: 8, padding: '14px 0',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            便を選ぶ
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
          </button>
        )}

      </div>
    </div>
  )
}
