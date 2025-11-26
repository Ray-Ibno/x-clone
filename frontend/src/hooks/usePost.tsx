import { useMutation, useQueryClient } from '@tanstack/react-query'

type UserData = {
  email?: string
  username?: string
  fullName?: string
  password?: string
}

type Route = 'login' | 'signup'

const usePostMutate = (route: Route) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: UserData) => {
      try {
        const res = await fetch(`/api/auth/${route}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
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
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })
}

export default usePostMutate
