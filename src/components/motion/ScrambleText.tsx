import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}=+*^?#·:;01'

interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
}

export function ScrambleText({ text, className, duration = 1100 }: ScrambleTextProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(text)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduce) {
      setDisplay(text)
      return
    }
    const locks = Array.from(text, () => 0.1 + Math.random() * 0.78)
    let startTs = 0

    const frame = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ') {
          out += ' '
          continue
        }
        out += progress >= locks[i] ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setDisplay(out)
      if (progress < 1) rafRef.current = requestAnimationFrame(frame)
      else setDisplay(text)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text, reduce, duration])

  return <span className={className}>{display}</span>
}
