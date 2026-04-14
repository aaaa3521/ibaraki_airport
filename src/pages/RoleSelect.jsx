import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, ArrowRight, LogIn } from 'lucide-react'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('farmer')

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#ffffff', minHeight: '100vh', color: '#333333' }}>

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#003087', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plane size={17} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#003087', letterSpacing: -0.3 }}>茨城空港マルシェ</span>
        </div>
        <button style={{
          border: '1.5px solid #003087', borderRadius: 6, padding: '6px 14px',
          fontSize: 13, fontWeight: 600, color: '#003087', background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <LogIn size={13} /> ログイン
        </button>
      </header>

      {/* Hero section */}
      <div style={{ position: 'relative', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        {/* Gradient background */}
        <div style={{ height: '100%', background: 'linear-gradient(135deg, #003087 0%, #0050b3 60%, #1a6fd4 100%)' }} />

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>SCROLL</span>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </div>

      {/* Tab section */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e5e5', marginTop: 28 }}>
          <button
            onClick={() => setActiveTab('farmer')}
            style={{
              flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none', color: activeTab === 'farmer' ? '#003087' : '#999',
              borderBottom: activeTab === 'farmer' ? '3px solid #003087' : '3px solid transparent',
              marginBottom: -2, transition: 'all 0.15s',
            }}
          >
            🌱 農家として出荷する
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            style={{
              flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none', color: activeTab === 'buyer' ? '#003087' : '#999',
              borderBottom: activeTab === 'buyer' ? '3px solid #003087' : '3px solid transparent',
              marginBottom: -2, transition: 'all 0.15s',
            }}
          >
            🛒 バイヤーとして仕入れる
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'farmer' && (
          <div style={{ paddingTop: 28 }}>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8, margin: '0 0 8px' }}>
              スカイマーク旅客便のベリースペースをリアルタイムで確認。メロン・干し芋・常陸牛などを当日予約・即日出荷できます。
            </p>
            <ul style={{ fontSize: 12, color: '#777', lineHeight: 2, paddingLeft: 18, margin: '0 0 24px' }}>
              <li>AIが空きスペースと料金を自動算出</li>
              <li>タクシーアプリ感覚で簡単予約</li>
              <li>最短で翌日に全国へ配送</li>
            </ul>
            <button
              onClick={() => navigate('/flights')}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#003087', color: 'white', fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              便を確認して予約する <ArrowRight size={16} />
            </button>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div style={{ paddingTop: 28 }}>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8, margin: '0 0 8px' }}>
              茨城・福島・栃木の農家から産地直送。鮮度保証付きの農産物をリアルタイムで注文・購入できます。
            </p>
            <ul style={{ fontSize: 12, color: '#777', lineHeight: 2, paddingLeft: 18, margin: '0 0 24px' }}>
              <li>鮮度・産地・農家情報を詳細表示</li>
              <li>メロン・常陸牛・鮮魚など多品目</li>
              <li>まとめ買いでコスト削減</li>
            </ul>
            <button
              onClick={() => navigate('/buyer/products')}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#003087', color: 'white', fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              商品を見る <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
