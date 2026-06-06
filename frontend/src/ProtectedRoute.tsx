import { Navigate, Outlet } from 'react-router-dom'
import LoadingSpinner from './components/common/LoadingSpinner'
import useGetUser from './hooks/useGetUser'
import useAuth from './features/auth/hooks/useAuth'

const ProtectedRoute = () => {
  const { accessToken, loading: isAuthLoading } = useAuth()
  const { data: authUser, isLoading } = useGetUser()

  if (isAuthLoading || (accessToken && isLoading)) {
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
