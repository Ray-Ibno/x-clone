import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const useFollow = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/follow/${id}`, {
          method: 'POST',
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(
            `HTTP error! Status: ${res.status}, Message: ${
              errorData.message || res.statusText
            }`
          )
        }
        const data = await res.json()
        return data
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: ({ message }) => {
      Promise.all([
        ['authUser', 'suggestedUsers'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        ),
      ])
      toast.success(message)
    },
  })
}

export default useFollow
