import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Rocket, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { RichText } from '../ui/RichText'
import { GitHubIcon } from '../ui/icons'
import { SITE } from '../../lib/site'

const CV_URL = '/Erardo-Aldana-Pessoa-CV-EN.pdf'

const STATS = [
  { value: '10/10', key: 'stats.tfg' },
  { value: '1.5+', key: 'stats.exp' },
  { value: '2', key: 'stats.clients' },
  { value: '5', key: 'stats.projects' },
]

const EASE = [0.22, 1, 0.36, 1] as const
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}

export function Hero() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-grid-dark bg-grid [mask-image:radial-gradient(ellipse_60%_55%_at_50%_28%,#000_55%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_60%_55%_at_50%_28%,#000_55%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-accent-strong/20 blur-[150px]" />
        <div
          className="absolute right-[6%] top-1/4 h-80 w-80 rounded-full bg-accent-violet/20 blur-[130px] animate-float"
          style={{ animationDelay: '1.6s' }}
        />
      </div>

      <motion.div
        className="container flex max-w-4xl flex-col items-center text-center"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? false : 'show'}
      >
        <motion.p variants={item} className="mb-6 font-mono text-sm tracking-[0.12em] text-accent">
          {t('hero.tag')}
          <span className="ml-0.5 inline-block animate-blink text-accent-violet">_</span>
        </motion.p>

        <motion.h1
          variants={item}
          className="text-balance text-5xl font-black leading-[1.05] tracking-tightest sm:text-6xl md:text-7xl"
        >
          <span className="gradient-text animate-gradient-pan">{SITE.name}</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 text-lg font-medium text-slate-200 sm:text-xl">
          {t('hero.role')}
        </motion.p>
        <motion.p variants={item} className="mt-2.5 font-mono text-sm text-slate-400">
          {t('hero.subheadline')}
        </motion.p>

        <motion.div variants={item} className="mt-6 max-w-2xl">
          <RichText html={t('hero.pitch')} className="text-pretty text-base leading-relaxed text-slate-400 sm:text-lg" />
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="#projects" variant="primary" size="lg">
            <Rocket className="h-4 w-4" />
            {t('hero.cta1')}
          </Button>
          <Button href={CV_URL} download="Erardo-Aldana-Pessoa-CV.pdf" variant="outline" size="lg">
            <Download className="h-4 w-4" />
            {t('hero.cv')}
          </Button>
          <Button href={SITE.github} target="_blank" rel="noopener noreferrer" variant="soft" size="lg">
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </Button>
        </motion.div>

        <motion.div variants={item} className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.key} className="card-surface card-hover px-4 py-5">
              <div className="gradient-text text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-400">{t(stat.key)}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
