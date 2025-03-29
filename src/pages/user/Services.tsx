import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useServiceStore } from '@/stores/useServiceStore'
import { Service } from '@/types/service'
import { useEffect } from 'react'
import { useBookingStore } from '@/stores/useBookingStore'
import { Loading } from '@/components/ui/loading'

export const ServicesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { services, fetchServices, isLoading } = useServiceStore()
  const { setSelectedService, resetBooking } = useBookingStore()

  useEffect(() => {
    // Reset any previous booking data when starting a new booking flow
    resetBooking()
    // Fetch available services
    fetchServices()
  }, [fetchServices, resetBooking])

  const handleSelectService = (service: Service) => {
    // Save the selected service to the booking store
    setSelectedService(service)
    navigate({ to: '/user/staff-selection' })
  }

  if (isLoading) {
    return <Loading centered className="py-8" text={t('services.loading')} />
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
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(service => (
          <Card key={service.id} className="overflow-hidden">
            {service.image && (
              <div className="aspect-video relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
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
              <div className="flex justify-between items-center">
                <Button onClick={() => handleSelectService(service)}>
                  {t('services.select')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
