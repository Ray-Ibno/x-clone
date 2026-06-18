import { useQuery } from '@tanstack/react-query'
import type { User } from '../types/user-model'
import { customFetch } from '../utils/api'

const useGetUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await customFetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()

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
    retry: false,
    staleTime: Infinity,
  })
}

export default useGetUser
