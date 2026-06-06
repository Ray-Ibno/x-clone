import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import fetchData from '../../../utils/api/fetchData'

import type { User } from '../../../types/user-model'
import useAuth from './useAuth'

type requestData = {
  email: string
  password: string
}

const useLogin = (requestData: requestData) => {
  const queryClient = useQueryClient()
  const { login } = useAuth()

  return useMutation({
    mutationFn: async () => {
      try {
        const data = await fetchData<User>('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        login(data.accessToken)
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
