import { HeroPlano } from '../components/metro/HeroPlano'
import { ProjectsBoard } from '../components/metro/ProjectsBoard'
import { Journey } from '../components/metro/Journey'
import { AboutPass } from '../components/metro/AboutPass'
import { StackMap } from '../components/metro/StackMap'

export function Home() {
  return (
    <>
      <HeroPlano />
      <ProjectsBoard />
      <Journey />
      <AboutPass />
      <StackMap />
    </>
  )
}
