import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import fetchData from '../../../utils/api/fetchData'

type RequestData = {
  email: string
  username: string
  fullName: string
  password: string
  passwordRepeat: string
}

const useSignUp = (requestData: RequestData) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return fetchData('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
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
      toast.success('Signed up successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })
}

export default useSignUp
