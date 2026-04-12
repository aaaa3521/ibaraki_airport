import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Plus, Check, ArrowLeft, Plane } from 'lucide-react'
import { BUYER_PRODUCTS } from '@/data/buyerProducts'

const PREF_FILTERS = ['すべて', '茨城', '福島', '栃木']
const CAT_FILTERS = ['すべて', '果物', '野菜・加工品', '肉類', '鮮魚']

function FreshnessBar({ level }) {
  const color = level >= 90 ? '#16a34a' : level >= 70 ? '#d97706' : '#dc2626'
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-slate-400">鮮度</span>
        <span className="font-semibold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${level}%`, background: color }} />
      </div>
    </div>
  )
}

function StarRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={10}
            fill={i <= Math.round(rating) ? '#F5A800' : 'none'}
            color="#F5A800"
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">{rating} ({reviewCount})</span>
    </div>
  )
}

export default function BuyerProducts() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [prefFilter, setPrefFilter] = useState('すべて')
  const [catFilter, setCatFilter] = useState('すべて')
  const [addedId, setAddedId] = useState(null)

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = BUYER_PRODUCTS.find(p => p.id === Number(id))
    return sum + (p ? p.pricePerBox * qty : 0)
  }, 0)

  const filtered = BUYER_PRODUCTS.filter(p => {
    if (prefFilter !== 'すべて' && p.prefecture !== prefFilter) return false
    if (catFilter !== 'すべて' && p.categoryLabel !== catFilter) return false
    return true
  })

  const addToCart = (product) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      ...BUYER_PRODUCTS.find(p => p.id === Number(id)),
      quantity: qty,
    }))

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#003B6F] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-blue-200 text-sm py-1"
          >
            <ArrowLeft size={16} /> 戻る
          </button>
          <div className="text-center">
            <div className="font-bold text-sm flex items-center gap-1.5 justify-center">
              <Plane size={14} color="#F5A800" />
              茨城空港マルシェ
            </div>
            <div className="text-xs text-blue-200">産地直送マーケット</div>
          </div>
          <button
            onClick={() => cartCount > 0 && navigate('/buyer/confirm', { state: { cartItems } })}
            className="relative p-1"
          >
            <ShoppingCart size={22} color="white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F5A800] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div className="bg-[#F5A800] px-4 py-2.5 flex items-center justify-between sticky top-[56px] z-20">
          <span className="text-white text-sm font-medium">
            {cartCount}点 · ¥{cartTotal.toLocaleString()}
          </span>
          <button
            onClick={() => navigate('/buyer/confirm', { state: { cartItems } })}
            className="bg-white text-[#F5A800] text-xs font-bold px-4 py-1.5 rounded-full"
          >
            カートを見る →
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 sticky z-10" style={{ top: cartCount > 0 ? 96 : 56 }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-1.5 flex-shrink-0">
            {PREF_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPrefFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                  prefFilter === f
                    ? 'bg-[#003B6F] text-white border-[#003B6F]'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >{f}</button>
            ))}
          </div>
          <div className="w-px bg-slate-200 flex-shrink-0 my-0.5" />
          <div className="flex gap-1.5 flex-shrink-0">
            {CAT_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setCatFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                  catFilter === f
                    ? 'bg-[#F5A800] text-white border-[#F5A800]'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pt-3 pb-1 text-xs text-slate-400 max-w-lg mx-auto w-full">
        {filtered.length}件の商品
      </div>

      {/* Product grid */}
      <div className="px-3 pb-10 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(product => {
            const inCart = cart[product.id] || 0
            const isAdded = addedId === product.id
            const isLowStock = product.stock <= 15

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
              >
                {/* Image area */}
                <div
                  className="flex items-center justify-center py-5 relative"
                  style={{ background: product.bg }}
                >
                  <span className="text-5xl">{product.emoji}</span>
                  {product.tags.includes('人気No.1') && (
                    <span className="absolute top-2 left-2 bg-[#F5A800] text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                      人気No.1
                    </span>
                  )}
                  {isLowStock && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                      残りわずか
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="px-3 pt-2 pb-1 flex-1 flex flex-col gap-1.5">
                  <div className="text-xs text-slate-400">{product.farmerName} · {product.origin}</div>
                  <div className="text-sm font-bold text-slate-800 leading-tight">{product.name}</div>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                  <FreshnessBar level={product.freshnessLevel} />
                  <div className="text-xs text-slate-400">消費期限 {product.freshnessDays}日以内</div>

                  <div className="mt-0.5">
                    <span className="text-base font-bold text-slate-900">
                      ¥{product.pricePerBox.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">{product.unit}</span>
                  </div>
                  <div className="text-xs text-slate-400">在庫 {product.stock}箱</div>
                </div>

                {/* Cart button */}
                <div className="px-3 pb-3 pt-1">
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#F5A800] hover:bg-[#e09900] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <><Check size={13} /> 追加しました</>
                    ) : (
                      <><Plus size={13} /> カートに追加{inCart > 0 && ` (${inCart})`}</>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
