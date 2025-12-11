import { useQuery } from '@tanstack/react-query'
import useFetchApi from '../../../hooks/useFetchApi'
import type { User } from '../../../types/user-model'

const useGetUserProfile = (username?: string) => {
  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      try {
        return useFetchApi<User>(`/api/users/profile/${username}`)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
  })
}

export default useGetUserProfile
