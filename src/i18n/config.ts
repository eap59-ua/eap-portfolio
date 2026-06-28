import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { es } from './es'
import { en } from './en'

function initialLang(): 'es' | 'en' {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    /* ignore */
  }
  return 'es'
}

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang(),
  fallbackLng: 'es',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
})

export default i18n
