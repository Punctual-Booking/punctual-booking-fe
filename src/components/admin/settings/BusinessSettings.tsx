import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TimePicker } from '@/components/ui/time-picker'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { toast } from 'sonner'

export const BusinessSettings = () => {
  const { t } = useTranslation()
  const { business, updateBusinessSettings, saveSettings, isLoading } =
    useSettingsStore()

  const handleSave = async () => {
    try {
      await saveSettings()
      toast.success(t('common.settingsSaved'))
    } catch (error) {
      toast.error(t('common.settingsError'))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.settings.business.info')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>{t('admin.settings.business.name')}</label>
          <Input
            name="businessName"
            value={business.businessName}
            onChange={e =>
              updateBusinessSettings({ businessName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label>{t('admin.settings.business.description')}</label>
          <Textarea
            name="description"
            value={business.description}
            onChange={e =>
              updateBusinessSettings({ description: e.target.value })
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label>{t('admin.settings.business.openingTime')}</label>
            <TimePicker
              name="openingTime"
              value={business.openingTime}
              onChange={value => updateBusinessSettings({ openingTime: value })}
            />
          </div>
          <div className="space-y-2">
            <label>{t('admin.settings.business.closingTime')}</label>
            <TimePicker
              name="closingTime"
              value={business.closingTime}
              onChange={value => updateBusinessSettings({ closingTime: value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label>{t('admin.settings.business.email')}</label>
          <Input
            name="email"
            type="email"
            value={business.email}
            onChange={e => updateBusinessSettings({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label>{t('admin.settings.business.phone')}</label>
          <Input
            name="phone"
            value={business.phone}
            onChange={e => updateBusinessSettings({ phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label>{t('admin.settings.business.address')}</label>
          <Input
            name="address"
            value={business.address}
            onChange={e => updateBusinessSettings({ address: e.target.value })}
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? t('common.saving') : t('common.save')}
        </Button>
      </CardContent>
    </Card>
  )
}
