import { useQuery } from '@tanstack/react-query'

import type { POST } from '../types/post-model'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { feedTypeContext } from '../context/feedTypeContext'

import { customFetch } from '../utils/api'

const useGetPosts = () => {
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
        const response = await customFetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()

        return data as POST[]
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
