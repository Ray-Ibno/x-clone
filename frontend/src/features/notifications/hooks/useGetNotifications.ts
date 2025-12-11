import { useQuery } from '@tanstack/react-query'
import useFetchApi from '../../../hooks/useFetchApi'

type Notification = {
  _id: string
  from: {
    _id: string
    username: string
    profileImg: string
  }
  type: 'follow' | 'like'
}[]

const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        return useFetchApi<Notification>('/api/notifications')
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

export default useGetNotifications
