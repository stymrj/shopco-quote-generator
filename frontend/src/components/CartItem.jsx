import { getImageUrl } from '../api'
import { formatCurrency } from '../utils/formatters'

function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="grid gap-4 border-b border-slate-100 py-4 last:border-b-0 sm:grid-cols-[96px_1fr_auto]">
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        className="h-24 w-24 rounded-lg bg-slate-100 object-contain"
      />
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-500">SKU: {item.sku || 'N/A'}</p>
            {item.selectedSize && <p className="text-sm text-slate-500">Size: {item.selectedSize}</p>}
          </div>
          <button onClick={() => removeFromCart(item._id)} className="text-lg font-bold text-red-500">×</button>
        </div>
        <p className="mt-2 text-lg font-bold">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
        <p className="font-bold">{formatCurrency(Number(item.price) * item.quantity)}</p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-full bg-slate-100 px-4 py-2">
          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="font-bold">-</button>
          <span className="font-semibold">{item.quantity}</span>
          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="font-bold">+</button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
