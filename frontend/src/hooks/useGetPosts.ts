import { useQuery } from '@tanstack/react-query'
import useFetchApi from './useFetchApi'
import type { POST } from '../types/post-model'

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
        return useFetchApi<POST[]>(endpoint)
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
