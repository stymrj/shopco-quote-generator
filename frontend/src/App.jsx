import { useEffect, useState } from 'react'
import { getLoggedInUser, logoutUser } from './api'
import AuthPage from './components/AuthPage'
import Navbar from './components/Navbar'
import CartPage from './pages/CartPage'
import ProductCatalogue from './pages/ProductCatalogue'
import ProductDetail from './pages/ProductDetail'
import QuoteDetail from './pages/QuoteDetail'
import QuoteList from './pages/QuoteList'
import { getSavedCart } from './utils/cartStorage'
import { normalizeProduct } from './utils/productHelpers'

function App() {
  const [page, setPage] = useState('products')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [page, selectedProductId, selectedQuoteId])

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`shopco_cart_${user._id}`, JSON.stringify(cart))
    }
  }, [cart, user])

  const checkLogin = async () => {
    try {
      const data = await getLoggedInUser()

      if (data.success) {
        setUser(data.user)
        setCart(getSavedCart(data.user._id))
        return
      }
    } catch (error) {
      setUser(null)
      setCart([])
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    setCart(getSavedCart(loggedInUser._id))
    setPage('products')
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      // Session may already be expired.
    }

    setUser(null)
    setCart([])
    setPage('products')
  }

  const openProduct = (id) => {
    setSelectedProductId(id)
    setPage('detail')
  }

  const openQuote = (id) => {
    setSelectedQuoteId(id)
    setPage('quote-detail')
  }

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product)
    const id = normalizedProduct._id

    setCart((oldCart) => {
      const alreadyAdded = oldCart.find((item) => item._id === id)

      if (alreadyAdded) {
        return oldCart.map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...oldCart, { ...normalizedProduct, quantity }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return

    setCart((oldCart) =>
      oldCart.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCart((oldCart) => oldCart.filter((item) => item._id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm font-medium text-slate-500">Loading SHOP.CO...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar
        cart={cart}
        currentPage={page}
        setPage={setPage}
        user={user}
        handleLogout={handleLogout}
      />

      {page === 'products' && (
        <ProductCatalogue openProduct={openProduct} addToCart={addToCart} />
      )}

      {page === 'detail' && (
        <ProductDetail
          productId={selectedProductId}
          setPage={setPage}
          openProduct={openProduct}
          addToCart={addToCart}
        />
      )}

      {page === 'cart' && (
        <CartPage
          cart={cart}
          setPage={setPage}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          openQuote={openQuote}
        />
      )}

      {page === 'quotes' && <QuoteList openQuote={openQuote} setPage={setPage} />}

      {page === 'quote-detail' && (
        <QuoteDetail quoteId={selectedQuoteId} setPage={setPage} />
      )}
    </div>
  )
}

export default App
