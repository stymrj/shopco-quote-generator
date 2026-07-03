function Navbar({ cart, currentPage, setPage, user, handleLogout }) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { id: 'products', label: 'Shop' },
    { id: 'quotes', label: 'Quotes' },
  ]

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
        <button
          onClick={() => setPage('products')}
          className="text-2xl font-black tracking-tight text-slate-950"
        >
          SHOP.CO
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={currentPage === item.id ? 'text-slate-950' : 'hover:text-slate-950'}
            >
              {item.label}
            </button>
          ))}
          <span>On Sale</span>
          <span>New Arrivals</span>
          <span>Brands</span>
        </nav>

        <div className="ml-auto hidden min-w-0 flex-1 max-w-sm items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 lg:flex">
          <span className="mr-2">Search</span>
          <span className="truncate">Search for products...</span>
        </div>

        <button
          onClick={() => setPage('cart')}
          className="relative rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 hover:border-slate-950"
        >
          Cart
          <span className="ml-2 rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
            {cartCount}
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <span className="max-w-32 truncate text-sm text-slate-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
