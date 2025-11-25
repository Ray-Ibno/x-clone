import { useQuery } from '@tanstack/react-query'

const useGetPosts = (endpoint: string | undefined) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/${endpoint}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Something went wrong')

        return data
      } catch (error) {
        if (error instanceof Error) {
          throw error
        } else {
          throw Error('An unknown error occured')
        }
      }
    },
    retry: false,
  })
}

export default useGetPosts
