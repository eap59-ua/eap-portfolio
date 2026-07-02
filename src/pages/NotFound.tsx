import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

export function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-grid-dark bg-grid [mask-image:radial-gradient(ellipse_55%_50%_at_50%_45%,#000_50%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_55%_50%_at_50%_45%,#000_50%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-accent-strong/15 blur-[130px]" />
      </div>

      <p className="gradient-text font-mono text-7xl font-black">404</p>
      <p className="mt-4 text-lg text-slate-400">{t('nf.msg')}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nf.back')}
      </Link>
    </section>
  )
}
