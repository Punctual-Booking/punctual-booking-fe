import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { StaffMember } from '@/types/staff'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// Extend the StaffMember type with role property needed for the UI
interface StaffMemberWithRole extends Partial<StaffMember> {
  id: string
  role: 'admin' | 'staff'
  services?: string[]
  specialties?: string[]
}

interface StaffFormData {
  name: string
  email: string
  role: 'admin' | 'staff'
  phone: string
  specialties: string
  services: string
  yearsOfExperience: number
  isActive: boolean
}

interface StaffModalProps {
  open: boolean
  onClose: () => void
  staff?: StaffMemberWithRole | null
}

export const StaffModal = ({ open, onClose, staff }: StaffModalProps) => {
  const { t } = useTranslation()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create the form with default values
  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'staff' as const,
      phone: '',
      specialties: '',
      services: '',
      yearsOfExperience: 0,
      isActive: true,
    },
  })

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name || '',
        email: staff.email || '',
        role: staff.role,
        phone: staff.phone || '',
        specialties: staff.specialties?.join(', ') || '',
        services: staff.services?.join(', ') || '',
        yearsOfExperience: staff.yearsOfExperience || 0,
        isActive: staff.isActive !== undefined ? staff.isActive : true,
      })
    } else {
      reset({
        name: '',
        email: '',
        role: 'staff' as const,
        phone: '',
        specialties: '',
        services: '',
        yearsOfExperience: 0,
        isActive: true,
      })
    }
  }, [staff, reset])

  const onSubmit = async (data: StaffFormData) => {
    try {
      setIsSubmitting(true)

      // Format specialties and services as arrays
      const formattedData = {
        ...data,
        specialties: data.specialties
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
        services: data.services
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      reset()
      onClose()
    } catch (error) {
      console.error('Error saving staff:', error)
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {staff
                ? t('admin.staff.modal.editTitle')
                : t('admin.staff.modal.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.staff.modal.description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.staff.name')}</Label>
              <Input
                id="name"
                placeholder={t('admin.staff.namePlaceholder')}
                {...register('name', { required: true })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {t('admin.staff.validation.nameRequired')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.staff.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('admin.staff.emailPlaceholder')}
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email?.type === 'required' && (
                <p className="text-sm text-destructive">
                  {t('admin.staff.validation.emailRequired')}
                </p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="text-sm text-destructive">
                  {t('admin.staff.validation.emailInvalid')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('admin.staff.phone')}</Label>
              <Input
                id="phone"
                placeholder={t('admin.staff.phonePlaceholder')}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">{t('admin.staff.role')}</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('admin.staff.selectRole')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          {t('admin.staff.roles.admin')}
                        </SelectItem>
                        <SelectItem value="staff">
                          {t('admin.staff.roles.staff')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">
                  {t('admin.staff.experience')}
                </Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  {...register('yearsOfExperience', {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">
                {t('admin.staff.specialties')}
              </Label>
              <Textarea
                id="specialties"
                placeholder={t('admin.staff.specialtiesPlaceholder')}
                {...register('specialties')}
              />
              <p className="text-xs text-muted-foreground">
                {t('admin.staff.separateWithCommas')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">{t('admin.staff.services')}</Label>
              <Textarea
                id="services"
                placeholder={t('admin.staff.servicesPlaceholder')}
                {...register('services')}
              />
              <p className="text-xs text-muted-foreground">
                {t('admin.staff.separateWithCommas')}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="isActive"
                  />
                )}
              />
              <Label htmlFor="isActive">{t('admin.staff.isActive')}</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} type="button">
                {t('admin.staff.modal.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t('common.loading')
                  : t('admin.staff.modal.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        onConfirm={handleConfirmClose}
        title={t('admin.staff.modal.confirmClose')}
        description={t('admin.staff.modal.confirmCloseDescription')}
      />
    </>
  )
}
