import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, y = 22, className }: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { transformPerspective: 1000 }}
      initial={reduce ? false : { opacity: 0, y, rotateX: 7, scale: 0.975 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
