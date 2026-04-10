import { cn } from '@/lib/utils'

export default function CapacityBar({ percent }) {
  const free = 100 - percent

  const color =
    free > 60
      ? 'bg-emerald-500'
      : free > 30
      ? 'bg-amber-400'
      : 'bg-red-500'

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>空き {free}%</span>
        <span>{free >= 70 ? '余裕あり' : free >= 30 ? '残りわずか' : 'ほぼ満杯'}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${free}%` }}
        />
      </div>
    </div>
  )
}
