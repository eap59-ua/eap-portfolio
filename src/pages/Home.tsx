import { HeroPlano } from '../components/metro/HeroPlano'
import { ProjectsBoard } from '../components/metro/ProjectsBoard'
import { Journey } from '../components/metro/Journey'
import { AboutPass } from '../components/metro/AboutPass'
import { StackMap } from '../components/metro/StackMap'
import { Terminus } from '../components/metro/Terminus'

export function Home() {
  return (
    <>
      <HeroPlano />
      <ProjectsBoard />
      <Journey />
      <AboutPass />
      <StackMap />
      <Terminus />
    </>
  )
}
