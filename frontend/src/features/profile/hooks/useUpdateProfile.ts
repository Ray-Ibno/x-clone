import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import { customFetch } from '../../../utils/api'

type UpdateData = {
  username?: string
  fullName?: string
  email?: string
  bio?: string
  link?: string
  profileImg?: string | ArrayBuffer | null
  coverImg?: string | ArrayBuffer | null
}

const useUpdateProfile = (updateData: UpdateData) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await customFetch('/api/users/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          throw new Error(response.status.toString())
        }

        const data = await response.json()
        return data as UpdateData
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    onSuccess: () => {
      toast.success('Profile Updated')
      Promise.all([
        ['authUser', 'userProfile'].map((key) => {
          queryClient.invalidateQueries({ queryKey: [key] })
        }),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
export default useUpdateProfile
