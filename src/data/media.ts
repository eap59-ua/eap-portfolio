// Web-sized demo media (re-encoded, a poster for each), cropped to the app itself: no browser
// bar, taskbar or localhost. EcoAlerta is a phone app (portrait). Shared by the board and the case studies.
export interface DemoMedia {
  src: string
  poster: string
  /** intrinsic size, so the frame reserves its space before the video loads */
  w: number
  h: number
  /** seconds (ffprobe): the player shows the length before a single byte is fetched */
  dur: number
  /** false = the file has no audio track (ffprobe), so the mute button says so instead of faking a toggle */
  audio: boolean
  portrait?: boolean
  captions?: string
  /** native-resolution crop of the same clip, fetched only when the viewer opens */
  hd?: { src: string; w: number; h: number }
}

export const MEDIA: Record<string, DemoMedia> = {
  // phone viewport only (frames 0–594 of ecoalerta-demo.mp4, crop=488:1072:714:4): the rest of that recording is desktop
  ecoalerta: { src: '/media/ecoalerta-phone.mp4', poster: '/media/ecoalerta-phone-poster.jpg', w: 488, h: 1072, dur: 19.83, audio: false, portrait: true, captions: '/media/ecoalerta-demo.es.vtt' },
  'food-donation': { src: '/media/food-donation-web.mp4', poster: '/media/food-donation-web-poster.jpg', w: 1280, h: 718, dur: 22.13, audio: false, hd: { src: '/media/food-donation-hd.mp4', w: 1460, h: 820 } },
  // crop=1904:920:0:88: no browser scrollbar (x≥1912) and no "localhost:5173/…" link bubble (y≥1010)
  hydrofulness: { src: '/media/hydrofulness-web.mp4', poster: '/media/hydrofulness-web-poster.jpg', w: 1280, h: 618, dur: 28, audio: false, hd: { src: '/media/hydrofulness-hd.mp4', w: 1904, h: 920 } },
  easycab: { src: '/media/easycab-web.mp4', poster: '/media/easycab-web-poster.jpg', w: 1280, h: 512, dur: 28, audio: false, hd: { src: '/media/easycab-hd.mp4', w: 1920, h: 768 } },
}

/** extra clips shown only on the case study. EcoAlerta's recording goes on in a desktop browser
 *  (map, 2FA, admin panel) from frame 595: crop=1900:920:8:82 drops tabs, address bar, status bubble and taskbar. */
export const MEDIA_EXTRA: Record<string, { media: DemoMedia; labelKey: string }[]> = {
  ecoalerta: [
    {
      labelKey: 'player.ecoDesktop',
      media: { src: '/media/ecoalerta-desktop-web.mp4', poster: '/media/ecoalerta-desktop-web-poster.jpg', w: 1280, h: 620, dur: 75.17, audio: false, captions: '/media/ecoalerta-demo.es.vtt', hd: { src: '/media/ecoalerta-desktop-hd.mp4', w: 1900, h: 920 } },
    },
  ],
}
