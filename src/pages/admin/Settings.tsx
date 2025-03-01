import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BusinessSettings } from '@/components/admin/settings/BusinessSettings'
import { BookingSettings } from '@/components/admin/settings/BookingSettings'
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings'
import { AppearanceSettings } from '@/components/admin/settings/AppearanceSettings'

export const SettingsPage = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('admin.settings.title')}
      </h1>

      <Tabs defaultValue="business" className="space-y-4">
        <div className="overflow-auto">
          <TabsList>
            <TabsTrigger value="business">
              {t('admin.settings.business.title')}
            </TabsTrigger>
            <TabsTrigger value="booking">
              {t('admin.settings.booking.title')}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              {t('admin.settings.notifications.title')}
            </TabsTrigger>
            <TabsTrigger value="appearance">
              {t('admin.settings.appearance.title')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="business">
          <BusinessSettings />
        </TabsContent>

        <TabsContent value="booking">
          <BookingSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        {/* Add other tab contents as we implement them */}
      </Tabs>
    </div>
  )
}

export default SettingsPage
