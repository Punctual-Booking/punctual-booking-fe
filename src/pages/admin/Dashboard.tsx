import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const AdminDashboard = () => {
  const { t } = useTranslation()

  // TODO: Replace with actual data from API
  const todayBookings = [
    {
      id: 1,
      guestName: 'John Doe',
      time: '10:00',
      service: 'Haircut & Beard Trim',
      duration: 45,
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      time: '12:30',
      service: 'Hair Coloring',
      duration: 120,
    },
    {
      id: 3,
      guestName: 'Mike Johnson',
      time: '14:00',
      service: 'Regular Haircut',
      duration: 30,
    },
    {
      id: 4,
      guestName: 'Sarah Williams',
      time: '16:30',
      service: 'Hair Treatment & Style',
      duration: 90,
    },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('admin.dashboard.title')}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.dashboard.totalBookings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.dashboard.todayBookings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayBookings.map(booking => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.time}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('admin.dashboard.duration', {
                        duration: booking.duration,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add more dashboard cards here */}
      </div>
    </div>
  )
}
