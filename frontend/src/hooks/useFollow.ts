import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customFetch } from '../utils/api'

interface ApiResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    message: string
  }
}

const useFollow = (id: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch(`/api/users/follow/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data as ApiResponse
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: (data) => {
      Promise.all([
        ['authUser', 'suggestedUsers'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      ])

      const message = data ? data.message : ''

      toast.success(message)
    },
  })
}

export default useFollow
