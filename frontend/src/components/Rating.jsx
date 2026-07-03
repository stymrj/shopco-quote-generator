function Rating({ rating, reviewCount }) {
  const value = Number(rating || 0)

  return (
    <div className="mt-2 flex items-center gap-2 text-sm">
      <span className="tracking-wide text-amber-400">★★★★★</span>
      <span className="font-medium text-slate-700">{value.toFixed(1)}/5</span>
      {reviewCount ? <span className="text-slate-400">({reviewCount})</span> : null}
    </div>
  )
}

export default Rating
