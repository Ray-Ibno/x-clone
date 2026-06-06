import { Navigate, Outlet } from 'react-router-dom'
import LoadingSpinner from './components/common/LoadingSpinner'
import useGetUser from './hooks/useGetUser'

const PublicRoute = () => {
  const { data: authUser, isLoading } = useGetUser()

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (authUser) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
export default PublicRoute
