import { useQuery } from '@tanstack/react-query'
import fetchData from '../../../utils/api/fetchData'
import type { User } from '../../../types/user-model'
import useAuth from '../../auth/hooks/useAuth'

const useGetUserProfile = (username?: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      try {
        return fetchData<User>(`/api/users/profile/${username}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  })
}

export default useGetUserProfile
