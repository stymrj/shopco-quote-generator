export const normalizeProduct = (product, index = 0) => ({
  ...product,
  _id: product._id || product.id || product.zohoProductId || `product-${index}`,
})
