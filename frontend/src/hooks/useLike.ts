import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { POST } from '../types/post-model'
import toast from 'react-hot-toast'
import useFetchApi from './useFetchApi'

const useLike = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi<string[]>(`/api/posts/like/${postId}`, {
          method: 'POST',
        })
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: (updatedLikes: string[] | undefined) => {
      if (!updatedLikes) {
        return console.log('no updated likes received in useLike hook')
      }
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
