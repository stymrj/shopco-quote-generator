const colorSwatches = ['#16a34a', '#ef4444', '#f97316', '#0ea5e9', '#2563eb', '#9333ea', '#ec4899', '#111827']
const sizes = ['XS', 'S', 'M', 'L', 'XL']

function FilterPanel({ types, activeType, setType }) {
  return (
    <aside className="no-print hidden h-fit rounded-lg border border-slate-200 p-5 lg:block">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="font-bold">Filters</h2>
        <span className="text-sm text-slate-400">All</span>
      </div>

      <div className="space-y-2 border-b border-slate-100 pb-5">
        <button
          onClick={() => setType('All')}
          className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm ${activeType === 'All' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          All Types <span>›</span>
        </button>
        {types.map((item) => (
          <button
            key={item}
            onClick={() => setType(item)}
            className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm ${activeType === item ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {item} <span>›</span>
          </button>
        ))}
      </div>

      <div className="border-b border-slate-100 py-5">
        <h3 className="mb-4 font-bold">Price</h3>
        <div className="h-1 rounded-full bg-slate-200">
          <div className="h-1 w-3/4 rounded-full bg-slate-950" />
        </div>
        <div className="mt-3 flex justify-between text-sm font-semibold">
          <span>$50</span>
          <span>$300</span>
        </div>
      </div>

      <div className="border-b border-slate-100 py-5">
        <h3 className="mb-4 font-bold">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colorSwatches.map((color) => (
            <span
              key={color}
              className="h-7 w-7 rounded-full border border-slate-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="py-5">
        <h3 className="mb-4 font-bold">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full rounded-full bg-slate-950 py-3 text-sm font-bold text-white">
        Apply Filter
      </button>
    </aside>
  )
}

export default FilterPanel
