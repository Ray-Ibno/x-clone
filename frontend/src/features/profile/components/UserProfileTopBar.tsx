import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import type { User } from '../../../types/user-model'
import { useQuery } from '@tanstack/react-query'
import type { POST } from '../../../types/post-model'

const UserProfileTopBar = ({ userProfile }: { userProfile: User }) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/posts/all')
        if (!res.ok) throw new Error('fetch error at userProfileTopBar')
        const data = await res.json()
        return data as POST[]
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
  })

  const userProfilePostsCount = posts?.filter(
    (post: POST) => post.user._id === userProfile._id
  ).length

  return (
    <div className="flex gap-10 px-4 py-2 items-center">
      <Link to="/">
        <FaArrowLeft className="w-4 h-4" />
      </Link>
      {!isLoading && posts && (
        <div className="flex flex-col">
          <p className="font-bold text-lg">{userProfile.fullName}</p>
          <span className="text-sm text-slate-500">
            {userProfilePostsCount} posts
          </span>
        </div>
      )}
    </div>
  )
}
export default UserProfileTopBar
