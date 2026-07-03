function NewsletterStrip() {
  return (
    <section className="no-print mx-auto max-w-7xl px-4">
      <div className="grid gap-4 rounded-lg bg-slate-950 px-6 py-7 text-white md:grid-cols-[1fr_360px] md:items-center">
        <h2 className="text-2xl font-black leading-tight md:text-3xl">
          GET UPDATES ABOUT NEW PRODUCTS
        </h2>
        <div className="space-y-3">
          <input
            className="w-full rounded-full px-4 py-3 text-sm text-slate-950 outline-none"
            placeholder="Email address"
          />
          <button className="w-full rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-950">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewsletterStrip
