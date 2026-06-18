import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import { customFetch } from '../../../utils/api'

const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch('/api/notifications', {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data
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
