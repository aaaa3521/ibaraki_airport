import { useNavigate, useLocation } from 'react-router-dom'
import { Plane, Map, Package, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { path: '/flights', Icon: Plane,        label: '便一覧' },
  { path: '/map',     Icon: Map,          label: 'マップ' },
  { path: '/booking', Icon: Package,      label: '予約'   },
  { path: '/confirm', Icon: CheckCircle,  label: '確定'   },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200">
      <div className="flex max-w-lg mx-auto">
        {TABS.map(({ path, Icon, label }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'relative flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                active ? 'text-[#003B6F]' : 'text-slate-400 hover:text-slate-500'
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#003B6F] rounded-b-full" />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
