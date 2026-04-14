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
          <div style={{ background: '#1a3a5c', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plane size={17} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#1a3a5c', letterSpacing: -0.3 }}>茨城空港マルシェ</span>
        </div>
        <button style={{
          border: '1.5px solid #1a3a5c', borderRadius: 6, padding: '6px 14px',
          fontSize: 13, fontWeight: 600, color: '#1a3a5c', background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <LogIn size={13} /> ログイン
        </button>
      </header>

      {/* Hero section */}
      <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        {/* Gradient image grid */}
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flex: 1, background: 'linear-gradient(160deg, #2d5016 0%, #4a7a20 100%)' }} />
          <div style={{ flex: 1, background: 'linear-gradient(160deg, #8b4513 0%, #b5651d 100%)' }} />
          <div style={{ flex: 1, background: 'linear-gradient(160deg, #4a90d9 0%, #2c6fad 100%)' }} />
        </div>

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }} />

        {/* Hero card */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.93)', borderRadius: 14, padding: '28px 32px',
            maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{ width: 3, height: 22, background: '#FF6B00', borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B00', letterSpacing: 1, textTransform: 'uppercase' }}>Ibaraki Airport Fresh Market</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a3a5c', lineHeight: 1.25, margin: '0 0 10px' }}>
              最短、届けます。
            </h1>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: 0 }}>
              茨城の農産物を全国へ。<br />スカイマーク便で翌日配送。
            </p>
          </div>
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
              background: 'none', border: 'none', color: activeTab === 'farmer' ? '#1a3a5c' : '#999',
              borderBottom: activeTab === 'farmer' ? '3px solid #1a3a5c' : '3px solid transparent',
              marginBottom: -2, transition: 'all 0.15s',
            }}
          >
            🌱 農家として出荷する
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            style={{
              flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none', color: activeTab === 'buyer' ? '#1a3a5c' : '#999',
              borderBottom: activeTab === 'buyer' ? '3px solid #1a3a5c' : '3px solid transparent',
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
                background: '#1a3a5c', color: 'white', fontSize: 15, fontWeight: 700,
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
                background: '#FF6B00', color: 'white', fontSize: 15, fontWeight: 700,
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
