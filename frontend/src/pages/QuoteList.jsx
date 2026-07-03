import { useEffect, useState } from 'react'
import { getQuotes } from '../api'
import { formatCurrency, formatDate } from '../utils/formatters'

function QuoteList({ openQuote, setPage }) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await getQuotes()
        if (data.success) {
          setQuotes(data.quotes || [])
          return
        }

        throw new Error(data.error || 'Unable to load quotes')
      } catch (error) {
        setError(error.message || 'Unable to load quotes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  return (
    <main className="mx-auto max-w-7xl px-4 py-7">
      <div className="mb-5 text-sm text-slate-400">
        Home <span className="px-2">/</span> Quotes
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Quote List</h1>
          <p className="mt-1 text-sm text-slate-500">All created quotes are shown here.</p>
        </div>
        <button onClick={() => setPage('cart')} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
          Open Cart
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Dealer</th>
              <th className="p-4">Created Date</th>
              <th className="p-4">Valid Till</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan="5">Loading quotes...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td className="p-8 text-center text-red-600" colSpan="5">{error}</td>
              </tr>
            )}

            {!loading && !error && quotes.map((quote) => (
              <tr
                key={quote._id}
                onClick={() => openQuote(quote._id)}
                className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4 font-semibold">{quote.subject}</td>
                <td className="p-4">{quote.dealer}</td>
                <td className="p-4">{formatDate(quote.createdAt)}</td>
                <td className="p-4">{formatDate(quote.validTill)}</td>
                <td className="p-4 text-right font-bold">{formatCurrency(quote.total)}</td>
              </tr>
            ))}

            {!loading && !error && quotes.length === 0 && (
              <tr>
                <td className="p-8 text-center text-slate-500" colSpan="5">
                  No quotes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default QuoteList
