import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

// "Vía muerta": the line runs into a buffer stop.
export function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-x-clip px-5 pt-[var(--bar-h)] sm:px-6 lg:px-16">
      <div className="mx-auto w-full max-w-[1180px]">
        <svg viewBox="0 0 640 90" className="w-full max-w-[640px]" aria-hidden="true">
          <path d="M0 45 H540" stroke="var(--l1)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="160" cy="45" r="11" fill="var(--card)" stroke="var(--l1)" strokeWidth="5" />
          <circle cx="330" cy="45" r="11" fill="var(--card)" stroke="var(--l1)" strokeWidth="5" />
          {/* buffer stop */}
          <rect x="548" y="14" width="16" height="62" rx="3" fill="var(--ink)" />
          <path d="M564 24 L600 45 L564 66" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round" />
          <rect x="520" y="33" width="42" height="24" rx="7" fill="var(--ink)" />
        </svg>
        <p className="mt-6 font-mono text-[15px] text-ink-3">404</p>
        <h1 className="sign-type mt-2 text-[clamp(3.4rem,10vw,6rem)]">{t('nf.title')}</h1>
        <p className="mt-3 max-w-[520px] text-[19px] leading-relaxed text-ink-2">{t('nf.msg')}</p>
        <Link to="/" className="btn btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('nf.back')}
        </Link>
      </div>
    </section>
  )
}
