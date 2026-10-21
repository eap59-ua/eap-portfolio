// Web-sized demo media (re-encoded ≤1.5 MB, a poster for each), cropped to the app
// itself: no browser bar, taskbar or localhost. EcoAlerta is a phone app (portrait). Shared by the board and the case studies.
export interface DemoMedia {
  src: string
  poster: string
  /** intrinsic size, so the frame reserves its space before the video loads */
  w: number
  h: number
  portrait?: boolean
  captions?: string
}

export const MEDIA: Record<string, DemoMedia> = {
  ecoalerta: { src: '/media/ecoalerta-phone.mp4', poster: '/media/ecoalerta-phone-poster.jpg', w: 516, h: 1080, portrait: true, captions: '/media/ecoalerta-demo.es.vtt' },
  'food-donation': { src: '/media/food-donation-web.mp4', poster: '/media/food-donation-web-poster.jpg', w: 1280, h: 718 },
  hydrofulness: { src: '/media/hydrofulness-web.mp4', poster: '/media/hydrofulness-web-poster.jpg', w: 1280, h: 626 },
  easycab: { src: '/media/easycab-web.mp4', poster: '/media/easycab-web-poster.jpg', w: 1280, h: 512 },
}
