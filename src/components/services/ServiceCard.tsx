import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ServiceImage } from '@/components/ui/service-image'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface ServiceCardProps {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  imageSrc?: string | null
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * ServiceCard component - displays a service with image and details
 * Uses placeholder images when no image is provided
 * Memoized to prevent unnecessary rerenders
 */
export const ServiceCard = memo(
  ({
    name,
    description,
    price,
    duration,
    imageSrc,
    isSelected = false,
    onClick,
    className,
  }: ServiceCardProps) => {
    const { t } = useTranslation()

    return (
      <Card
        className={cn(
          'relative overflow-hidden transition-all',
          isSelected && 'ring-2 ring-primary',
          className
        )}
      >
        <div className="aspect-video w-full overflow-hidden">
          <ServiceImage
            src={imageSrc}
            name={name}
            size="lg"
            className="w-full"
          />
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="font-medium">
              {t('common.currency', { value: price })}
            </span>
            <span className="text-sm text-muted-foreground">
              {duration} {t('common.minutes')}
            </span>
          </div>
        </CardContent>

        {onClick && (
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={onClick}
              variant={isSelected ? 'secondary' : 'default'}
              className="w-full"
            >
              {isSelected ? t('services.selected') : t('services.select')}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }
)
