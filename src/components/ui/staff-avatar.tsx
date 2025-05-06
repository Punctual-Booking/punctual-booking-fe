import { memo } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getStaffPlaceholder, handleImageError } from '@/utils/image'
import { cn } from '@/lib/utils'

interface StaffAvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Staff Avatar component with intelligent fallback to a placeholder
 * Memoized to prevent unnecessary rerenders
 */
export const StaffAvatar = memo(
  ({ src, name, size = 'md', className }: StaffAvatarProps) => {
    // Calculate pixel size based on size prop
    const sizeMap = {
      sm: 40,
      md: 60,
      lg: 100,
      xl: 150,
    }
    const pixelSize = sizeMap[size]

    // Get initials for fallback
    const initials = name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)

    // Determine size class
    const sizeClass = {
      sm: 'h-10 w-10',
      md: 'h-15 w-15',
      lg: 'h-24 w-24',
      xl: 'h-36 w-36',
    }[size]

    return (
      <Avatar className={cn(sizeClass, className)}>
        {src ? (
          <AvatarImage
            src={src}
            alt={`${name}'s profile`}
            onError={e => handleImageError(e, name, 'staff')}
          />
        ) : (
          <AvatarImage
            src={getStaffPlaceholder(name, pixelSize)}
            alt={`${name}'s profile`}
          />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    )
  }
)

StaffAvatar.displayName = 'StaffAvatar'
