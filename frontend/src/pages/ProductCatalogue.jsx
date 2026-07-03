import { useEffect, useMemo, useState } from 'react'
import { getProducts, getProductTypes } from '../api'
import FilterPanel from '../components/FilterPanel'
import Footer from '../components/Footer'
import MobileTypeChips from '../components/MobileTypeChips'
import NewsletterStrip from '../components/NewsletterStrip'
import ProductCard from '../components/ProductCard'
import { normalizeProduct } from '../utils/productHelpers'

function ProductCatalogue({ openProduct, addToCart }) {
  const [products, setProducts] = useState([])
  const [types, setTypes] = useState([])
  const [type, setType] = useState('All')
  const [sort, setSort] = useState('popular')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTypes()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [type])

  const fetchTypes = async () => {
    try {
      const data = await getProductTypes()
      if (data.success && data.types?.length) {
        setTypes(data.types)
      }
    } catch (error) {
      setTypes([])
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getProducts(type)

      if (data.success) {
        setProducts((data.products || []).map(normalizeProduct))
        return
      }

      throw new Error(data.error || 'Unable to load products')
    } catch (error) {
      setProducts([])
      setError(error.message || 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  const sortedProducts = useMemo(() => {
    const list = [...products]

    if (sort === 'low') {
      return list.sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sort === 'high') {
      return list.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
  }, [products, sort])

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-7">
        <div className="mb-5 text-sm text-slate-400">
          Home <span className="px-2">/</span> Casual
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <FilterPanel types={types} activeType={type} setType={setType} />

          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Casual</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Showing {sortedProducts.length} active products
                </p>
              </div>

              <label className="flex w-full items-center justify-between gap-3 rounded-full border border-slate-200 px-4 py-2 text-sm sm:w-auto">
                <span className="text-slate-500">Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent font-semibold text-slate-950 outline-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </label>
            </div>

            <MobileTypeChips types={types} activeType={type} setType={setType} />

            {loading && <p className="py-8 text-slate-500">Loading products...</p>}
            {error && <p className="py-8 text-red-600">{error}</p>}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  openProduct={openProduct}
                  addToCart={addToCart}
                />
              ))}
            </div>

            {!loading && !error && sortedProducts.length === 0 && (
              <p className="py-8 text-slate-500">No products found.</p>
            )}
          </section>
        </div>
      </main>
      <NewsletterStrip />
      <Footer />
    </>
  )
}

export default ProductCatalogue
