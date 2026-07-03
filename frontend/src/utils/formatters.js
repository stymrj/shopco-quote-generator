export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

export const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const toDateInputValue = (date) => {
  return date.toISOString().slice(0, 10)
}
