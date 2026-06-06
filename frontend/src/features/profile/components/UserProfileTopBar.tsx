import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import type { User } from '../../../types/user-model'
import type { POST } from '../../../types/post-model'
import useGetPosts from '../../../hooks/useGetPosts'

const UserProfileTopBar = ({ userProfile }: { userProfile: User }) => {
  const { data: posts, isPending } = useGetPosts()

  const userProfilePostsCount = posts?.filter(
    (post: POST) => post.user._id === userProfile._id,
  ).length

  return (
    <div className="flex gap-10 px-4 py-2 items-center">
      <Link to="/">
        <FaArrowLeft className="w-4 h-4" />
      </Link>
      {!isPending && posts && (
        <div className="flex flex-col">
          <p className="font-bold text-lg">{userProfile.fullName}</p>
          <span className="text-sm text-slate-500">{userProfilePostsCount} posts</span>
        </div>
      )}
    </div>
  )
}
export default UserProfileTopBar
