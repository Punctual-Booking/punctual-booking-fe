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
import { createStaffSchema, type StaffFormData } from '@/utils/staff/validation'

interface StaffModalProps {
  open: boolean
  onClose: () => void
  staff?: StaffMember | null
}

export const StaffModal = ({ open, onClose, staff }: StaffModalProps) => {
  const { t } = useTranslation()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = createStaffSchema(t)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StaffFormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (staff) {
      reset(staff)
    } else {
      reset()
    }
  }, [staff, reset])

  const onSubmit = async (data: StaffFormData) => {
    try {
      setIsSubmitting(true)
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Save staff:', data)
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
        <DialogContent className="sm:max-w-[425px]">
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
                placeholder={staff?.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.staff.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={staff?.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('admin.staff.role')}</Label>
              <Select
                defaultValue={staff?.role || 'staff'}
                onValueChange={value =>
                  register('role').onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.staff.selectRole')} />
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
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
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
