import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useServiceStore } from '@/stores/useServiceStore'
import { Service } from '@/types/service'
import { useEffect } from 'react'
import { useBookingStore } from '@/stores/useBookingStore'
import { Loading } from '@/components/ui/loading'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ServiceImage } from '@/components/ui/service-image'
import { StaffAvatar } from '@/components/ui/staff-avatar'

export const ServicesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { services, fetchServicesByStaff, isLoading } = useServiceStore()
  const { selectedStaff, setSelectedService } = useBookingStore()

  useEffect(() => {
    // Redirect if no staff is selected
    if (!selectedStaff) {
      navigate({ to: '/user/staff-selection' })
      return
    }

    // Fetch services that the selected staff member can provide
    fetchServicesByStaff(selectedStaff.id)
  }, [selectedStaff, navigate, fetchServicesByStaff])

  const handleSelectService = (service: Service) => {
    // Save the selected service to the booking store
    setSelectedService(service)
    navigate({ to: '/user/booking' })
  }

  if (isLoading) {
    return <Loading centered className="py-8" text={t('services.loading')} />
  }

  if (services.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('services.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('services.description')}
          </p>
          {selectedStaff && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <p className="font-medium">{t('staff.selected')}:</p>
              <div className="flex items-center gap-3 mt-2">
                <StaffAvatar
                  src={selectedStaff.image}
                  name={selectedStaff.name}
                  size="sm"
                />
                <span className="font-medium">{selectedStaff.name}</span>
              </div>
            </div>
          )}
        </div>
        <Alert className="my-8">
          <AlertDescription>
            {t('services.noServicesAvailable')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/user/staff-selection' })}>
          {t('common.back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('services.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('services.description')}
        </p>
        {selectedStaff && (
          <div className="mt-4 p-4 border rounded-md bg-muted/30">
            <p className="font-medium">{t('staff.selected')}:</p>
            <div className="flex items-center gap-3 mt-2">
              <StaffAvatar
                src={selectedStaff.image}
                name={selectedStaff.name}
                size="sm"
              />
              <span className="font-medium">{selectedStaff.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <ServiceImage
                  src={service.image}
                  name={service.name}
                  size="lg"
                  className="shadow-md rounded-md"
                  aspectRatio="video"
                />
              </div>
              <CardTitle className="flex justify-between items-start">
                <span>{service.name}</span>
                <span className="text-muted-foreground">
                  {t('common.currency', { value: service.price })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <Button
                className="w-full"
                onClick={() => handleSelectService(service)}
              >
                {t('services.select')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
