interface RichTextProps {
  html: string
  className?: string
  as?: 'p' | 'span' | 'div'
}

export function RichText({ html, className, as = 'p' }: RichTextProps) {
  const Tag = as
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
