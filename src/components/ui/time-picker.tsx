import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimePickerProps {
  name: string
  value?: string
  onChange?: (value: string) => void
}

export const TimePicker = ({ name, value, onChange }: TimePickerProps) => {
  // Generate time options from 00:00 to 23:59 in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
  })

  return (
    <Select name={name} value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map(time => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
