import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import fetchData from '../../.././utils/api/fetchData'
import type { POST } from '../../../types/post-model'

type PostData = {
  text: string
  img?: string | null
}

const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: PostData) => {
      try {
        return fetchData<POST>('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: () => {
      toast.success('Post created successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export default useCreatePost
