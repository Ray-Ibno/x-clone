import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import fetchData from '../../../utils/api/fetchData'
import useAuth from '../../auth/hooks/useAuth'

const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async () => {
      try {
        return fetchData('/api/notifications', {
          method: 'DELETE',
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
    onSuccess: () => {
      toast.success('Deleted notifications succesfully')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export default useDeleteNotification
