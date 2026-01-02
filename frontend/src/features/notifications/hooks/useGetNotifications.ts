import { useQuery } from '@tanstack/react-query'
import fetchData from '../../../utils/api/fetchData'

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
        return fetchData<Notification>('/api/notifications')
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
