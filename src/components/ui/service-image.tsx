import { memo } from 'react'
import { cn } from '@/lib/utils'
import { getServicePlaceholder, handleImageError } from '@/utils/image'

interface ServiceImageProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

/**
 * Service Image component with intelligent fallback to a placeholder
 * Memoized to prevent unnecessary rerenders
 */
export const ServiceImage = memo(
  ({
    src,
    name,
    size = 'md',
    className,
    aspectRatio = 'video',
  }: ServiceImageProps) => {
    // Calculate pixel size based on size prop
    const sizeMap = {
      sm: 150,
      md: 250,
      lg: 350,
      xl: 450,
    }
    const pixelSize = sizeMap[size]

    // Determine size and aspect ratio classes
    const sizeClass = {
      sm: 'h-auto max-w-[150px]',
      md: 'h-auto max-w-[250px]',
      lg: 'h-auto max-w-[350px]',
      xl: 'h-auto max-w-[450px]',
    }[size]

    const aspectRatioClass = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[2/1]',
    }[aspectRatio]

    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-md bg-muted',
          sizeClass,
          aspectRatioClass,
          className
        )}
      >
        <img
          src={src || getServicePlaceholder(name, pixelSize)}
          alt={`${name} service`}
          className="object-cover w-full h-full"
          onError={e => handleImageError(e, name, 'service')}
        />
      </div>
    )
  }
)
