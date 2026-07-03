const footerColumns = [
  ['Company', 'About', 'Contact', 'Products', 'Quotes'],
  ['Help', 'Support', 'Delivery', 'Terms', 'Privacy'],
  ['Account', 'Profile', 'Cart', 'Orders', 'Payments'],
  ['More', 'Products', 'Categories', 'Offers', 'Brands'],
]

function Footer() {
  return (
    <footer className="no-print mt-10 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <h2 className="text-2xl font-black">SHOP.CO</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Simple product catalogue with cart and quote print option.
          </p>
        </div>

        {footerColumns.map(([title, ...links]) => (
          <div key={title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">{title}</h3>
            <div className="space-y-3 text-sm text-slate-500">
              {links.map((link) => <p key={link}>{link}</p>)}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}

export default Footer
