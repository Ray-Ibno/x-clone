import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const useDelete = (postId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${postId}`, {
          method: 'DELETE',
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Something went wrong')
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
