import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { storedLang } from './config'

// Prerendered pages are Spanish. A visitor who chose English gets it once the page's
// Suspense boundary has hydrated (switching earlier makes hydration fail on the text).
export function useRestoreLanguage() {
  const { i18n } = useTranslation()
  useEffect(() => {
    const lang = storedLang()
    if (i18n.language !== lang) void i18n.changeLanguage(lang)
  }, [i18n])
}
