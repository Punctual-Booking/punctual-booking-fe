import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const NotificationSettings = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.settings.notifications.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="font-medium">
              {t('admin.settings.notifications.smsNotifications')}
            </label>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="font-medium">
              {t('admin.settings.notifications.staffNotifications')}
            </label>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <label className="font-medium">
            {t('admin.settings.notifications.reminderTime')}
          </label>
          <Select defaultValue="24">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 4, 12, 24, 48].map(hours => (
                <SelectItem key={hours} value={hours.toString()}>
                  {hours} hours
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button>{t('common.save')}</Button>
      </CardContent>
    </Card>
  )
}
