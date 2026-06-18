import { Routes, Route, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Toaster } from 'react-hot-toast'

import { lazy } from 'react'

import useGetUser from './hooks/useGetUser'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import ErrorFallback from './components/ErrorFallback'

import LazyRoute from './components/common/LazyRoute'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import NotFoundPage from './pages/404'

const NotificationPage = lazy(() => import('./pages/notification/NotificationPage'))
const ChatPage = lazy(() => import('./pages/chat/ChatPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))

function App() {
  const { data: authUser } = useGetUser()

  const location = useLocation()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <main className="flex max-w-6xl mx-auto font-display">
        {authUser && <Sidebar />}

        <Routes>
          {/* Guest Route */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          {/* Private Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/notifications" element={<LazyRoute component={NotificationPage} />} />
            <Route path="/chat/:id?" element={<LazyRoute component={ChatPage} />} />
            <Route path="/profile/:username" element={<LazyRoute component={ProfilePage} />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {authUser && !/^\/chat(\/[^/]+)?\/?$/.test(location.pathname) && <RightPanel />}
        <Toaster />
      </main>
    </ErrorBoundary>
  )
}

export default App
