import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useFetchApi from './useFetchApi'

const useDelete = (postId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi(`/api/posts/delete/${postId}`, {
          method: 'DELETE',
        })
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: () => {
      toast.success('Post deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })
}

export default useDelete
