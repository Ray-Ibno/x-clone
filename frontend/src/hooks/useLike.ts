import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { POST } from '../types/post-model'
import toast from 'react-hot-toast'
import fetchData from '../utils/api/fetchData'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { feedTypeContext } from '../context/feedTypeContext'

const useLike = (postId: string) => {
  const queryClient = useQueryClient()
  const { username } = useParams()
  const feedType = useContext(feedTypeContext)

  return useMutation({
    mutationFn: async () => {
      try {
        return fetchData<string[]>(`/api/posts/like/${postId}`, {
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
      queryClient.setQueryData(['posts', feedType, username], (oldData: POST[]) => {
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
