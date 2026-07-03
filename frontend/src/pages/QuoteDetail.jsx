import { useEffect, useState } from 'react'
import { getImageUrl, getQuoteById } from '../api'
import SummaryRow from '../components/SummaryRow'
import { formatCurrency, formatDate } from '../utils/formatters'

function QuoteDetail({ quoteId, setPage }) {
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = quoteId ? await getQuoteById(quoteId) : { success: false }

        if (data.success && data.quote) {
          setQuote(data.quote)
          return
        }

        throw new Error(data.error || 'Quote not found')
      } catch (err) {
        setError(err.message || 'Quote not found')
      }
    }

    fetchQuote()
  }, [quoteId])

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <button onClick={() => setPage('quotes')} className="mb-5 text-sm font-semibold text-slate-500 hover:text-slate-950">
          ← Back to Quotes
        </button>
        <p className="rounded-lg border border-slate-200 p-8 text-center text-slate-500">{error}</p>
      </main>
    )
  }

  if (!quote) {
    return <p className="mx-auto max-w-5xl px-4 py-8 text-slate-500">Loading quote...</p>
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-7">
      <div className="no-print mb-5 flex justify-between">
        <button onClick={() => setPage('quotes')} className="text-sm font-semibold text-slate-500 hover:text-slate-950">
          ← Back to Quotes
        </button>
        <button onClick={() => window.print()} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white">
          Print Quote
        </button>
      </div>

      <div className="print-box overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 bg-slate-950 p-8 text-white md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">SHOP.CO</p>
            <h1 className="mt-2 text-4xl font-black">QUOTE</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Quote details for selected products.
            </p>
          </div>
          <div className="text-sm md:text-right">
            <p><span className="text-slate-400">Subject:</span> {quote.subject}</p>
            <p><span className="text-slate-400">Dealer:</span> {quote.dealer}</p>
            <p><span className="text-slate-400">Quote Date:</span> {formatDate(quote.createdAt)}</p>
            <p><span className="text-slate-400">Valid Till:</span> {formatDate(quote.validTill)}</p>
          </div>
        </div>

        <div className="p-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-lime-200 text-slate-950">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={`${item.name}-${index}`} className="border-b border-slate-100">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={getImageUrl(item.image)} alt={item.name} className="h-12 w-12 rounded-md bg-slate-100 object-contain" />
                      )}
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-slate-500">SKU: {item.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-sm">
              <SummaryRow label="Subtotal" value={formatCurrency(quote.subtotal)} />
              <SummaryRow label="Tax" value={formatCurrency(0)} />
              <SummaryRow label="Grand Total" value={formatCurrency(quote.total)} strong />
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-slate-100 pt-6 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <p className="font-bold text-slate-950">Payment Method</p>
              <p className="mt-2">Cash / Bank Transfer</p>
            </div>
            <div className="md:text-right">
              <p className="font-bold text-slate-950">Terms and Conditions</p>
              <p className="mt-2">Quote is valid till the date mentioned above.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default QuoteDetail
