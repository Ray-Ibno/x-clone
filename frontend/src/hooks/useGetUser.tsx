import { useQuery } from '@tanstack/react-query'

const useGetUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user')
        const data = await res.json()
        if (data.error) return null
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        console.log('Logged in user:', data)
        return data
      } catch (error) {
        throw error
      }
    },
    retry: false,
  })
}

export default useGetUser
