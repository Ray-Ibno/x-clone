import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useFetchApi from '../../../hooks/useFetchApi'

type requestData = {
  email: string
  password: string
}

const useLogin = (requestData: requestData) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi('/api/auth/login', {
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
      toast.success('Logged in successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })
}

export default useLogin
