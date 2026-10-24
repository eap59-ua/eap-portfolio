import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { es } from './es'
import { en } from './en'
import { isPrerendered } from '../lib/ssr'

/** the visitor's saved choice (Spanish by default; never throws on the server) */
export function storedLang(): 'es' | 'en' {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    /* ignore */
  }
  return 'es'
}

// Prerendered pages are Spanish: they hydrate in Spanish first (the page switches after).
const initial = isPrerendered() ? 'es' : storedLang()

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initial,
  fallbackLng: 'es',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
})

// keep <html lang> in sync with the active language (init + toggle)
if (typeof document !== 'undefined') {
  document.documentElement.lang = initial
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
  })
}

export default i18n
