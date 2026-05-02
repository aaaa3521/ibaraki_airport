import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

const FLIGHTS = [
  { id: 'SKY201', dest: '神戸', dep: '07:40', arr: '09:20', utilization: 23, weight: 50,  revenue: 50000 },
  { id: 'SKY203', dest: '那覇', dep: '10:15', arr: '13:05', utilization: 34, weight: 84,  revenue: 84000 },
  { id: 'SKY205', dest: '福岡', dep: '14:30', arr: '16:15', utilization: 16, weight: 92,  revenue: 92000 },
  { id: 'SKY207', dest: '神戸', dep: '18:20', arr: '19:55', utilization: 39, weight: 58,  revenue: 58000 },
]

const TOTAL_REVENUE  = 284000
const TRUCK_COST     = 150000
const NET_PROFIT     = TOTAL_REVENUE - TRUCK_COST  // 134000

const card = {
  background: '#FFFFFF',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: '14px 12px',
}

const label = {
  fontSize: 11,
  color: '#6B7280',
  fontWeight: 600,
  marginBottom: 4,
  whiteSpace: 'nowrap',
}

const value = {
  fontSize: 22,
  fontWeight: 800,
  color: '#1E3A5F',
  letterSpacing: -0.5,
  lineHeight: 1.1,
}

export default function SkymarkDashboard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ minHeight: '100svh', background: '#F9FAFB', fontFamily: '"Noto Sans JP", sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#1E3A5F', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
          <ArrowLeft size={20} color="rgba(255,255,255,0.7)" strokeWidth={2} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>貨物スペース収益ダッシュボード</span>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 40px' }}>

        {/* ── KPI 3カード ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          style={{ marginBottom: 8 }}
        >
          <div style={{ display: 'flex', gap: 8 }}>

            {/* カード1：空き容量 */}
            <div style={{ ...card, flex: '1 1 0', minWidth: 0 }}>
              <p style={label}>本日の空き容量</p>
              <p style={{ ...value, fontSize: 18 }}>115.5㎥</p>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>40,730kg</p>
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  marginTop: 8, display: 'flex', alignItems: 'center', gap: 3,
                  background: 'none', border: '1px solid #D1D5DB', borderRadius: 6,
                  padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  color: '#374151', width: '100%', justifyContent: 'center',
                }}
              >
                内訳を見る {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            {/* カード2：活用率 */}
            <div style={{ ...card, flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <p style={label}>スペース活用率</p>
              <p style={value}>23%</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>4便平均</p>
            </div>

            {/* カード3：累計収益 */}
            <div style={{ ...card, flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <p style={label}>本日の累計収益</p>
              <p style={{ ...value, fontSize: 18 }}>¥{(TOTAL_REVENUE / 10000).toFixed(0)}万</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>¥{TOTAL_REVENUE.toLocaleString()}</p>
            </div>
          </div>

          {/* アコーディオン */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="accordion"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        {['便名・区間', '活用率', '搭載', '収益'].map(h => (
                          <th key={h} style={{ padding: '7px 10px', textAlign: h === '活用率' || h === '搭載' || h === '収益' ? 'right' : 'left', fontWeight: 600, color: '#6B7280', fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FLIGHTS.map((f, i) => (
                        <motion.tr
                          key={f.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          style={{ borderBottom: i < FLIGHTS.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                        >
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E3A5F', fontSize: 11 }}>{f.id}</span>
                            <span style={{ color: '#6B7280', marginLeft: 4 }}>{f.dest} {f.dep}→{f.arr}</span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#374151' }}>{f.utilization}%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#374151' }}>{f.weight}kg</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#1E3A5F' }}>¥{f.revenue.toLocaleString()}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── 収支サマリー ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.25 }}
          style={{ ...card, marginBottom: 8 }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>収支サマリー</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="輸送売上" value={`¥${TOTAL_REVENUE.toLocaleString()}`} />
            <Row label="トラック集荷コスト" value={`-¥${TRUCK_COST.toLocaleString()}`} sub="国土交通省標準運賃に基づく試算" valueColor="#DC2626" />
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <Row
                label="純利益"
                value={`¥${NET_PROFIT.toLocaleString()}`}
                valueColor="#16A34A"
                bold
              />
            </div>
          </div>
        </motion.div>

        {/* ── 比較バッジ ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.25 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 999, padding: '8px 16px' }}>
            <TrendingUp size={14} color="#16A34A" strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#16A34A' }}>
              ベリーカーゴなし想定との比較：+¥{TOTAL_REVENUE.toLocaleString()} 増加
            </span>
          </div>
        </motion.div>

        {/* ── フッター注釈 ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>※ 数値は試算ベースです</p>
          <p style={{ fontSize: 11, color: '#9CA3AF' }}>※ トラックコストは国土交通省標準運賃に基づく試算です</p>
        </motion.div>

      </div>
    </div>
  )
}

function Row({ label: lbl, value: val, sub, valueColor = '#111827', bold = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div>
        <span style={{ fontSize: 13, color: '#6B7280' }}>{lbl}</span>
        {sub && <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{sub}</p>}
      </div>
      <span style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: valueColor, whiteSpace: 'nowrap' }}>{val}</span>
    </div>
  )
}
