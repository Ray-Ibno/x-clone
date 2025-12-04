import { useMutation, useQueryClient } from '@tanstack/react-query'
import useFetchApi from './useFetchApi'
import toast from 'react-hot-toast'
import type { POST } from '../types/post-model'

const useCreateComment = (
  postId: string,
  text: string,
  success: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi<POST['comments']>(`/api/posts/comment/${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unkown error occured')
        }
      }
    },
    onSuccess: (updatedComments: POST['comments'] | undefined) => {
      toast.success('Comment added')
      queryClient.setQueryData(['posts'], (oldData: POST[]) => {
        return oldData.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      })
      success()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export default useCreateComment
