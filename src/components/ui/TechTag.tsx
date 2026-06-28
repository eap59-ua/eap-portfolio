import type { TagTone } from '../../data/projects'
import { cn } from '../../lib/utils'

const TONES: Record<TagTone, string> = {
  default: 'border-line bg-white/[0.03] text-slate-300',
  python: 'border-yellow-400/20 bg-yellow-400/10 text-yellow-200',
  react: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  node: 'border-green-400/20 bg-green-400/10 text-green-200',
  pg: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  docker: 'border-blue-400/20 bg-blue-400/10 text-blue-200',
  ts: 'border-indigo-400/20 bg-indigo-400/10 text-indigo-200',
  ml: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  cpp: 'border-pink-400/20 bg-pink-400/10 text-pink-200',
}

export function TechTag({ label, tone = 'default' }: { label: string; tone?: TagTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        TONES[tone],
      )}
    >
      {label}
    </span>
  )
}
