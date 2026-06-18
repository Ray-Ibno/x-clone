import { useQuery } from '@tanstack/react-query'
import { customFetch } from '../../../utils/api'

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
        const response = await customFetch('/api/notifications', {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data as Notification
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
