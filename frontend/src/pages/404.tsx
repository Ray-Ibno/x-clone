import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="absolute inset-0 bg-red-500 z-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-7xl text-black mb-5">NO PAGE FOUND</h1>
        <Link to={'/'} className="bg-black py-2 px-3 rounded-lg">
          Back to home
        </Link>
      </div>
      <img src="/404.jpg" alt="404 image" className="w-full h-full" />
    </div>
  )
}
export default NotFoundPage
