import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import {
  createServiceSchema,
  type ServiceFormData,
} from '@/utils/services/utils'
import { Service, ServiceModalProps } from '@/types/services'
import { formatPrice } from '@/utils/format'
import { ImageUpload } from '@/components/common/ImageUpload'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'

export const ServiceModal = ({ open, onClose, service }: ServiceModalProps) => {
  const { t } = useTranslation()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(createServiceSchema(t)),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      image: '',
    },
  })

  const price = watch('price')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedPriceChange = useDebounce(price, 300)

  useEffect(() => {
    if (service) {
      setValue('name', service.name)
      setValue('description', service.description)
      setValue('price', service.price.toString())
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        image: '',
      })
    }
  }, [service, setValue, reset])

  useEffect(() => {
    if (debouncedPriceChange) {
      setValue('price', debouncedPriceChange.replace('.', ','))
    }
  }, [debouncedPriceChange, setValue])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow digits, one comma/dot, and proper decimal placement
    if (/^\d*[.,]?\d{0,2}$/.test(value)) {
      setValue('price', value.replace('.', ','))
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true)
      const formattedData = {
        ...data,
        price: parseFloat(data.price.replace(',', '.')) || 0,
      } as Service

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Save service:', formattedData)
      reset()
      onClose()
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    reset()
    setShowConfirmClose(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {service
                ? t('admin.services.modal.editTitle')
                : t('admin.services.modal.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.services.modal.description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.services.name')}</Label>
              <Input
                id="name"
                placeholder={service ? service.name : ''}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t('admin.services.description')}
              </Label>
              <Textarea
                id="description"
                placeholder={service ? service.description : ''}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t('admin.services.price')}</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={handlePriceChange}
                  className="text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  €
                </span>
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
              {price && (
                <p className="text-sm text-muted-foreground text-right">
                  {formatPrice(price)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <ImageUpload
                id="image"
                label={t('admin.services.image')}
                currentImage={service?.image}
                error={errors.image?.message as string}
                {...register('image')}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} type="button">
                {t('admin.services.modal.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t('common.loading')
                  : t('admin.services.modal.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        onConfirm={handleConfirmClose}
        title={t('admin.services.modal.confirmClose')}
        description={t('admin.services.modal.confirmCloseDescription')}
      />
    </>
  )
}
