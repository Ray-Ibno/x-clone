import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import fetchData from '../../../utils/api/fetchData'
import type { User } from '../../../types/user-model'
import useAuth from './useAuth'

type RequestData = {
  email: string
  username: string
  fullName: string
  password: string
  passwordRepeat: string
}

const useSignUp = (requestData: RequestData) => {
  const queryClient = useQueryClient()
  const { signup } = useAuth()

  return useMutation({
    mutationFn: async () => {
      try {
        const data = await fetchData<User>('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        signup(data.accessToken)
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
