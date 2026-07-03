function SummaryRow({ label, value, strong = false, muted = false }) {
  return (
    <div className={`flex justify-between py-2 ${strong ? 'border-t border-slate-100 pt-4 text-xl font-black' : ''}`}>
      <span className={muted ? 'text-red-500' : 'text-slate-500'}>{label}</span>
      <span className={muted ? 'font-bold text-red-500' : 'font-bold text-slate-950'}>{value}</span>
    </div>
  )
}

export default SummaryRow
