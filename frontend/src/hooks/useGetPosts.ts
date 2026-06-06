import { useQuery } from '@tanstack/react-query'
import fetchData from '../utils/api/fetchData'
import type { POST } from '../types/post-model'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { feedTypeContext } from '../context/feedTypeContext'
import useAuth from '../features/auth/hooks/useAuth'

const useGetPosts = () => {
  const { accessToken } = useAuth()
  const { username } = useParams()
  const feedType = useContext(feedTypeContext)
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/api/posts/all'
      case 'following':
        return '/api/posts/following'
      case 'likes':
        return `/api/posts/liked/${username}`
      case 'posts':
        return `/api/posts/user/${username}`
      default:
        return 'api/posts/all'
    }
  }

  const endpoint = getPostEndpoint()

  return useQuery({
    queryKey: ['posts', feedType, username],
    queryFn: async () => {
      try {
        return fetchData<POST[]>(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetching Error: ', error.message)
        } else {
          console.error('An unknow error occured')
        }
      }
    },
    enabled: !!accessToken,
    retry: false,
  })
}

export default useGetPosts
