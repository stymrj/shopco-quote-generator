export const getSavedCart = (userId) => {
  if (!userId) return []

  try {
    const cart = localStorage.getItem(`shopco_cart_${userId}`)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    return []
  }
}
