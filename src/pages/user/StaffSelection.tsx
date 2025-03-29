import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStaffStore } from '@/stores/useStaffStore'
import { useBookingStore } from '@/stores/useBookingStore'
import { Badge } from '@/components/ui/badge'
import { StaffMember } from '@/types/staff'
import { Loading } from '@/components/ui/loading'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const StaffSelectionPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { staff, fetchStaff, fetchStaffByService, isLoading, error } =
    useStaffStore()
  const { selectedService, setSelectedStaff } = useBookingStore()

  useEffect(() => {
    // Redirect if no service is selected
    if (!selectedService) {
      navigate({ to: '/user/services' })
      return
    }

    // Fetch staff members that can perform the selected service
    fetchStaffByService(selectedService.id)
  }, [selectedService, navigate, fetchStaffByService])

  const handleSelectStaff = (staffId: string) => {
    // Save the selected staff to the booking store
    const staffMember = staff.find((s: StaffMember) => s.id === staffId)
    if (staffMember) {
      setSelectedStaff(staffMember)
      // Skip the booking page for now and go straight to confirmation
      navigate({ to: '/user/confirmation' })
    }
  }

  if (isLoading) {
    return <Loading centered className="py-8" text={t('staff.loading')} />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (staff.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('staff.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('staff.description')}</p>
          {selectedService && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <p className="font-medium">{t('services.selected')}:</p>
              <div className="flex justify-between items-center mt-2">
                <span>{selectedService.name}</span>
                <span className="text-muted-foreground">
                  {t('common.currency', { value: selectedService.price })}
                </span>
              </div>
            </div>
          )}
        </div>
        <Alert className="my-8">
          <AlertDescription>{t('staff.noStaffAvailable')}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/user/services' })}>
          {t('common.back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('staff.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('staff.description')}</p>
        {selectedService && (
          <div className="mt-4 p-4 border rounded-md bg-muted/30">
            <p className="font-medium">{t('services.selected')}:</p>
            <div className="flex justify-between items-center mt-2">
              <span>{selectedService.name}</span>
              <span className="text-muted-foreground">
                {t('common.currency', { value: selectedService.price })}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member: StaffMember) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                <img
                  src={member.image || '/images/default-avatar.png'}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle>{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('staff.experience', { years: member.yearsOfExperience })}
              </p>
              <div className="flex flex-wrap gap-2">
                {member.specialties?.map(specialty => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => handleSelectStaff(member.id)}
              >
                {t('staff.select')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StaffSelectionPage
