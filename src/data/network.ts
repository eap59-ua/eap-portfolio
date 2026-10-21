import type { LineId } from './lines'

// The network map as data (validated as Figma frames F1/F2/F3 before coding).
// SVG draws lines + markers; labels are real HTML text positioned on top
// (readable, translatable, selectable — and Figma/crawlers keep them).
type L = { es: string; en: string }

export interface MapLine {
  id: string
  line: LineId
  d: string
  kind?: 'cer' | 'dash' | 'next'
  /** draw order delay (ms): project lines are born when L1 reaches them */
  delay: number
}
export type MarkerType = 'study' | 'work' | 'tick' | 'interchange' | 'badge' | 'next'
export interface MapMarker {
  type: MarkerType
  x: number
  y: number
  line?: LineId
  n?: string
  dark?: boolean
  r?: number
  /** where clicking the station takes you */
  href?: string
  name?: L
}
export interface MapLabel {
  x: number
  y: number // baseline of the name, in map units
  anchor: 'start' | 'middle' | 'end'
  name?: L
  sub?: L
  big?: boolean
  italic?: boolean
}
export interface NetworkMapSpec {
  w: number
  h: number
  lines: MapLine[]
  markers: MapMarker[]
  labels: MapLabel[]
  capsule: { x: number; y: number; w: number; h: number; label: L; vertical?: boolean }
  /** L1 path the train runs on, plus where it dwells (fractions of length) */
  trainPath: string
}

const l = (es: string, en = es): L => ({ es, en })

