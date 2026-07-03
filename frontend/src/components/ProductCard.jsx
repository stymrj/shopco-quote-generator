import { getImageUrl } from '../api'
import PriceLine from './PriceLine'
import Rating from './Rating'

function ProductCard({ product, openProduct, addToCart }) {
  return (
    <article className="group rounded-lg border border-transparent bg-white transition hover:border-slate-200">
      <button
        onClick={() => openProduct(product._id)}
        className="block w-full overflow-hidden rounded-lg bg-slate-100"
      >
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="aspect-[4/4.2] w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </button>

      <div className="pt-4">
        <button
          onClick={() => openProduct(product._id)}
          className="line-clamp-2 min-h-12 text-left text-base font-bold leading-tight text-slate-950"
        >
          {product.name}
        </button>
        <Rating rating={product.rating || 4.5} reviewCount={product.reviewCount || 45} />
        <PriceLine product={product} />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => openProduct(product._id)}
            className="rounded-full border border-slate-200 py-2 text-sm font-semibold hover:border-slate-950"
          >
            View
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            className="rounded-full bg-slate-950 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
