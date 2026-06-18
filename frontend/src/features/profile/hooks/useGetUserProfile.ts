import { useQuery } from '@tanstack/react-query'
import type { User } from '../../../types/user-model'
import { customFetch } from '../../../utils/api'

const useGetUserProfile = (username?: string) => {
  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      try {
        const response = await customFetch(`/api/users/profile/${username}`, {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data as User
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
