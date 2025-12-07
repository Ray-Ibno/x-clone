import { useMutation, useQueryClient } from '@tanstack/react-query'
import useFetchApi from './useFetchApi'
import toast from 'react-hot-toast'

const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi('/api/notifications', {
          method: 'DELETE',
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
