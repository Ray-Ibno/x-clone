import { useQuery } from '@tanstack/react-query'

const useGetUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user')
        const data = await res.json()
        if (data.error) return null //fix for not redirecting to loginPage after logout. Find a better solution later..
        return data
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch Error:', error.message)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    retry: false,
  })
}

export default useGetUser