export const DESKTOP_MAP: NetworkMapSpec = {
  w: 800,
  h: 600,
  capsule: { x: 428, y: 508, w: 144, h: 24, label: l('GRADO UA · 2022–26', 'BSc UA · 2022–26') },
  trainPath: 'M30 520 H600 L640 480 V124',
  lines: [
    { id: 'cer', line: 'cer', d: 'M30 540 H700', kind: 'cer', delay: 0 },
    { id: 'l1', line: 'l1', d: 'M30 520 H600 L640 480 V250', delay: 0 },
    { id: 'l1-next', line: 'l1', d: 'M640 250 V112', kind: 'next', delay: 950 },
    { id: 'easycab', line: 'easycab', d: 'M450 509 V430 L400 380', delay: 560 },
    { id: 'chaos', line: 'chaos', d: 'M482 509 V350 L432 300', delay: 610 },
    { id: 'hydro', line: 'hydro', d: 'M514 509 V270 L464 220', delay: 660 },
    { id: 'donation', line: 'donation', d: 'M546 509 V190 L496 140', delay: 710 },
    { id: 'eco', line: 'eco', d: 'M640 350 L700 290 V180', delay: 820 },
    { id: 'studysync', line: 'studysync', d: 'M640 296 L660 276 V170', kind: 'dash', delay: 900 },
  ],
  markers: [
    { type: 'study', x: 40, y: 520, line: 'l1', href: '#estacion-smr', name: l('SMR') },
    { type: 'study', x: 92, y: 520, line: 'l1', r: 4.5, href: '#estacion-smr', name: l('FCT · App Informática') },
    { type: 'study', x: 148, y: 520, line: 'l1', href: '#estacion-dam', name: l('DAM') },
    { type: 'work', x: 208, y: 520, line: 'l1', href: '#estacion-autis-1', name: l('Autis I') },
    { type: 'study', x: 268, y: 520, line: 'l1', href: '#estacion-daw', name: l('DAW') },
    { type: 'work', x: 328, y: 520, line: 'l1', href: '#estacion-autis-2', name: l('Autis II') },
    { type: 'work', x: 640, y: 430, line: 'l1', href: '#estacion-ntt', name: l('NTT Data') },
    { type: 'interchange', x: 640, y: 350, href: '#estacion-tfg', name: l('TFG 10/10', 'Thesis 10/10') },
    { type: 'study', x: 640, y: 296, line: 'l1', r: 6, href: '#estacion-b2', name: l('B2 First') },
    { type: 'badge', x: 400, y: 380, line: 'easycab', n: '6', dark: true, href: '#proyecto-easycab', name: l('EasyCab') },
    { type: 'badge', x: 432, y: 300, line: 'chaos', n: '7', href: '#proyecto-chaos-crew', name: l('Chaos Crew') },
    { type: 'badge', x: 464, y: 220, line: 'hydro', n: '4', href: '#proyecto-hydrofulness', name: l('Hydrofulness') },
    { type: 'badge', x: 496, y: 140, line: 'donation', n: '3', href: '#proyecto-food-donation', name: l('Red de Donación de Alimentos', 'Food Donation Network') },
    { type: 'badge', x: 700, y: 180, line: 'eco', n: '2', href: '#proyecto-ecoalerta', name: l('EcoAlerta') },
    { type: 'badge', x: 660, y: 170, line: 'studysync', n: '5', r: 10, href: '#proyecto-studysync', name: l('StudySync') },
    { type: 'next', x: 640, y: 100, href: '#contacto', name: l('Tu equipo', 'Your team') },
    { type: 'work', x: 700, y: 540, line: 'cer', href: '#sobre-mi', name: l('Leroy Merlin') },
  ],
  labels: [
    { x: 40, y: 484, anchor: 'middle', name: l('SMR'), sub: l('2016–18') },
    { x: 92, y: 500, anchor: 'middle', sub: l('FCT') },
    { x: 148, y: 484, anchor: 'middle', name: l('DAM'), sub: l('2018–20') },
    { x: 208, y: 484, anchor: 'middle', name: l('Autis I'), sub: l('2020') },
    { x: 268, y: 484, anchor: 'middle', name: l('DAW'), sub: l('2020–21') },
    { x: 328, y: 484, anchor: 'middle', name: l('Autis II'), sub: l('2021') },
    { x: 624, y: 428, anchor: 'end', name: l('NTT Data'), sub: l('2025–26') },
    { x: 624, y: 347, anchor: 'end', name: l('TFG 10/10', 'Thesis 10/10'), sub: l('MH · jun 2026', 'Distinction · Jun 2026') },
    { x: 624, y: 293, anchor: 'end', name: l('B2 First'), sub: l('jun 2026', 'Jun 2026') },
    { x: 382, y: 376, anchor: 'end', name: l('EasyCab'), sub: l('Sistemas Distribuidos · 2025', 'Distributed Systems · 2025') },
    { x: 414, y: 296, anchor: 'end', name: l('Chaos Crew'), sub: l('DCA · C++') },
    { x: 446, y: 216, anchor: 'end', name: l('Hydrofulness'), sub: l('Hackathon · abr 2026', 'Hackathon · Apr 2026') },
    { x: 478, y: 136, anchor: 'end', name: l('Red de Donación de Alimentos', 'Food Donation Network'), sub: l('Ingeniería Web · 2026', 'Web Engineering · 2026') },
    { x: 718, y: 176, anchor: 'start', name: l('EcoAlerta'), sub: l('PWA · PostGIS') },
    { x: 678, y: 148, anchor: 'start', name: l('StudySync'), sub: l('en obras', 'in progress') },
    { x: 616, y: 96, anchor: 'end', name: l('Tu equipo', 'Your team'), sub: l('próxima estación', 'next stop'), big: true },
    { x: 700, y: 568, anchor: 'middle', name: l('Leroy Merlin'), sub: l('hoy', 'today') },
    { x: 378, y: 568, anchor: 'middle', sub: l('Cercanías · trabajando mientras estudiaba', 'Commuter line · working while studying'), italic: true },
  ],
}

