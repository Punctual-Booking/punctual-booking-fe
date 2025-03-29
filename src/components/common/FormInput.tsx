import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  translationKey: string
}

export function FormInput({
  label,
  error,
  translationKey,
  ...props
}: FormInputProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2" data-slot="form-input-container">
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        data-slot="form-input"
        placeholder={t(`auth.${translationKey}Placeholder`)}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
