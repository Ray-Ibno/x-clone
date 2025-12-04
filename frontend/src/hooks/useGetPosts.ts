import { useQuery } from '@tanstack/react-query'

const useGetPosts = (feedType?: string, userId?: string) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/api/posts/all'
      case 'following':
        return '/api/posts/following'
      case 'likes':
        return `/api/posts/liked/${userId}`
      default:
        return 'api/posts/all'
    }
  }

  const endpoint = getPostEndpoint()

  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(endpoint)
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
          console.error('Fetching Error: ', error.message)
        } else {
          console.error('An unknow error occured')
        }
      }
    },
    retry: false,
  })
}

export default useGetPosts
