const FilterBtns = () => {
  return (
    <div className="flex gap-2 py-4">
      <button className="flex items-center py-4 text-black btn-sm rounded-full bg-white px-4 h-8">
        All
      </button>
      <button className="flex items-center py-4 btn-sm rounded-full border border-zinc-700 px-4 h-8">
        Requests
      </button>
    </div>
  )
}
export default FilterBtns
