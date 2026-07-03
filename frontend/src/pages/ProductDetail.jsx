import { useEffect, useState } from 'react'
import { getImageUrl, getProductById, getProducts } from '../api'
import Footer from '../components/Footer'
import NewsletterStrip from '../components/NewsletterStrip'
import PriceLine from '../components/PriceLine'
import ProductCard from '../components/ProductCard'
import ProductInfoTabs from '../components/ProductInfoTabs'
import Rating from '../components/Rating'
import { normalizeProduct } from '../utils/productHelpers'

function ProductDetail({ productId, setPage, openProduct, addToCart }) {
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('L')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('')
        setProduct(null)
        setRelatedProducts([])

        if (!productId) {
          throw new Error('Product not found')
        }

        const data = await getProductById(productId)

        if (data.success && data.product) {
          const normalizedProduct = normalizeProduct(data.product)
          setProduct(normalizedProduct)
          setSelectedImage(normalizedProduct.images?.[0] || normalizedProduct.image)
          fetchRelatedProducts(normalizedProduct)
          return
        }

        throw new Error(data.error || 'Product not found')
      } catch (err) {
        setError(err.message || 'Product not found')
      }
    }

    fetchProduct()
  }, [productId])

  const fetchRelatedProducts = async (currentProduct) => {
    try {
      const data = await getProducts(currentProduct.type || 'All')
      if (data.success) {
        const products = (data.products || [])
          .map(normalizeProduct)
          .filter((item) => item._id !== currentProduct._id)
          .slice(0, 4)

        setRelatedProducts(products)
      }
    } catch (error) {
      setRelatedProducts([])
    }
  }

  if (error) {
    return <p className="mx-auto max-w-7xl px-4 py-8 text-red-600">{error}</p>
  }

  if (!product) {
    return <p className="mx-auto max-w-7xl px-4 py-8 text-slate-500">Loading product...</p>
  }

  const images = product.images?.length ? product.images : [product.image]

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-7">
        <div className="mb-5 text-sm text-slate-400">
          Home <span className="px-2">/</span> Shop <span className="px-2">/</span> {product.type || 'Product'}
        </div>

        <section className="grid gap-8 border-b border-slate-100 pb-8 lg:grid-cols-[110px_minmax(0,1fr)_minmax(360px,1fr)]">
          <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:block lg:space-y-3">
            {images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-lg border bg-slate-100 ${selectedImage === image ? 'border-slate-950' : 'border-transparent'}`}
              >
                <img src={getImageUrl(image)} alt={product.name} className="aspect-square w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="order-1 overflow-hidden rounded-lg bg-slate-100 lg:order-2">
            <img src={getImageUrl(selectedImage || product.image)} alt={product.name} className="aspect-square w-full object-contain" />
          </div>

          <div className="order-3">
            <button onClick={() => setPage('products')} className="mb-5 text-sm font-semibold text-slate-500 hover:text-slate-950">
              ← Back to Products
            </button>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">{product.name}</h1>
            <Rating rating={product.rating || 4.5} reviewCount={product.reviewCount || 45} />
            <PriceLine product={product} large />
            <p className="mt-5 border-b border-slate-100 pb-5 leading-7 text-slate-600">
              {product.description || 'Product details are not available.'}
            </p>

            <div className="border-b border-slate-100 py-5">
              <p className="mb-3 text-sm font-semibold text-slate-500">Select Colors</p>
              <div className="flex gap-3">
                {(product.colors || ['#111827', '#d1d5db']).map((color) => (
                  <span
                    key={color}
                    className="h-9 w-9 rounded-full border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="border-b border-slate-100 py-5">
              <p className="mb-3 text-sm font-semibold text-slate-500">Choose Size</p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold ${selectedSize === size ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-[150px_1fr]">
              <div className="flex items-center justify-between rounded-full bg-slate-100 px-4 py-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold">-</button>
                <span className="font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold">+</button>
              </div>

              <button
                onClick={() => {
                  addToCart({ ...product, selectedSize }, quantity)
                  setPage('cart')
                }}
                className="rounded-full bg-slate-950 px-8 py-3 font-bold text-white hover:bg-slate-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        <ProductInfoTabs product={product} />

        {relatedProducts.length > 0 && (
          <section className="py-10">
            <h2 className="mb-6 text-center text-3xl font-black tracking-tight">Similar Products</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} openProduct={openProduct} addToCart={addToCart} />
              ))}
            </div>
          </section>
        )}
      </main>
      <NewsletterStrip />
      <Footer />
    </>
  )
}

export default ProductDetail
