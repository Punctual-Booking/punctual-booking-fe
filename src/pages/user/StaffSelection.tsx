import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStaffStore } from '@/stores/useStaffStore'
import { useBookingStore } from '@/stores/useBookingStore'
import { Badge } from '@/components/ui/badge'
import { StaffMember } from '@/types/staff'

export const StaffSelectionPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { staff, fetchStaff, isLoading } = useStaffStore()
  const { selectedService, setSelectedStaff } = useBookingStore()

  useEffect(() => {
    // Redirect if no service is selected
    if (!selectedService) {
      navigate('/user/services')
      return
    }
    fetchStaff()
  }, [selectedService, navigate, fetchStaff])

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaff(staff.find((s: StaffMember) => s.id === staffId)!)
    navigate('/user/booking')
  }

  if (isLoading) {
    return <div>{t('staff.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('staff.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('staff.description')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map(member => (
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
