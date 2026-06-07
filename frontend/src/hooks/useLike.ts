import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { POST } from '../types/post-model'
import toast from 'react-hot-toast'
import fetchData from '../utils/api/fetchData'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { feedTypeContext } from '../context/feedTypeContext'
import useAuth from '../features/auth/hooks/useAuth'

const useLike = (postId: string, userId?: string) => {
  const queryClient = useQueryClient()
  const { username } = useParams()
  const feedType = useContext(feedTypeContext)
  const { accessToken } = useAuth()

  const queryKey = ['posts', feedType, username]

  return useMutation({
    mutationFn: async () => {
      return fetchData<string[]>(`/api/posts/like/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousPosts = queryClient.getQueryData<POST[]>(queryKey)

      queryClient.setQueryData(queryKey, (oldData: POST[]) => {
        if (!userId) return
        return oldData?.map((post) => {
          if (post._id !== postId) return post

          const liked = post.likes.includes(userId)
          const newLikes = liked
            ? post.likes.filter((like) => like !== userId)
            : [...post.likes, userId]

          return { ...post, likes: newLikes }
        })
      })

      return { previousPosts }
    },

    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(queryKey, context.previousPosts)
      }

      toast.error(error.message)
    },
    onSuccess: (updatedLikes: string[] | undefined) => {
      if (!updatedLikes) return
      queryClient.setQueryData(queryKey, (oldData: POST[]) => {
        return oldData?.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post,
        )
      })
    },
  })
}
export default useLike
