import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import fetchData from '../../../utils/api/fetchData'
import useAuth from './useAuth'

const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout } = useAuth()

  return useMutation({
    mutationFn: async () => {
      logout()
      try {
        return fetchData('/api/auth/logout', {
          method: 'POST',
        })
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
        throw error
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
