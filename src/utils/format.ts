export const formatPrice = (value: string | number) => {
  if (!value) return ''
  const number = parseFloat(value.toString().replace(',', '.'))
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(number)
}
