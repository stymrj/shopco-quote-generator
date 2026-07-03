import { useState } from 'react'
import { loginUser, signupUser } from '../api'

function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      const payload = isLogin
        ? { email, password }
        : { name, email, password }

      const data = isLogin
        ? await loginUser(payload)
        : await signupUser(payload)

      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }

      onAuthSuccess(data.user)
    } catch (error) {
      setMessage(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_480px]">
        <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-3xl font-black tracking-tight">SHOP.CO</p>
            <div className="mt-24 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-lime-300">
                Catalogue
              </p>
              <h1 className="mt-4 text-5xl font-black leading-tight">
                Shop products and make quotes.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Login to check products, add them to cart and create a quote.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Product catalogue
          </p>
        </section>

        <section className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <p className="text-3xl font-black tracking-tight">SHOP.CO</p>
              <p className="mt-2 text-sm text-slate-500">
                Login to continue.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                  {isLogin ? 'Login' : 'Signup'}
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {isLogin ? 'Login' : 'Create account'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-slate-600">Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-slate-950"
                      placeholder="Enter your name"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-600">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-slate-950"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-600">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength="6"
                    className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-slate-950"
                    placeholder="Enter password"
                  />
                </label>

                {message && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                    {message}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-full bg-slate-950 py-3 font-bold text-white disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
                </button>
              </form>

              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMessage('')
                }}
                className="mt-5 w-full text-sm font-semibold text-slate-600 hover:text-slate-950"
              >
                {isLogin ? 'New user? Create account' : 'Already have account? Login'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthPage
