import { cva, type VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-strong text-white hover:bg-[#5b54ea] hover:-translate-y-0.5 shadow-[0_10px_34px_-12px_rgba(99,102,241,0.75)]',
        outline:
          'border border-line-strong text-white hover:border-accent hover:bg-white/[0.04] hover:-translate-y-0.5',
        soft: 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.09] hover:text-white border border-line',
      },
      size: {
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-[15px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof button> & { children: ReactNode }

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <a className={cn(button({ variant, size }), className)} {...props}>
      {children}
    </a>
  )
}
