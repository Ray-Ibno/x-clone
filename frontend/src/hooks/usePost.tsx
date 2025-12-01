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

const usePost = (keys: string[], route: string, toastMessage?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestData: RequestDataProp) => {
      try {
        //conditional operator for the headers and body
        const res = requestData
          ? await fetch(route, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            })
          : await fetch(route, {
              method: 'POST',
            })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Something went wrong')

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
      //Promise.all improves speed and performance
      Promise.all([
        keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ])
      toastMessage && toast.success(toastMessage)
    },
  })
}

export default usePost
