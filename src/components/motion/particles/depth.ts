// Depth for the night network: the planes it is drawn on, from the farthest to
// the nearest, and how far each one drifts with the scroll and the mouse.
// Pure (no DOM) so the numbers can be unit-tested.

export type Depth = {
  name: 'far' | 'mid' | 'near'
  /** grid, bends, stations and strokes are scaled by this */
  scale: number
  /** share of the line colour mixed into the night paper: distance haze */
  haze: number
  /** opacity multiplier for everything on the plane */
  alpha: number
  /** pre-rendered blur, CSS px (0: in focus) */
  blur: number
  /** backing-store resolution cap: blurred planes don't need retina pixels */
  res: number
  /** scroll parallax: px of drift per px scrolled, inside the parallax range */
  scrollK: number
  /** scroll momentum: the most a fast scroll can push the plane, px */
  surge: number
  /** mouse parallax: the most the plane moves away from the cursor, px */
  sway: number
  /** train speed multiplier (far trains look slower) */
  speed: number
  /** brightness of the trains and their glow (far trains are dimmer) */
  lights: number
}

export const FAR: Depth = { name: 'far', scale: 0.42, haze: 0.5, alpha: 1.15, blur: 2.2, res: 1, scrollK: 0.03, surge: 3, sway: 4, speed: 0.55, lights: 0.4 }
export const MID: Depth = { name: 'mid', scale: 0.66, haze: 0.28, alpha: 1, blur: 1, res: 1, scrollK: 0.06, surge: 6, sway: 8, speed: 0.75, lights: 0.62 }
export const NEAR: Depth = { name: 'near', scale: 1, haze: 0, alpha: 1, blur: 0, res: 2, scrollK: 0.11, surge: 10, sway: 14, speed: 1, lights: 1 }

/** back to front; phones get two planes (the cheapest depth that still reads) */
export const planesFor = (lite: boolean): Depth[] => (lite ? [FAR, NEAR] : [FAR, MID, NEAR])

/** the scroll parallax plays over the first screens (the hero and what follows) */
export const parallaxRange = (h: number) => h * 1.5

/** how far past the viewport a plane must extend so no drift ever shows its edge */
export function planeMargins(d: Depth, h: number, mouse: boolean) {
  const sway = mouse ? d.sway : 0
  const pad = 2
  // whole CSS px, so a plane's backing store maps 1:1 and the near one stays crisp
  return {
    x: Math.ceil(sway + pad),
    top: Math.ceil(sway + d.surge + pad),
    bottom: Math.ceil(d.scrollK * parallaxRange(h) + d.surge + sway + pad),
  }
}

/**
 * A plane's offset (CSS px). `mx`, `my` are the smoothed cursor in [-1, 1]
 * (0 = centred or no mouse); `follow` is the smoothed scroll position and
 * `scrollY` the real one, so `scrollY - follow` is the scroll momentum.
 */
export function planeOffset(d: Depth, h: number, mx: number, my: number, follow: number, scrollY: number) {
  const pos = d.scrollK * Math.min(Math.max(follow, 0), parallaxRange(h))
  const surge = d.surge * Math.tanh((scrollY - follow) / 400)
  return { dx: -mx * d.sway, dy: -pos - surge - my * d.sway }
}
