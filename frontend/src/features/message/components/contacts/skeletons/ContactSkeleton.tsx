import FilterBtns from '../components/FilterBtns'
import Header from '../components/Header'

const ContactSkeleton = () => {
  const skeletonArr = Array(8).fill(null)

  return (
    <aside className="flex flex-col h-full w-9/12 lg:w-auto lg:min-w-[350px] border-r border-gray-700 px-4 transition-all duration-200">
      <Header />
      <FilterBtns />

      <div className="overflow-y-auto w-full py-3">
        {skeletonArr.map((_, id) => (
          <div key={id} className="w-full p-3 flex items-center gap-3">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
export default ContactSkeleton
