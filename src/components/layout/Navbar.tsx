import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { NAV } from '../../data/navigation'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '../../lib/utils'

export function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: highlight the nav link of the section currently in view
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((section) => io.observe(section))
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'glass border-b border-line' : 'border-b border-transparent',
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <a href="#home" className="gradient-text font-mono text-lg font-bold">
          &lt;EAP/&gt;
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn('nav-link text-sm', active === item.id ? 'nav-link-active text-white' : 'text-slate-300')}
            >
              {t(item.key)}
            </a>
          ))}
          <LanguageToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="text-slate-200"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-line md:hidden">
          <div className="container flex flex-col py-3">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
