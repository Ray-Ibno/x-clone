import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Something went wrong')
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
