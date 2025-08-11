import { useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  Clock,
  Scissors,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { AppointmentStatus } from '@/types/appointment'
import { useAppointment } from '@/hooks/appointments/useAppointment'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'

const getStatusColor = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
      return 'bg-green-100 text-green-800 border-green-200'
    case AppointmentStatus.RESCHEDULED:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case AppointmentStatus.COMPLETED:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case AppointmentStatus.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const PublicAppointmentPage = (): JSX.Element => {
  const { id } = useParams({ from: '/appointment/$id' })
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user } = useCurrentUser()

  const { appointment, isLoading, isError, error, refetch } = useAppointment(id)

  useEffect(() => {
    if (isError) {
      console.error('PublicAppointmentPage error:', error)
    }
  }, [isError, error])

  const currentLocale = i18n.language === 'pt' ? pt : enUS
  const formatDate = (date: Date | string, formatStr: string) =>
    format(new Date(date), formatStr, { locale: currentLocale })

  if (isLoading) {
    return <Loading centered className="py-8" />
  }

  if (!appointment) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          {t('booking.notFound.title')}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t('booking.notFound.description')}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="default" onClick={() => refetch()}>
            {t('common.search')}
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            {t('auth.login')}
          </Button>
        </div>
      </div>
    )
  }

  const isUpcoming = new Date(appointment.startTime) > new Date()

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('publicAppointment.title')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            {t('auth.login')}
          </Button>
          <Button
            variant="default"
            onClick={() => navigate({ to: '/register' })}
          >
            {t('auth.register')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{t('booking.details.status')}</CardTitle>
            <Badge className={getStatusColor(appointment.status)}>
              {t(
                `booking.status.${appointment.status === 'rescheduled' ? 'pending' : appointment.status}`
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>
              {t('booking.details.bookingId')}: {appointment.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Clock className="h-4 w-4" />
            <span>
              {t('booking.details.created')}:{' '}
              {formatDate(appointment.createdAt, 'PPp')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('booking.details.serviceDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium text-lg">{appointment.service.name}</h3>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.details.dateAndTime')}</h3>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(appointment.startTime, 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(appointment.startTime, 'p')} -{' '}
                {formatDate(appointment.endTime, 'p')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('booking.details.staffDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{appointment.staff.name}</h3>
            </div>
          </div>

          <div className="h-px w-full bg-border my-4"></div>

          <div className="space-y-2">
            {appointment.staff.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.staff.phone}</span>
              </div>
            )}
            {appointment.staff.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.staff.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isUpcoming && (
        <Card>
          <CardHeader>
            <CardTitle>{t('booking.details.actions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('publicAppointment.accessNote')}
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => navigate({ to: '/' })}>
                {t('publicAppointment.loginToManage')}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => navigate({ to: '/register' })}
              >
                {t('publicAppointment.registerToManage')}
              </Button>
            </div>
            {user && (
              <p className="text-xs text-muted-foreground">
                {t('auth.haveAccount')} {t('auth.login')}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PublicAppointmentPage
