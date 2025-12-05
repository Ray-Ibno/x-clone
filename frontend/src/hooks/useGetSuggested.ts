import { useQuery } from '@tanstack/react-query'
import useFetchApi from './useFetchApi'
import type { User } from '../types/user-model'

const useGetSuggestedUsers = () => {
  return useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        return useFetchApi<User[]>('/api/users/suggested')
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    retry: false,
  })
}

export default useGetSuggestedUsers
