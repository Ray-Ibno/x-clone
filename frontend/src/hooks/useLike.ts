import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { POST } from '../types/post-model'
import toast from 'react-hot-toast'

const useLike = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${postId}`, {
          method: 'POST',
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
    onSuccess: (updatedLikes: string[]) => {
      queryClient.setQueryData(['posts'], (oldData: POST[]) => {
        return oldData?.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
export default useLike
