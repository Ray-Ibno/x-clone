import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customFetch } from '../../../utils/api'
import { useAuthStore } from '../../../store/authStore'

type requestData = {
  email: string
  password: string
}

const useLogin = (requestData: requestData) => {
  const queryClient = useQueryClient()
  const { setAccessToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message)
        }

        const data = await response.json()
        setAccessToken(data.accessToken)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }

        throw error
      }
    },
    onSuccess: () => {
      toast.success('Logged in successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })
}

export default useLogin
