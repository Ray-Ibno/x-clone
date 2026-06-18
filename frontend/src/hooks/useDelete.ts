import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customFetch } from '../utils/api'

const useDelete = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch(`/api/posts/delete/${postId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data
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
