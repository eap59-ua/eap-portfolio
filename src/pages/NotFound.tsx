import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="gradient-text font-mono text-7xl font-black">404</p>
      <p className="mt-4 text-lg text-slate-400">Esta página no existe.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>
    </section>
  )
}
