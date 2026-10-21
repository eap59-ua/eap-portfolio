// Web-sized demo media (re-encoded ≤1.5 MB, a poster for each). EcoAlerta is a
// phone app, so its demo is a portrait crop. Shared by the board and the case studies.
export interface DemoMedia {
  src: string
  poster: string
  portrait?: boolean
  captions?: string
}

export const MEDIA: Record<string, DemoMedia> = {
  ecoalerta: { src: '/media/ecoalerta-phone.mp4', poster: '/media/ecoalerta-phone-poster.jpg', portrait: true, captions: '/media/ecoalerta-demo.es.vtt' },
  'food-donation': { src: '/media/food-donation-web.mp4', poster: '/media/food-donation-poster.webp' },
  hydrofulness: { src: '/media/hydrofulness-web.mp4', poster: '/media/hydrofulness-poster.webp' },
  easycab: { src: '/media/easycab-web.mp4', poster: '/media/easycab-poster.webp' },
}
