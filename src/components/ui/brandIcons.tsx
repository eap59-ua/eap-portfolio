import type { SVGProps } from 'react'

// Brand marks for the contact cards: nominative use only (they say "this link
// goes to that service"), always decorative (aria-hidden), the visible label
// next to them carries the name.
export { GitHubIcon as GitHubMark, LinkedInIcon as LinkedInMark } from './icons'

/** Gmail "M" envelope, official four colours (+ its darker red fold) */
export function GmailMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="52 42 88 66" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      <path fill="#FBBC05" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  )
}

/** the classic Maps pin: red drop, dark-red core */
export function MapsPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 34" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        stroke="#B31412"
        strokeWidth="1"
        d="M12 .5C5.65.5.5 5.5.5 11.7c0 8.1 9.4 15.4 10.6 20.9.12.55.48.9.9.9s.78-.35.9-.9C14.1 27.1 23.5 19.8 23.5 11.7 23.5 5.5 18.35.5 12 .5Z"
      />
      <circle cx="12" cy="11.6" r="4.1" fill="#B31412" />
    </svg>
  )
}
