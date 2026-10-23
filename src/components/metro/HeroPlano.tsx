import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowRight, Download, MapPin } from 'lucide-react'
import { RichText } from '../ui/RichText'
import { Segments } from '../ui/Segments'
import { GitHubIcon } from '../ui/icons'
import { ScrambleText } from '../motion/ScrambleText'
import { Magnetic } from '../motion/Magnetic'
import { NetworkMap } from './NetworkMap'
import { DESKTOP_MAP, MOBILE_MAP } from '../../data/network'
import { SITE } from '../../lib/site'

const CV = { es: '/Erardo-Aldana-Pessoa-CV-ES.pdf', en: '/Erardo-Aldana-Pessoa-CV-EN.pdf' }
// "Full-Stack" must never break at its hyphen
const nb = (s: string) => s.replace(/Full-Stack/g, 'Full‑Stack')

const LEGEND = [
  ['1', 'l1', 'line.l1'],
  ['2', 'eco', 'EcoAlerta'],
  ['3', 'donation', 'line.donation'],
  ['4', 'hydro', 'Hydrofulness'],
  ['5', 'studysync', 'StudySync'],
  ['6', 'easycab', 'EasyCab'],
  ['7', 'chaos', 'Chaos Crew'],
  ['C', 'cer', 'line.cer'],
] as const

export function HeroPlano() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'

  return (
    <section id="inicio" className="relative pt-[calc(var(--bar-h)+12px)] lg:pt-[var(--bar-h)]">
      <div className="mx-auto grid max-w-[1440px] gap-x-4 px-5 sm:px-6 lg:min-h-[calc(100svh-var(--bar-h))] lg:grid-cols-[minmax(360px,480px)_minmax(0,800px)] lg:px-16">
        <div className="pt-6 lg:pt-14">
          <p className="font-mono text-[13px] tracking-[0.08em] text-l1 sm:text-sm">
            <ScrambleText text={t('hero.tag')} duration={900} />
            <span className="ml-0.5 inline-block animate-blink loop-anim" aria-hidden="true">
              _
            </span>
          </p>
          <h1 className="sign-type mt-4 text-[clamp(3.4rem,13vw,5.9rem)] text-ink lg:mt-5 lg:text-[clamp(4rem,6.1vw,5.6rem)]">
            <span className="block">Erardo</span>{' '}
            <span className="block whitespace-nowrap">Aldana Pessoa</span>
          </h1>
          <p className="mt-4 text-[19px] font-semibold leading-snug text-ink sm:text-2xl lg:mt-6">{nb(t('hero.role'))}</p>
          {/* the metro "service status" board: where he is and that he's available, in 3 seconds */}
          <div className="relative mt-4 block w-full overflow-hidden rounded-xl border border-rule bg-paper-card py-3 pl-5 pr-4 sm:w-fit sm:max-w-[470px] lg:mt-5">
            {/* the L1 stripe: an information sign on the platform */}
            <span className="absolute inset-y-0 left-0 w-1 bg-l1" aria-hidden="true" />
            <p className="sign-label text-[12px] text-ink-3">{t('status.label')}</p>
            <p className="mt-1 inline-flex items-center gap-2 text-[16.5px] font-semibold leading-snug text-eco">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0" aria-hidden="true">
                <span className="loop-anim absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-eco" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-eco" />
              </span>
              <span>
                <Segments text={t('status.state')} />
              </span>
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[14px] leading-snug text-ink-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-ink-3" aria-hidden="true" />
              <span className="whitespace-nowrap">{t('status.where')}</span>
              <span className="whitespace-nowrap">
                <span className="text-ink-3" aria-hidden="true">
                  ·{' '}
                </span>
                {t('status.move')}
              </span>
            </p>
          </div>
          <RichText html={t('hero.pitch')} className="mt-4 max-w-[470px] text-pretty text-base leading-relaxed text-ink-2 sm:text-lg lg:mt-4" />
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
            <Magnetic className="w-full sm:w-auto">
              <a href="#proyectos" className="btn btn-primary w-full sm:w-auto" data-cursor="link">
                {t('hero.cta1')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic className="flex-1 sm:flex-none">
              <a href={CV[lang]} download className="btn btn-ghost w-full sm:w-auto" data-cursor="link">
                <Download className="h-4 w-4" aria-hidden="true" />
                {t('hero.cv')}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-12 border-2 border-ink-3 px-0 text-ink hover:border-ink"
                aria-label="GitHub"
                data-cursor="link"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:pt-6">
          {/* phones get a map designed for them, not a shrunk desktop one */}
          <div className="sm:hidden">
            <NetworkMap spec={MOBILE_MAP} />
          </div>
          <div className="hidden sm:block">
            <NetworkMap spec={DESKTOP_MAP} />
            <ul className="ml-[3.75%] mt-1 flex flex-wrap gap-x-[18px] gap-y-2 font-sign text-[15px] font-semibold text-ink-2" aria-label={t('line.legend')}>
              {LEGEND.map(([n, c, label]) => (
                <li key={n} className="inline-flex items-center gap-1.5">
                  <span className="line-badge h-[22px] min-w-[22px] text-[13px]" style={{ ['--lc' as string]: `var(--${c})` }} data-dark={c === 'easycab' || c === 'chaos' ? '' : undefined}>
                    {n}
                  </span>
                  {label.startsWith('line.') ? t(label) : label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <a href="#proyectos" className="mx-auto mt-10 hidden max-w-[1440px] items-center gap-3 px-16 pb-10 font-sign text-base tracking-[0.03em] text-ink-2 lg:flex">
        <span className="h-1 w-11 rounded bg-l1" aria-hidden="true" />
        {t('hero.next')} · <b className="text-ink">{t('st.projects')}</b>
        <ArrowDown className="h-4 w-4 text-l1" aria-hidden="true" />
      </a>
    </section>
  )
}
