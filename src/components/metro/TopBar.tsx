import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Pause, Play, X, ChevronDown, Moon, Sun } from 'lucide-react'
import { setTheme, useTheme } from '../../lib/theme'
import { SECTIONS, useCurrentSection } from '../../lib/sections'
import { setMotionPaused, useMotionPaused } from '../../lib/motion'
import { MOBILE_MAP } from '../../data/network'
import { NetworkMap } from './NetworkMap'

const MENU = ['proyectos', 'trayectoria', 'sobre-mi', 'stack', 'contacto'] as const

function Logo() {
  return (
    <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full border-[3px] border-ink bg-paper px-3" aria-hidden="true">
      <i className="h-[7px] w-[7px] rounded-full bg-l1" />
      <b className="font-sign text-base font-bold tracking-[0.06em]">EAP</b>
      <i className="h-[7px] w-[7px] rounded-full bg-l1" />
    </span>
  )
}

export function LangSwitch({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  const set = (l: 'es' | 'en') => {
    void i18n.changeLanguage(l)
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* ignore */
    }
  }
  return (
    <div className={`flex overflow-hidden rounded-md border-2 border-ink font-sign text-[15px] font-bold ${className}`} role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`px-2.5 py-0.5 transition-colors ${lang === l ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-2'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

/** day ⇄ night by hand (the default follows the system) */
function ThemeButton() {
  const { t } = useTranslation()
  const theme = useTheme()
  const night = theme === 'night'
  const label = t(night ? 'bar.to_day' : 'bar.to_night')
  return (
    <button
      type="button"
      onClick={() => setTheme(night ? 'day' : 'night')}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-3 text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      {night ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
}

function PauseButton() {
  const { t } = useTranslation()
  const paused = useMotionPaused()
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      aria-label={t(paused ? 'bar.play' : 'bar.pause')}
      title={t(paused ? 'bar.play' : 'bar.pause')}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-3 text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      {paused ? <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />}
    </button>
  )
}

export function TopBar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const { current, progress } = useCurrentSection()
  const [sheet, setSheet] = useState(false)
  const now = SECTIONS.find((s) => s.id === current) ?? SECTIONS[0]
  const href = (id: string) => (home ? `#${id}` : `/#${id}`)

  // The plan sheet is a native modal <dialog>: the page behind is inert, Escape
  // closes it and the focus returns to the "Plano" button. The page doesn't scroll behind it.
  const dlg = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (sheet && !d.open) d.showModal()
    if (!sheet && d.open) d.close()
    document.documentElement.style.overflow = sheet ? 'hidden' : ''
  }, [sheet])
  // close before an in-page link runs, so the link can then move focus to its section
  const closeSheet = () => {
    dlg.current?.close()
    setSheet(false)
  }

  return (
    <>
      <a href={home ? '#proyectos' : '#main'} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        {t(home ? 'bar.skip' : 'bar.skip_main')}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_95%,transparent)] backdrop-blur-[14px]">
        <div className="flex h-[var(--bar-h)] items-center justify-between gap-6 px-5 sm:px-6 lg:px-16">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label={t('bar.home')} className="rounded-full">
              <Logo />
            </Link>
            {home && (
              <p className="hidden items-center gap-2.5 font-sign text-[15px] font-semibold uppercase tracking-[0.04em] text-ink-2 md:flex" aria-live="off">
                {t('bar.now')}
                <span className="rounded bg-ink px-2.5 py-0.5 tracking-[0.06em] text-paper">{t(now.key)}</span>
              </p>
            )}
          </div>
          <nav className="hidden items-center gap-7 lg:flex" aria-label={t('bar.menu')}>
            {MENU.map((id) => {
              const s = SECTIONS.find((x) => x.id === id)!
              const on = home && current === id
              return (
                <a
                  key={id}
                  href={href(id)}
                  aria-current={on ? 'location' : undefined}
                  className={`font-sign text-lg font-semibold transition-colors ${on ? 'text-ink shadow-[inset_0_-3px_0_var(--l1)]' : 'text-ink-2 hover:text-ink'}`}
                >
                  {t(s.key)}
                </a>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <ThemeButton />
            <span className="hidden lg:block">
              <PauseButton />
            </span>
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="inline-flex h-9 items-center gap-1 rounded-md border-2 border-ink px-2.5 font-sign text-[15px] font-bold lg:hidden"
              aria-haspopup="dialog"
            >
              {/* on the home page it doubles as the station sign: where you are, tap for the map */}
              {home && now.id !== 'inicio' ? (
                <>
                  <span className="sr-only">{t('bar.plan')}: </span>
                  {t(now.key)}
                </>
              ) : (
                t('bar.plan')
              )}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* phones: a thin line with the chapters as stops */}
        {home && (
          <div className="relative mx-5 h-3 sm:mx-6 lg:hidden" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-rule" />
            <div className="absolute inset-x-0 top-1/2 h-[3px] origin-left bg-l1" style={{ transform: `translateY(-50%) scaleX(${progress})` }} />
            <div className="absolute inset-0 flex items-center justify-between">
              {SECTIONS.map((s) => {
                const idx = SECTIONS.findIndex((x) => x.id === current)
                const done = SECTIONS.findIndex((x) => x.id === s.id) <= idx
                return <span key={s.id} className={`h-2 w-2 rounded-full border-2 ${done ? 'border-l1 bg-l1' : 'border-ink-3 bg-paper'}`} />
              })}
            </div>
          </div>
        )}
      </header>

      <dialog
        ref={dlg}
        onClose={() => setSheet(false)}
        aria-label={t('bar.plan')}
        className="plan-sheet m-0 h-[100dvh] max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-transparent lg:hidden"
      >
        {sheet && (
        <div>
          <div className="flex h-[var(--bar-h)] items-center justify-between px-5">
            <Logo />
            <button type="button" onClick={closeSheet} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink" aria-label={t('bar.close')} autoFocus>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="h-[calc(100dvh-var(--bar-h))] overflow-y-auto px-5 pb-10">
            <ul className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={href(s.id)}
                    onClick={closeSheet}
                    className={`flex h-12 items-center rounded-lg border-2 px-4 font-sign text-lg font-bold ${current === s.id ? 'border-l1 text-ink' : 'border-rule text-ink-2'}`}
                  >
                    {t(s.key)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6" onClick={(e) => (e.target as HTMLElement).closest('a') && closeSheet()}>
              <NetworkMap spec={MOBILE_MAP} />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <PauseButton />
              <span className="text-sm text-ink-2">{t('bar.pause_hint')}</span>
            </div>
          </div>
        </div>
        )}
      </dialog>
    </>
  )
}

/** desktop rail: the chapters as stations, a train marks where you are */
export function MiniPlan() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { current } = useCurrentSection()
  const idx = SECTIONS.findIndex((s) => s.id === current)
  // only the home page is the network; a case study has its own index
  if (pathname !== '/') return null
  return (
    <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center lg:flex" aria-label={t('bar.rail')}>
      {SECTIONS.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center">
          <a
            href={`#${s.id}`}
            aria-label={t(s.key)}
            aria-current={i === idx ? 'location' : undefined}
            className="group relative flex h-6 w-6 items-center justify-center rounded-full"
          >
            <span
              className={`block h-3.5 w-3.5 rounded-full border-[3px] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                i === idx ? 'border-l1 bg-l1 shadow-[0_0_0_4px_var(--paper),0_0_0_6px_var(--l1)]' : i < idx ? 'scale-[0.857] border-l1 bg-l1' : 'scale-[0.857] border-ink-3 bg-paper'
              }`}
            />
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded bg-ink px-2 py-0.5 font-sign text-sm font-semibold text-paper translate-x-1 opacity-0 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:translate-x-0">
              {t(s.key)}
            </span>
          </a>
          {i < SECTIONS.length - 1 && <span className={`h-9 w-1 ${i < idx ? 'bg-l1' : 'bg-rule'}`} />}
        </div>
      ))}
    </nav>
  )
}