export const MOBILE_MAP: NetworkMapSpec = {
  w: 350,
  h: 625,
  capsule: { x: 18, y: 214, w: 24, h: 96, label: l('GRADO UA · 2022–26', 'BSc UA · 2022–26'), vertical: true },
  trainPath: 'M30 20 V330 L70 370 V530',
  lines: [
    { id: 'cer', line: 'cer', d: 'M44 40 V586', kind: 'cer', delay: 0 },
    { id: 'l1', line: 'l1', d: 'M30 20 V330 L70 370 V520', delay: 0 },
    { id: 'l1-next', line: 'l1', d: 'M70 520 V548', kind: 'next', delay: 950 },
    { id: 'easycab', line: 'easycab', d: 'M30 230 H120 L150 200 H190', delay: 520 },
    { id: 'chaos', line: 'chaos', d: 'M30 252 H200', delay: 560 },
    { id: 'hydro', line: 'hydro', d: 'M30 274 H190 L220 304 H230', delay: 600 },
    { id: 'donation', line: 'donation', d: 'M30 296 H110', delay: 640 },
    { id: 'eco', line: 'eco', d: 'M70 430 H150 L180 400 H220', delay: 800 },
    { id: 'studysync', line: 'studysync', d: 'M84 470 V520', kind: 'dash', delay: 880 },
  ],
  markers: [
    { type: 'study', x: 30, y: 20, line: 'l1', href: '#estacion-smr', name: l('SMR') },
    { type: 'study', x: 30, y: 70, line: 'l1', href: '#estacion-dam', name: l('DAM') },
    { type: 'work', x: 30, y: 110, line: 'l1', href: '#estacion-autis-1', name: l('Autis I') },
    { type: 'study', x: 30, y: 150, line: 'l1', href: '#estacion-daw', name: l('DAW') },
    { type: 'work', x: 30, y: 185, line: 'l1', href: '#estacion-autis-2', name: l('Autis II') },
    { type: 'work', x: 70, y: 390, line: 'l1', href: '#estacion-ntt', name: l('NTT Data') },
    { type: 'interchange', x: 70, y: 430, href: '#estacion-tfg', name: l('TFG 10/10', 'Thesis 10/10') },
    { type: 'study', x: 70, y: 480, line: 'l1', r: 6, href: '#estacion-b2', name: l('B2 First') },
    { type: 'badge', x: 190, y: 200, line: 'easycab', n: '6', dark: true, r: 10, href: '#proyecto-easycab', name: l('EasyCab') },
    { type: 'badge', x: 200, y: 252, line: 'chaos', n: '7', r: 10, href: '#proyecto-chaos-crew', name: l('Chaos Crew') },
    { type: 'badge', x: 230, y: 304, line: 'hydro', n: '4', r: 10, href: '#proyecto-hydrofulness', name: l('Hydrofulness') },
    { type: 'badge', x: 110, y: 296, line: 'donation', n: '3', r: 10, href: '#proyecto-food-donation', name: l('Donación', 'Food Donation') },
    { type: 'badge', x: 220, y: 400, line: 'eco', n: '2', r: 10, href: '#proyecto-ecoalerta', name: l('EcoAlerta') },
    { type: 'badge', x: 84, y: 520, line: 'studysync', n: '5', r: 9, href: '#proyecto-studysync', name: l('StudySync') },
    { type: 'next', x: 70, y: 548, href: '#contacto', name: l('Tu equipo', 'Your team') },
    { type: 'work', x: 44, y: 594, line: 'cer', href: '#sobre-mi', name: l('Leroy Merlin') },
  ],
  labels: [
    { x: 58, y: 25, anchor: 'start', name: l('SMR'), sub: l('2016–18') },
    { x: 58, y: 75, anchor: 'start', name: l('DAM'), sub: l('2018–20') },
    { x: 58, y: 115, anchor: 'start', name: l('Autis I'), sub: l('2020') },
    { x: 58, y: 155, anchor: 'start', name: l('DAW'), sub: l('2020–21') },
    { x: 58, y: 190, anchor: 'start', name: l('Autis II'), sub: l('2021') },
    { x: 206, y: 205, anchor: 'start', name: l('EasyCab') },
    { x: 216, y: 257, anchor: 'start', name: l('Chaos Crew') },
    { x: 246, y: 309, anchor: 'start', name: l('Hydrofulness') },
    { x: 126, y: 301, anchor: 'start', name: l('Donación', 'Food Donation') },
    { x: 96, y: 395, anchor: 'start', name: l('NTT Data'), sub: l('2025–26') },
    { x: 96, y: 452, anchor: 'start', name: l('TFG 10/10', 'Thesis 10/10'), sub: l('MH', 'Distinction') },
    { x: 236, y: 405, anchor: 'start', name: l('EcoAlerta') },
    { x: 104, y: 485, anchor: 'start', name: l('B2 First') },
    { x: 100, y: 524, anchor: 'start', name: l('StudySync'), sub: l('en obras', 'in progress') },
    { x: 94, y: 553, anchor: 'start', name: l('Tu equipo', 'Your team'), sub: l('próxima estación', 'next stop'), big: true },
    { x: 62, y: 599, anchor: 'start', name: l('Leroy Merlin · hoy', 'Leroy Merlin · today'), sub: l('Cercanías · trabajando mientras estudiaba', 'Commuter line · working while studying') },
  ],
}
