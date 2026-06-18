import { Navigate, Outlet } from 'react-router-dom'
import LoadingSpinner from './components/common/LoadingSpinner'
import useGetUser from './hooks/useGetUser'

const ProtectedRoute = () => {
  const { data: authUser, isLoading } = useGetUser()

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!authUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
export default ProtectedRoute
