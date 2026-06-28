import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'

const LANGS = ['es', 'en'] as const

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage

  const change = (lang: string) => {
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-white/[0.03] p-1">
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => change(lang)}
          aria-pressed={current === lang}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
            current === lang ? 'bg-accent-strong text-white' : 'text-slate-400 hover:text-white',
          )}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
