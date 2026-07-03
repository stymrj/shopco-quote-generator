import { formatCurrency } from '../utils/formatters'

function PriceLine({ product, large = false }) {
  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 ${large ? 'text-3xl' : 'text-xl'}`}>
      <span className="font-black">{formatCurrency(product.price)}</span>
      {product.compareAtPrice ? (
        <span className="font-bold text-slate-300 line-through">
          {formatCurrency(product.compareAtPrice)}
        </span>
      ) : null}
      {product.discount ? (
        <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
          -{product.discount}%
        </span>
      ) : null}
    </div>
  )
}

export default PriceLine
