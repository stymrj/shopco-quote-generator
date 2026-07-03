function MobileTypeChips({ types, activeType, setType }) {
  return (
    <div className="no-print mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
      {['All', ...types].map((item) => (
        <button
          key={item}
          onClick={() => setType(item)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${activeType === item ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default MobileTypeChips
