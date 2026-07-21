import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'

import type { User } from '../../../types/user-model'
import { customFetch } from '../../../utils/api'
import { useAuthStore } from '../../../store/authStore'

type RequestData = {
  email: string
  username: string
  fullName: string
  password: string
  passwordRepeat: string
}

const useSignUp = (requestData: RequestData) => {
  const queryClient = useQueryClient()
  const { setAccessToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch('/api/auth/signup', {
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

        return data as User
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
      toast.success('Signed up successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })
}

export default useSignUp
