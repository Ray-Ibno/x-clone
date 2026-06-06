import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import fetchData from '../utils/api/fetchData'
import useAuth from '../features/auth/hooks/useAuth'

const useDelete = (postId: string) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async () => {
      try {
        return fetchData(`/api/posts/delete/${postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
