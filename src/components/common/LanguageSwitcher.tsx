import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 gap-2"
    >
      {i18n.language === 'en' ? (
        <>
          <span className="fi fi-pt" /> PT
        </>
      ) : (
        <>
          <span className="fi fi-gb" /> EN
        </>
      )}
    </Button>
  )
}
