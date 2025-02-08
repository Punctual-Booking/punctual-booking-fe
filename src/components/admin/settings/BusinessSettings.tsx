import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TimePicker } from '@/components/ui/time-picker'

export const BusinessSettings = () => {
  const { t } = useTranslation()
  const [openingTime, setOpeningTime] = useState('09:00')
  const [closingTime, setClosingTime] = useState('17:00')

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({ openingTime, closingTime })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.settings.business.info')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>{t('admin.settings.business.name')}</label>
          <Input name="businessName" />
        </div>
        <div className="space-y-2">
          <label>{t('admin.settings.business.description')}</label>
          <Textarea name="description" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label>{t('admin.settings.business.openingTime')}</label>
            <TimePicker
              name="openingTime"
              value={openingTime}
              onChange={setOpeningTime}
            />
          </div>
          <div className="space-y-2">
            <label>{t('admin.settings.business.closingTime')}</label>
            <TimePicker
              name="closingTime"
              value={closingTime}
              onChange={setClosingTime}
            />
          </div>
        </div>
        <Button onClick={handleSave}>{t('common.save')}</Button>
      </CardContent>
    </Card>
  )
}
