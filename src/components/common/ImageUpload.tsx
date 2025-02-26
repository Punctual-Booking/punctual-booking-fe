import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Image } from '@/components/ui/image'
import { forwardRef, useState } from 'react'

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  currentImage?: string
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ label, error, currentImage, onChange, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
      // Call the original onChange if provided
      onChange?.(e)
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id}>{label}</Label>
        <div className="flex items-center gap-4">
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="h-20 w-20 rounded-md object-cover"
              aspectRatio="square"
            />
          )}
          <Input
            type="file"
            accept="image/*"
            ref={ref}
            onChange={handleImageChange}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

ImageUpload.displayName = 'ImageUpload'
