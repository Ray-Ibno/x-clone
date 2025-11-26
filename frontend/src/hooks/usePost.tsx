import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type RequestDataProp = {
  email?: string
  username?: string
  fullName?: string
  password?: string
  img?: string | null
  text?: string
}

const usePost = (key: string, route: string, toastMessage: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestData: RequestDataProp) => {
      try {
        const res = await fetch(route, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Something went wrong')
        console.log(data)
        return data
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] })
      toast.success(toastMessage)
    },
  })
}

export default usePost
