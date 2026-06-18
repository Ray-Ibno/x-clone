import { useAuthStore } from '../../store/authStore'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export const customFetch = async (url: string, options: FetchOptions = {}) => {
  const { accessToken, setAccessToken } = useAuthStore.getState()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  }

  let response = await fetch(url, config)

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const newToken = data.accessToken

        setAccessToken(newToken)

        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, { ...config, headers })
      } else {
        setAccessToken(null)
      }
    } catch (error) {
      console.error('Failed to automatically refresh token', error)
      setAccessToken(null)
    }
  }

  return response
}
