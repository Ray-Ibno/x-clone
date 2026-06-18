import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { POST } from '../../../types/post-model'
import { customFetch } from '../../../utils/api'

type PostData = {
  text: string
  img?: string | null
}

const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: PostData) => {
      try {
        const response = await customFetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()

        return data as POST
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
