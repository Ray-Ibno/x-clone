import { Link } from 'react-router-dom'
import { formatMemberSinceDate } from '../../../../../utils/date'
import { useChatStore } from '../../../store/useChatStore'

const ChatInfo = () => {
  const { selectedUser } = useChatStore()

  return (
    selectedUser && (
      <div className="text-center">
        <img
          src={selectedUser.profileImg || '/avatar-placeholder.png'}
          alt="user image"
          className="rounded-full size-16 object-cover mx-auto mb-4"
        />

        <h1 className="font-extrabold text-lg">{selectedUser.fullName}</h1>
        <p className="text-zinc-500">@{selectedUser.username}</p>
        <p className="text-zinc-500 mb-8">{formatMemberSinceDate(selectedUser.createdAt)}</p>
        <Link
          to={`/profile/${selectedUser.username}`}
          className="bg-white text-black font-semibold py-2 px-4 rounded-full"
        >
          View Profile
        </Link>
      </div>
    )
  )
}
export default ChatInfo
