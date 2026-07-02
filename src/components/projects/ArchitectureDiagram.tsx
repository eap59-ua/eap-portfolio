import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'

export interface DiagramSpec {
  pipeline: string[]
  aside: string[]
}

export function ArchitectureDiagram({ pipeline, aside }: DiagramSpec) {
  return (
    <div data-glow className="card-surface glow-card p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {pipeline.map((node, index) => (
          <Fragment key={node}>
            <span className="rounded-lg border border-line-strong bg-ink-850 px-3 py-2 text-sm font-medium text-white shadow-card">
              {node}
            </span>
            {index < pipeline.length - 1 && (
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
            )}
          </Fragment>
        ))}
      </div>
      {aside.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
          {aside.map((item) => (
            <span
              key={item}
              className="rounded-md border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
