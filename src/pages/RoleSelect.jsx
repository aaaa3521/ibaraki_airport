import { useNavigate } from 'react-router-dom'
import { Plane, Leaf, ShoppingBag, ArrowRight } from 'lucide-react'

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#003B6F] text-white px-4 pt-10 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-[#F5A800] flex items-center justify-center shadow-lg">
            <Plane size={24} color="white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-xl font-bold leading-tight">茨城空港マルシェ</h1>
        <p className="text-blue-200 text-xs mt-1">Ibaraki Airport Fresh Market</p>
        <p className="text-blue-100 text-sm mt-3 leading-relaxed">
          空路で繋ぐ、産地直送の農産物プラットフォーム
        </p>
      </header>

      {/* Role selection */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-5">
        <p className="text-center text-slate-400 text-xs font-medium tracking-wide uppercase mb-1">
          Select your role
        </p>

        {/* 農家 */}
        <button
          onClick={() => navigate('/flights')}
          className="w-full rounded-2xl border-2 border-[#003B6F] p-5 flex items-center gap-4 hover:bg-blue-50 active:scale-[0.98] transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#003B6F] flex items-center justify-center flex-shrink-0 shadow-md">
            <Leaf size={26} color="white" strokeWidth={2} />
          </div>
          <div className="text-left flex-1">
            <div className="text-[#003B6F] font-bold text-base">農家として利用する</div>
            <div className="text-slate-500 text-xs mt-1 leading-relaxed">
              便の空きスペースを予約して<br />農産物を即日出荷
            </div>
          </div>
          <ArrowRight size={18} className="text-[#003B6F] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* バイヤー */}
        <button
          onClick={() => navigate('/buyer/products')}
          className="w-full rounded-2xl border-2 border-[#F5A800] p-5 flex items-center gap-4 hover:bg-amber-50 active:scale-[0.98] transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F5A800] flex items-center justify-center flex-shrink-0 shadow-md">
            <ShoppingBag size={26} color="white" strokeWidth={2} />
          </div>
          <div className="text-left flex-1">
            <div className="text-[#F5A800] font-bold text-base">バイヤーとして利用する</div>
            <div className="text-slate-500 text-xs mt-1 leading-relaxed">
              産地直送の農産物を<br />リアルタイムで注文・購入
            </div>
          </div>
          <ArrowRight size={18} className="text-[#F5A800] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-300 pb-8 px-4">
        茨城空港 ベリーカーゴシステム powered by Claude AI
      </div>
    </div>
  )
}
