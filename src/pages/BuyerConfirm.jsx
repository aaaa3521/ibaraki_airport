import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Plane, Package, CheckCircle, ArrowLeft, Plus, Minus } from 'lucide-react'

function generateOrderNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `IAK-${ymd}-${rand}`
}

export default function BuyerConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [items, setItems] = useState(state?.cartItems || [])
  const [confirmed, setConfirmed] = useState(false)
  const [orderNumber] = useState(generateOrderNumber)

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter(item => item.quantity > 0)
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.pricePerBox * item.quantity, 0)

  // 注文確定後の画面
  if (confirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={44} color="#16a34a" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">注文が確定しました</h2>
        <p className="text-slate-400 text-sm mb-8">ご注文ありがとうございます</p>

        <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-xs mb-5 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">予約番号</div>
          <div className="text-xl font-mono font-bold text-[#003B6F] tracking-wider">{orderNumber}</div>
          <div className="text-xs text-slate-400 mt-2">この番号でお問い合わせください</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 w-full max-w-xs mb-8 text-left border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Plane size={15} color="#003B6F" />
            <span className="text-sm font-semibold text-[#003B6F]">配送情報</span>
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            茨城空港ベリーカーゴ便にて当日発送
          </div>
          <div className="text-xs text-slate-400 mt-1.5">
            お支払い合計: <span className="font-bold text-slate-700">¥{subtotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full max-w-xs bg-[#003B6F] text-white font-bold py-3.5 rounded-xl"
        >
          トップに戻る
        </button>
      </div>
    )
  }

  // 注文確認画面
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#003B6F] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-blue-200 p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingCart size={17} />
            <span className="font-bold text-sm">注文内容の確認</span>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto w-full space-y-4 pb-36">
        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">注文商品（{items.length}種類）</h3>
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              カートが空です
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="px-4 py-3 border-b border-slate-50 last:border-0 flex items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: item.bg }}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.farmerName}</div>
                  <div className="text-sm font-bold text-[#003B6F] mt-0.5">
                    ¥{(item.pricePerBox * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, +1)}
                    className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Plane size={15} color="#003B6F" />
            <span className="font-bold text-slate-800 text-sm">配送方法</span>
          </div>
          <div className="text-sm text-slate-600">茨城空港ベリーカーゴ便</div>
          <div className="text-xs text-slate-400 mt-0.5">水揚げ・収穫当日 → 茨城空港発 → 当日便で発送</div>
        </div>

        {/* Price summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">お支払い金額</h3>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-slate-600">
                <span className="truncate flex-1 mr-2">{item.name} × {item.quantity}箱</span>
                <span className="flex-shrink-0 font-medium">¥{(item.pricePerBox * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-slate-800">合計</span>
            <span className="text-xl font-bold text-[#003B6F]">¥{subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setConfirmed(true)}
            disabled={items.length === 0}
            className="w-full bg-[#F5A800] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
          >
            <Package size={18} />
            注文を確定する（¥{subtotal.toLocaleString()}）
          </button>
        </div>
      </div>
    </div>
  )
}
