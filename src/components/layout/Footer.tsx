import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { SITE } from '../../lib/site'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line py-10">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <a href="#home" className="gradient-text font-mono text-lg font-bold">
            &lt;EAP/&gt;
          </a>
          <p className="mt-1 text-sm text-slate-500">
            © {year} {SITE.name}
          </p>
        </div>

        <p className="order-last text-center font-mono text-xs text-slate-500 md:order-none">
          {t('footer.built')}
        </p>

        <div className="flex items-center gap-3">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-slate-300 transition-colors hover:border-accent hover:text-white"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-slate-300 transition-colors hover:border-accent hover:text-white"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
          <a
            href="#home"
            aria-label={t('footer.back')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-slate-300 transition-colors hover:border-accent hover:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
