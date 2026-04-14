import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, ArrowRight, LogIn, ChevronDown } from 'lucide-react'
import airplane from '../assets/images/airplane.png'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('farmer')

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: '#ffffff',
      color: '#333333',
      WebkitTapHighlightColor: 'transparent',
    }}>

      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        padding: '0 16px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ background: '#003087', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plane size={15} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#003087', letterSpacing: -0.3 }}>茨城空港マルシェ</span>
        </div>
        <button style={{
          border: '1.5px solid #003087', borderRadius: 6, padding: '6px 12px',
          fontSize: 12, fontWeight: 600, color: '#003087', background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          minHeight: 36,
        }}>
          <LogIn size={12} /> ログイン
        </button>
      </header>

      {/* Scroll container */}
      <div style={{ height: 'calc(100svh - 52px)', overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', margin: 0, padding: 0 }}>

      {/* Hero section */}
      <div style={{
        position: 'relative', height: 'calc(100svh - 52px)', overflow: 'hidden', scrollSnapAlign: 'start', flexShrink: 0,
        width: '100%', margin: 0, padding: 0, boxSizing: 'border-box',
        backgroundImage: `url(${airplane})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: 2 }}>SCROLL</span>
          <ChevronDown size={20} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
        </div>
      </div>

      {/* Tab section */}
      <div style={{ scrollSnapAlign: 'start', minHeight: 'calc(100svh - 52px)', background: '#ffffff' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px', paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e5e5', marginTop: 24 }}>
          <button
            onClick={() => setActiveTab('farmer')}
            style={{
              flex: 1, padding: '11px 4px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none', color: activeTab === 'farmer' ? '#003087' : '#aaa',
              borderBottom: activeTab === 'farmer' ? '3px solid #003087' : '3px solid transparent',
              marginBottom: -2, transition: 'color 0.15s, border-color 0.15s',
              lineHeight: 1.3, minHeight: 44,
            }}
          >
            🌱 農家として<br />出荷する
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            style={{
              flex: 1, padding: '11px 4px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none', color: activeTab === 'buyer' ? '#003087' : '#aaa',
              borderBottom: activeTab === 'buyer' ? '3px solid #003087' : '3px solid transparent',
              marginBottom: -2, transition: 'color 0.15s, border-color 0.15s',
              lineHeight: 1.3, minHeight: 44,
            }}
          >
            🛒 バイヤーとして<br />仕入れる
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'farmer' && (
          <div style={{ paddingTop: 24 }}>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, margin: '0 0 12px' }}>
              スカイマーク旅客便のベリースペースをリアルタイムで確認。メロン・干し芋・常陸牛などを当日予約・即日出荷できます。
            </p>
            <ul style={{ fontSize: 13, color: '#777', lineHeight: 2.2, paddingLeft: 18, margin: '0 0 28px' }}>
              <li>AIが空きスペースと料金を自動算出</li>
              <li>タクシーアプリ感覚で簡単予約</li>
              <li>最短で翌日に全国へ配送</li>
            </ul>
            <button
              onClick={() => navigate('/flights')}
              style={{
                width: '100%', minHeight: 52, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: '#003087', color: 'white', fontSize: 16, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              便を確認して予約する <ArrowRight size={17} />
            </button>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div style={{ paddingTop: 24 }}>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, margin: '0 0 12px' }}>
              茨城・福島・栃木の農家から産地直送。鮮度保証付きの農産物をリアルタイムで注文・購入できます。
            </p>
            <ul style={{ fontSize: 13, color: '#777', lineHeight: 2.2, paddingLeft: 18, margin: '0 0 28px' }}>
              <li>鮮度・産地・農家情報を詳細表示</li>
              <li>メロン・常陸牛・鮮魚など多品目</li>
              <li>まとめ買いでコスト削減</li>
            </ul>
            <button
              onClick={() => navigate('/buyer/products')}
              style={{
                width: '100%', minHeight: 52, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: '#003087', color: 'white', fontSize: 16, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              商品を見る <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  )
}
