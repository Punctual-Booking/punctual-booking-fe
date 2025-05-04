/**
 * Utility functions for image handling and placeholder generation
 */

/**
 * Generates a placeholder image URL with customizable size, colors, and text
 * Uses the placehold.co service
 */
export const getPlaceholderImage = ({
  width = 200,
  height = 200,
  text,
  backgroundColor = 'e2e8f0', // Light gray background
  textColor = '64748b', // Slate text color
  format = 'png',
}: {
  width?: number
  height?: number
  text?: string
  backgroundColor?: string
  textColor?: string
  format?: 'svg' | 'png' | 'jpeg' | 'webp'
}) => {
  // Base URL with dimensions
  let url = `https://placehold.co/${width}x${height}/${backgroundColor}/${textColor}.${format}`

  // Add custom text if provided
  if (text) {
    // Replace spaces with + for URL
    const formattedText = text.replace(/\s+/g, '+')
    url += `?text=${formattedText}`
  }

  return url
}

/**
 * Gets a staff member avatar placeholder with initials
 */
export const getStaffPlaceholder = (
  name: string = 'Staff Member',
  size: number = 200
) => {
  // Extract initials from name (up to 2 characters)
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return getPlaceholderImage({
    width: size,
    height: size,
    text: initials,
    backgroundColor: '7c3aed', // Purple background
    textColor: 'ffffff', // White text
    format: 'png',
  })
}

/**
 * Gets a service placeholder image
 */
export const getServicePlaceholder = (
  serviceName: string = 'Service',
  size: number = 300
) => {
  return getPlaceholderImage({
    width: size,
    height: Math.round(size * 0.6),
    text: serviceName,
    backgroundColor: '0ea5e9', // Sky blue background
    textColor: 'ffffff', // White text
    format: 'png',
  })
}

/**
 * Handles image loading errors by using a placeholder
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string = '',
  type: 'staff' | 'service' = 'staff'
) => {
  const target = event.target as HTMLImageElement

  if (type === 'staff') {
    target.src = getStaffPlaceholder(name)
  } else {
    target.src = getServicePlaceholder(name)
  }
}
