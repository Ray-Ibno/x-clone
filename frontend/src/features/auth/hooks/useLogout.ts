import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customFetch } from '../../../utils/api'
import { useAuthStore } from '../../../store/authStore'

const useLogout = () => {
  const queryClient = useQueryClient()
  const { resetAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch('/api/auth/logout', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }
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
      queryClient.setQueryData(['authUser'], null)
      queryClient.clear() //Clears all queries in cache
      resetAuth()
    },
    onError: () => {
      toast.error('Logout unsuccessful')
    },
  })
}

export default useLogout
