import { useMemo, useState } from 'react'
import { createQuote } from '../api'
import CartItem from '../components/CartItem'
import Footer from '../components/Footer'
import NewsletterStrip from '../components/NewsletterStrip'
import SummaryRow from '../components/SummaryRow'
import { formatCurrency, toDateInputValue } from '../utils/formatters'

function CartPage({ cart, setPage, updateQuantity, removeFromCart, clearCart, openQuote }) {
  const defaultValidDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 15)
    return toDateInputValue(date)
  }, [])

  const [subject, setSubject] = useState(`QUOTE-${Date.now().toString().slice(-6)}`)
  const [dealer, setDealer] = useState('Jack Due')
  const [validTill, setValidTill] = useState(defaultValidDate)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const discount = 0
  const delivery = 0
  const total = subtotal - discount + delivery

  const handleCreateQuote = async () => {
    if (!cart.length) return

    try {
      setLoading(true)
      setMessage('')

      const quotePayload = {
        subject,
        dealer,
        validTill,
        items: cart,
      }

      const data = await createQuote(quotePayload)

      if (data.success && data.quote) {
        clearCart()
        openQuote(data.quote._id)
        return
      }

      throw new Error(data.error || 'Quote create failed')
    } catch (err) {
      setMessage(err.message || 'Quote create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-7">
        <div className="mb-5 text-sm text-slate-400">
          Home <span className="px-2">/</span> Cart
        </div>
        <h1 className="mb-6 text-3xl font-black tracking-tight">YOUR CART</h1>

        {cart.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-10 text-center">
            <p className="mb-5 text-slate-500">Your cart is empty.</p>
            <button onClick={() => setPage('products')} className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <section className="rounded-lg border border-slate-200 p-5">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </section>

            <aside className="h-fit rounded-lg border border-slate-200 p-5">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} muted />
              <SummaryRow label="Delivery Fee" value={formatCurrency(delivery)} />
              <SummaryRow label="Total" value={formatCurrency(total)} strong />

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-600">Subject</span>
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-600">Dealer</span>
                  <input
                    value={dealer}
                    onChange={(event) => setDealer(event.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-600">Valid Till</span>
                  <input
                    type="date"
                    value={validTill}
                    onChange={(event) => setValidTill(event.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-slate-950"
                  />
                </label>
              </div>

              {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

              <button
                onClick={handleCreateQuote}
                disabled={loading}
                className="mt-5 w-full rounded-full bg-slate-950 py-3 font-bold text-white disabled:opacity-60"
              >
                {loading ? 'Creating Quote...' : 'Create Quote'}
              </button>
            </aside>
          </div>
        )}
      </main>
      <NewsletterStrip />
      <Footer />
    </>
  )
}

export default CartPage
