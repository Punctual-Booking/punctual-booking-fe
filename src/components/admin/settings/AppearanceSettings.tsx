import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const AppearanceSettings = () => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const handleLanguageChange = (newLang: string) => {
    localStorage.setItem('i18nextLng', newLang)
    i18n.changeLanguage(newLang)
  }

  const handleSave = () => {
    // Save other settings if needed
    console.log('Settings saved')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.settings.appearance.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="font-medium">
            {t('admin.settings.appearance.theme')}
          </label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t('common.theme.light')}</SelectItem>
              <SelectItem value="dark">{t('common.theme.dark')}</SelectItem>
              <SelectItem value="system">{t('common.theme.system')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">
            {t('admin.settings.appearance.language')}
          </label>
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave}>{t('common.save')}</Button>
      </CardContent>
    </Card>
  )
}
