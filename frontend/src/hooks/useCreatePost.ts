import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type PostData = {
  text: string
  img?: string | null
}

const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: PostData) => {
      try {
        const res = await fetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(
            `HTTP error! Status: ${res.status}, Message: ${
              errorData.message || res.statusText
            }`
          )
        }

        const data = await res.json()
        return data
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
