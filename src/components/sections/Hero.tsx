import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Rocket, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { RichText } from '../ui/RichText'
import { GitHubIcon } from '../ui/icons'
import { ParticleField } from '../motion/ParticleField'
import { ScrambleText } from '../motion/ScrambleText'
import { Magnetic } from '../motion/Magnetic'
import { Canvas3DBoundary } from '../motion/Canvas3DBoundary'
import { SITE } from '../../lib/site'

const HeroParticles3D = lazy(() =>
  import('../motion/HeroParticles3D').then((m) => ({ default: m.HeroParticles3D })),
)

const CV_URL = '/Erardo-Aldana-Pessoa-CV-EN.pdf'

const STATS = [
  { value: '10/10', key: 'stats.tfg' },
  { value: '1.5+', key: 'stats.exp' },
  { value: '2', key: 'stats.clients' },
  { value: '5', key: 'stats.projects' },
]

const EASE = [0.22, 1, 0.36, 1] as const
const container = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
}

export function Hero() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const [finePointer, setFinePointer] = useState(false)
  useEffect(() => {
    setFinePointer(!window.matchMedia('(pointer: coarse)').matches)
  }, [])
  const enable3D = !reduce && finePointer

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-grid-dark bg-grid [mask-image:radial-gradient(ellipse_60%_55%_at_50%_28%,#000_55%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_60%_55%_at_50%_28%,#000_55%,transparent_100%)]"
      />
      {enable3D ? (
        <Canvas3DBoundary fallback={<ParticleField className="absolute inset-0 -z-10 h-full w-full" />}>
          <Suspense fallback={null}>
            <HeroParticles3D />
          </Suspense>
        </Canvas3DBoundary>
      ) : (
        <ParticleField className="absolute inset-0 -z-10 h-full w-full" />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-accent-strong/18 blur-[150px]" />
      </div>

      <motion.div
        className="container flex max-w-4xl flex-col items-center text-center"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? false : 'show'}
      >
        <motion.p variants={item} className="mb-6 font-mono text-sm tracking-[0.12em] text-accent">
          <ScrambleText text={t('hero.tag')} duration={2000} />
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
          <Magnetic>
            <Button href="#projects" variant="primary" size="lg">
              <Rocket className="h-4 w-4" />
              {t('hero.cta1')}
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={CV_URL} download="Erardo-Aldana-Pessoa-CV.pdf" variant="outline" size="lg">
              <Download className="h-4 w-4" />
              {t('hero.cv')}
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={SITE.github} target="_blank" rel="noopener noreferrer" variant="soft" size="lg">
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div variants={item} className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.key} data-glow className="card-surface card-hover glow-card px-4 py-5">
              <div className="gradient-text text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-400">{t(stat.key)}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
