import { useNavigate } from 'react-router-dom'
import { Bell, ArrowRight, User, Package, Calendar, Tag } from 'lucide-react'

const ORDER = {
  buyerName: '沖縄かりゆしリゾート',
  product: '茨城メロン',
  weight: 50,
  deliveryDate: '明日',
  unitPrice: 4500,
}

export default function FarmerHome() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100svh', background: '#FFFFFF', fontFamily: '"Noto Sans JP", sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Bell size={20} color="#111827" strokeWidth={1.8} />
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>新着注文</span>
      </header>

      <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>

        {/* Order card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <Row icon={<User size={15} color="#6B7280" />} label="バイヤー" value={ORDER.buyerName} />
            <Row icon={<Package size={15} color="#6B7280" />} label="農産物" value={ORDER.product} />
            <Row icon={<Package size={15} color="#6B7280" />} label="数量" value={`${ORDER.weight.toLocaleString()}kg`} />
            <Row icon={<Calendar size={15} color="#6B7280" />} label="希望着日" value={ORDER.deliveryDate} />
            <Row icon={<Tag size={15} color="#6B7280" />} label="単価" value={`¥${ORDER.unitPrice.toLocaleString()}/kg`} bold />

          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 20, paddingTop: 16 }}>
            <button
              onClick={() => navigate('/truck')}
              style={{
                width: '100%', background: '#1E3A5F', color: '#FFFFFF',
                border: 'none', borderRadius: 8, padding: '14px 0',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              この便で出荷する
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

function Row({ icon, label, value, bold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon}
      <span style={{ fontSize: 13, color: '#6B7280', width: 72, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: '#111827' }}>{value}</span>
    </div>
  )
}
