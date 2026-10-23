import { Fragment } from 'react'

// "A · B · C" that wraps between segments, never inside one, and never leaves a
// lonely "·" at the end of a line: each separator travels with the next segment.
export function Segments({ text, sep = ' · ' }: { text: string; sep?: string }) {
  const parts = text.split(sep)
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="whitespace-nowrap">
            {i > 0 && <span aria-hidden="true">· </span>}
            {p}
          </span>
        </Fragment>
      ))}
    </>
  )
}
