import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { SITE } from '../../lib/site'

// Outside <main> (its own contentinfo landmark), on every page.
export function SiteFooter() {
  const { t } = useTranslation()
  const home = useLocation().pathname === '/'
  const link = 'inline-flex items-center gap-1.5 py-1 hover:text-ink'
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-6 font-mono text-[12.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-16">
        <p>
          © {new Date().getFullYear()} {SITE.name} · {t('footer.end')}
        </p>
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className={`${link} underline-offset-4 hover:underline`}>
          {t('footer.built')}
        </a>
        {home ? (
          <a href="#inicio" className={link}>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            {t('footer.top')}
          </a>
        ) : (
          <Link to="/" className={link}>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            {t('footer.top')}
          </Link>
        )}
      </div>
    </footer>
  )
}
