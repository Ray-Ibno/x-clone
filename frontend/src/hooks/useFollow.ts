import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import fetchData from '../utils/api/fetchData'
import useAuth from '../features/auth/hooks/useAuth'

interface ApiResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    message: string
  }
}

const useFollow = (id: string | undefined) => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        return fetchData<ApiResponse>(`/api/users/follow/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        })
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
