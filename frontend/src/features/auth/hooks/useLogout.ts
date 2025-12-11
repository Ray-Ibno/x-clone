import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useFetchApi from '../../../hooks/useFetchApi'

const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        return useFetchApi('/api/auth/logout', {
          method: 'POST',
        })
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: () => {
      toast.success('Logged out successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: () => {
      toast.error('Logout unsuccessful')
    },
  })
}

export default useLogout
