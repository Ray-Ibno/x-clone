import { useQuery } from '@tanstack/react-query'

const useGetUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }

        return data
      } catch (error) {
        throw error
      }
    },
    retry: false,
  })
}

export default useGetUser
