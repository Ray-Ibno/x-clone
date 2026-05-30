import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner'

import { lazy } from 'react'

import useGetUser from './hooks/useGetUser'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import ErrorFallback from './components/ErrorFallback'

import LazyRoute from './components/common/LazyRoute'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'

const NotificationPage = lazy(() => import('./pages/notification/NotificationPage'))
const ChatPage = lazy(() => import('./pages/chat/ChatPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))

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
      <main className="flex max-w-6xl mx-auto font-display">
        {authUser && <Sidebar />}

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
          <Route
            path="/notifications"
            element={
              authUser ? <LazyRoute component={NotificationPage} /> : <Navigate to={'/login'} />
            }
          />
          <Route
            path="/chat/:id?"
            element={authUser ? <LazyRoute component={ChatPage} /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <LazyRoute component={ProfilePage} /> : <Navigate to={'/login'} />}
          />
        </Routes>

        {authUser && !/^\/chat(\/[^/]+)?\/?$/.test(location.pathname) && <RightPanel />}
        <Toaster />
      </main>
    </ErrorBoundary>
  )
}

export default App
