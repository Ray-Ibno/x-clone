import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { POST } from '../types/post-model'
import toast from 'react-hot-toast'

import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { feedTypeContext } from '../context/feedTypeContext'
import { customFetch } from '../utils/api'

const useLike = (postId: string, userId?: string) => {
  const queryClient = useQueryClient()
  const { username } = useParams()
  const feedType = useContext(feedTypeContext)

  const queryKey = ['posts', feedType, username]

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch(`/api/posts/like/${postId}`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()

        return data as string[]
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch Error:', error.message)
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
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

    onError: (error, _variables, context) => {
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
