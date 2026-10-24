import { useTranslation } from 'react-i18next'
import { useRestoreLanguage } from '../i18n/useRestoreLanguage'
import { HeroPlano } from '../components/metro/HeroPlano'
import { ProjectsBoard } from '../components/metro/ProjectsBoard'
import { Journey } from '../components/metro/Journey'
import { AboutPass } from '../components/metro/AboutPass'
import { StackMap } from '../components/metro/StackMap'
import { Terminus } from '../components/metro/Terminus'
import { Interchange } from '../components/metro/Interchange'

export function Home() {
  const { t } = useTranslation()
  useRestoreLanguage()
  const kicker = t('ix.kicker')
  return (
    <>
      <HeroPlano />
      <Interchange from="l1" to="eco" kicker={kicker} fromLabel={t('ix.plan')} toLabel={t('ix.projects')} />
      <ProjectsBoard />
      <Interchange from="eco" to="l1" kicker={kicker} fromLabel={t('ix.projects')} toLabel={t('ix.journey')} />
      <Journey />
      <AboutPass />
      <StackMap />
      <Interchange from="ink-3" to="l1" kicker={kicker} fromLabel={t('ix.stack')} toLabel={t('ix.end')} />
      <Terminus />
    </>
  )
}
