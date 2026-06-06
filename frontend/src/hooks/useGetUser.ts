import { useQuery } from '@tanstack/react-query'
import type { User } from '../types/user-model'
import useAuth from '../features/auth/hooks/useAuth'

const useGetUser = () => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['authUser', accessToken],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        })

        if (!res.ok) {
          throw new Error(res.status.toString())
        }

        const data = await res.json()

        return data as User
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch Error:', error.message)
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    enabled: !!accessToken,
    retry: false,
    staleTime: Infinity,
  })
}

export default useGetUser
