import { Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

const LazyRoute = ({ component: Component }: { component: React.FC }) => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}
export default LazyRoute
