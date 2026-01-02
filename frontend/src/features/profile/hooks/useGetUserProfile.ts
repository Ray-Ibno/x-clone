import { useQuery } from '@tanstack/react-query'
import fetchData from '../../../utils/api/fetchData'
import type { User } from '../../../types/user-model'

const useGetUserProfile = (username?: string) => {
  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      try {
        return fetchData<User>(`/api/users/profile/${username}`)
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
