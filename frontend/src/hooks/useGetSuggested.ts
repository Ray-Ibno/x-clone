import { useQuery } from '@tanstack/react-query'
import fetchData from '../utils/api/fetchData'
import type { User } from '../types/user-model'
import useAuth from '../features/auth/hooks/useAuth'

const useGetSuggestedUsers = () => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['suggestedUsers', accessToken],
    queryFn: async () => {
      try {
        return fetchData<User[]>('/api/users/suggested', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    enabled: !!accessToken,
    retry: false,
  })
}

export default useGetSuggestedUsers
