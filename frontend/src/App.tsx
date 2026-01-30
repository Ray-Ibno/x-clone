import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner'

import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import ChatPage from './pages/chat/ChatPage'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import ErrorFallback from './components/ErrorFallback'

import useGetUser from './hooks/useGetUser'

function App() {
  const { data: authUser, isLoading } = useGetUser()

  const location = useLocation()

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex max-w-6xl mx-auto font-display">
        {authUser && <Sidebar />}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />}
          />
          <Route path="/chat/:id?" element={authUser ? <ChatPage /> : <Navigate to={'/login'} />} />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
          />
        </Routes>
        {authUser && !/^\/chat(\/[^/]+)?\/?$/.test(location.pathname) && <RightPanel />}
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
