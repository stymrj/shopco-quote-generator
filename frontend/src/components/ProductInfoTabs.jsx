import Rating from './Rating'

function ProductInfoTabs({ product }) {
  const specs = [
    ['SKU', product.sku || 'N/A'],
    ['Model', product.modelName || 'N/A'],
    ['Type', product.type || 'Goods'],
    ['Unit', product.unit || 'Pcs'],
    ['Status', product.status || 'Active'],
    ['Stock', product.stock ?? 'Available'],
  ]

  const reviews = [
    ['Sarah M.', 'Nice product and good fitting.', 5],
    ['Alex K.', 'Looks good for the price.', 4.5],
  ]

  return (
    <section className="py-8">
      <div className="grid grid-cols-3 border-b border-slate-100 text-center text-sm font-semibold text-slate-500">
        <span className="pb-4">Product Details</span>
        <span className="border-b-2 border-slate-950 pb-4 text-slate-950">Rating & Reviews</span>
        <span className="pb-4">FAQs</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-bold">Product Details</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="rounded-md bg-slate-50 p-3">
                <span className="block text-slate-500">{label}</span>
                <span className="font-semibold text-slate-950">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">All Reviews</h3>
            <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Add Review
            </button>
          </div>
          <div className="grid gap-3">
            {reviews.map(([name, review, rating]) => (
              <div key={name} className="rounded-lg border border-slate-100 p-4">
                <Rating rating={rating} />
                <p className="mt-2 font-semibold">{name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfoTabs
