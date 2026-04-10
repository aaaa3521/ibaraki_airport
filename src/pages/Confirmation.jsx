import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, FileText, Phone, ArrowLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function Confirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pb-20 px-4">
        <p className="text-slate-500 mb-4">予約情報がありません</p>
        <button onClick={() => navigate('/flights')} className="text-[#003B6F] underline text-sm">
          便一覧に戻る
        </button>
      </div>
    )
  }

  const { flight, product, boxes, totalKg, totalPrice, bookingId } = state
  const qrValue = `IBR-CARGO:${bookingId}:${flight.id}:${product.id}:${boxes}boxes`
  const cutoffHour = String(Number(flight.departureTime.split(':')[0]) - 2).padStart(2, '0')
  const cutoffMin = flight.departureTime.split(':')[1]

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      <header className="bg-[#003B6F] text-white px-4 py-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/flights')} className="text-blue-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">予約確定</h1>
            <p className="text-xs text-blue-200 mt-0.5">Booking Confirmation</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto w-full px-4 py-4 space-y-4">

        {/* Success */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center"
        >
          <CheckCircle size={44} className="mx-auto text-emerald-500 mb-2" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-emerald-700">予約が確定しました</h2>
          <p className="text-sm text-emerald-600 mt-1">
            予約番号: <span className="font-mono font-bold tracking-wider">{bookingId}</span>
          </p>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center"
        >
          <QRCodeSVG value={qrValue} size={180} fgColor="#003B6F" level="M" includeMargin />
          <p className="text-xs text-slate-400 mt-3">空港カーゴ受付でこの QR コードを提示</p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
        >
          <h3 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100">予約内容</h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-50">
              {[
                ['フライト', `${flight.id}  茨城 → ${flight.arrivalCity}`],
                ['出発 / 到着', `${flight.departureTime} / ${flight.arrivalTime}`],
                ['品目', product.name],
                ['数量', `${boxes}箱（${totalKg}kg）`],
                ['料金', `¥${totalPrice.toLocaleString()}`],
                ['ステータス', '受付完了'],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-2 text-slate-400 text-xs w-28">{label}</td>
                  <td className="py-2 font-medium text-slate-800 text-sm">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#003B6F] text-white rounded-xl p-4 space-y-3"
        >
          <h3 className="text-sm font-bold">次のステップ</h3>
          {[
            { Icon: Package,  text: `${cutoffHour}:${cutoffMin}までに空港カーゴ受付へ持込み` },
            { Icon: FileText, text: 'この画面（QRコード）を係員に提示' },
            { Icon: Phone,    text: '問い合わせ: 茨城空港カーゴ窓口 0299-XX-XXXX' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm">
              <Icon size={16} className="text-[#F5A800] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        <button
          onClick={() => navigate('/flights')}
          className="w-full border-2 border-[#003B6F] text-[#003B6F] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> 便一覧に戻る
        </button>
      </div>
    </div>
  )
}
