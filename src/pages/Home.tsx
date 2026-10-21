import { HeroPlano } from '../components/metro/HeroPlano'
import { ProjectsBoard } from '../components/metro/ProjectsBoard'
import { Journey } from '../components/metro/Journey'
import { AboutPass } from '../components/metro/AboutPass'

export function Home() {
  return (
    <>
      <HeroPlano />
      <ProjectsBoard />
      <Journey />
      <AboutPass />
    </>
  )
}
