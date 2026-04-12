import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Plus, Check, ArrowLeft, Plane, Truck } from 'lucide-react'
import { BUYER_PRODUCTS } from '@/data/buyerProducts'

const PREF_FILTERS = ['すべて', '茨城', '福島', '栃木']
const CAT_FILTERS = ['すべて', '果物', '野菜・加工品', '肉類', '鮮魚']

function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24">
            {i <= full ? (
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill="#FF9900" stroke="#FF9900" strokeWidth="1"
              />
            ) : i === full + 1 && half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="#FF9900" />
                    <stop offset="50%" stopColor="#e0e0e0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill={`url(#half-${i})`} stroke="#FF9900" strokeWidth="1"
                />
              </>
            ) : (
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill="#e0e0e0" stroke="#e0e0e0" strokeWidth="1"
              />
            )}
          </svg>
        ))}
      </div>
      <span style={{ color: '#007185', fontSize: 12 }}>{rating}</span>
      <span style={{ color: '#007185', fontSize: 12 }}>({reviewCount}件)</span>
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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#003B6F', color: 'white', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#90caf9', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            <ArrowLeft size={15} /> 戻る
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <Plane size={14} color="#FF9900" />
              茨城空港マルシェ
            </div>
            <div style={{ fontSize: 11, color: '#90caf9' }}>産地直送マーケット</div>
          </div>
          <button
            onClick={() => cartCount > 0 && navigate('/buyer/confirm', { state: { cartItems } })}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <ShoppingCart size={24} color="white" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#FF9900', color: 'white', fontSize: 11, fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div style={{ background: '#FF9900', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 56, zIndex: 20 }}>
          <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
            {cartCount}点 · ¥{cartTotal.toLocaleString()}
          </span>
          <button
            onClick={() => navigate('/buyer/confirm', { state: { cartItems } })}
            style={{ background: 'white', color: '#FF9900', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer' }}
          >
            カートを見る →
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#f3f3f3', borderBottom: '1px solid #e0e0e0', padding: '10px 16px', position: 'sticky', zIndex: 10, top: cartCount > 0 ? 96 : 56 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {PREF_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPrefFilter(f)}
                style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 3, whiteSpace: 'nowrap', cursor: 'pointer',
                  border: prefFilter === f ? '2px solid #FF9900' : '1px solid #ccc',
                  background: prefFilter === f ? '#fff8ee' : 'white',
                  color: prefFilter === f ? '#c45500' : '#333',
                  fontWeight: prefFilter === f ? 700 : 400,
                }}
              >{f}</button>
            ))}
          </div>
          <div style={{ width: 1, background: '#ccc', flexShrink: 0, margin: '2px 4px' }} />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {CAT_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setCatFilter(f)}
                style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 3, whiteSpace: 'nowrap', cursor: 'pointer',
                  border: catFilter === f ? '2px solid #FF9900' : '1px solid #ccc',
                  background: catFilter === f ? '#fff8ee' : 'white',
                  color: catFilter === f ? '#c45500' : '#333',
                  fontWeight: catFilter === f ? 700 : 400,
                }}
              >{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '10px 16px 4px', fontSize: 13, color: '#555' }}>
        {filtered.length}件の結果
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 12px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filtered.map(product => {
            const inCart = cart[product.id] || 0
            const isAdded = addedId === product.id
            const isLowStock = product.stock <= 15

            return (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Product image */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  />
                  {product.tags.includes('人気No.1') && (
                    <span style={{
                      position: 'absolute', top: 8, left: 8,
                      background: '#FF9900', color: 'white', fontSize: 11, fontWeight: 700,
                      padding: '2px 7px', borderRadius: 2,
                    }}>
                      人気No.1
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ fontSize: 11, color: '#555' }}>{product.farmerName} · {product.origin}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f1111', lineHeight: 1.4 }}>{product.name}</div>

                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                  {/* Price */}
                  <div style={{ marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: '#555', verticalAlign: 'top', lineHeight: '22px' }}>¥</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#B12704', letterSpacing: -0.5 }}>
                      {product.pricePerBox.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>{product.unit}</span>
                  </div>

                  {/* Delivery badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Truck size={12} color="#007600" />
                    <span style={{ fontSize: 12, color: '#007600', fontWeight: 600 }}>{product.deliveryLabel}</span>
                  </div>

                  {/* Low stock */}
                  {isLowStock && (
                    <div style={{ fontSize: 12, color: '#B12704', fontWeight: 600 }}>
                      残りわずか（{product.stock}箱）
                    </div>
                  )}
                </div>

                {/* Cart button */}
                <div style={{ padding: '0 12px 12px' }}>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      width: '100%', padding: '8px 0', borderRadius: 20, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 700,
                      background: isAdded ? '#21a66e' : '#FF9900',
                      color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'background 0.2s',
                    }}
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
