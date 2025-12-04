import { useQuery } from '@tanstack/react-query'

const useGetSuggestedUsers = () => {
  return useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/users/suggested')
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
    retry: false,
  })
}

export default useGetSuggestedUsers
