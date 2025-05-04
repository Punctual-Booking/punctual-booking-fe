import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'

interface LanguageSwitcherProps {
  className?: string
}

/**
 * LanguageSwitcher component - allows users to toggle between languages
 * Memoized to prevent unnecessary rerenders
 */
export const LanguageSwitcher = memo(({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation()

  // Memoize the toggle handler
  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en'
    i18n.changeLanguage(newLang)
  }, [i18n])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn('gap-2', className)}
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
})
