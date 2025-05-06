import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { StaffAvatar } from '@/components/ui/staff-avatar'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface StaffCardProps {
  id: string
  name: string
  imageSrc?: string | null
  specialties?: string[]
  experience?: number
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * StaffCard component - displays a staff member with avatar and details
 * Uses placeholder images when no image is provided
 * Memoized to prevent unnecessary rerenders
 */
export const StaffCard = memo(
  ({
    name,
    imageSrc,
    specialties = [],
    experience,
    isSelected = false,
    onClick,
    className,
  }: StaffCardProps) => {
    const { t } = useTranslation()

    return (
      <Card
        className={cn(
          'relative overflow-hidden transition-all',
          isSelected && 'ring-2 ring-primary',
          className
        )}
      >
        <CardContent className="p-4 flex flex-col items-center sm:flex-row sm:items-start sm:space-x-4">
          <StaffAvatar src={imageSrc} name={name} size="lg" />

          <div className="mt-4 sm:mt-0 flex-1 min-w-0">
            <h3 className="text-lg font-semibold">{name}</h3>

            {specialties.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            {experience !== undefined && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t('staff.experience')}: {experience} {t('staff.years')}
              </p>
            )}

            {onClick && (
              <Button
                onClick={onClick}
                variant={isSelected ? 'secondary' : 'default'}
                className="mt-4 w-full sm:w-auto"
              >
                {isSelected ? t('common.selected') : t('staff.select')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
