import { useNavigate } from 'react-router-dom'
import { Leaf, ShoppingBag, ChevronRight, BarChart2 } from 'lucide-react'
import logo from '../assets/images/unnamed.png'

export default function RoleSelect() {
  const navigate = useNavigate()

  const cards = [
    {
      label: '農家として出荷する',
      Icon: Leaf,
      onClick: () => navigate('/farmer'),
    },
    {
      label: 'バイヤーとして仕入れる',
      Icon: ShoppingBag,
      onClick: () => navigate('/buyer/products'),
    },
    {
      label: 'スカイマーク運営として管理する',
      Icon: BarChart2,
      onClick: () => navigate('/skymark'),
    },
  ]

  return (
    <div style={{ minHeight: '100svh', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: '"Noto Sans JP", sans-serif' }}>

      {/* Logo */}
      <img src={logo} alt="ロゴ" style={{ width: 500, marginBottom: 32, objectFit: 'contain' }} />

      {/* Cards */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map(({ label, Icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: '#FFFFFF', borderRadius: 8, padding: '18px 20px',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              width: '100%',
            }}
          >
            <Icon size={22} color="#1E3A5F" strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1E3A5F' }}>{label}</span>
            <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  )
}
