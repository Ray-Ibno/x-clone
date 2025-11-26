import { useQuery } from '@tanstack/react-query'

const useGet = (key: string, endpoint: string) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const res = await fetch(endpoint)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }

        return data
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    retry: false,
  })
}

export default useGet
