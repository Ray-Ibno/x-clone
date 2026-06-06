import { useEffect, useState } from 'react'
import fetchData from '../utils/api/fetchData'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setIsLoading] = useState(true)

  const login = (token: string) => setAccessToken(token)
  const signup = (token: string) => setAccessToken(token)
  const logout = () => setAccessToken(null)

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const data = await fetchData<{ accessToken: string }>('/api/auth/refresh', {
          method: 'POST',
        })

        if (data.accessToken) {
          setAccessToken(data.accessToken)
        }
      } catch (error) {
        console.error('Failed to refresh authentication', error)
      } finally {
        setIsLoading(false)
      }
    }

    refreshSession()
  }, [])

  return (
    <AuthContext.Provider value={{ accessToken, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
