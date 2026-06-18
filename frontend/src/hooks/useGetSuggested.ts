import { useQuery } from '@tanstack/react-query'

import type { User } from '../types/user-model'
import { customFetch } from '../utils/api'

const useGetSuggestedUsers = () => {
  return useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        const response = await customFetch('/api/users/suggested', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()

        return data as User[]
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
