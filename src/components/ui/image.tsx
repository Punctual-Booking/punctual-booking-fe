import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export const Image = ({
  src,
  alt,
  className,
  fallback = '/placeholder.png',
  aspectRatio = 'auto',
  ...props
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setImgSrc(src || fallback)
    setIsLoading(true)
    setError(false)
  }, [src, fallback])

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto',
  }

  return (
    <div
      className={cn(
        'overflow-hidden',
        aspectRatioClass[aspectRatio],
        className
      )}
    >
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setImgSrc(fallback)
        }}
        className={cn(
          'object-cover w-full h-full transition-opacity duration-300',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100'
        )}
        {...props}
      />
      {isLoading && !error && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
