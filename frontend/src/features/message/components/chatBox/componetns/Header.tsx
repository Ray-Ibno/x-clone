import { BiArrowBack } from 'react-icons/bi'
import { useChatActions, useChatStore } from '../../../store/useChatStore'

const Header = () => {
  const { onlineUsers, selectedUser } = useChatStore()
  const { setSelectedUser } = useChatActions()

  return (
    selectedUser && (
      <div className="self-start p-4">
        <div className="flex items-center gap-2">
          <div
            className="lg:hidden bg-zinc-900 p-4 rounded-full"
            onClick={() => setSelectedUser(null)}
          >
            <BiArrowBack size={20} />
          </div>
          <img
            src={selectedUser.profileImg || '/avatar-placeholder.png'}
            alt="user image"
            className="rounded-full size-12 object-cover"
          />
          <div className="flex flex-col">
            <h1 className="font-extrabold text-lg">{selectedUser.fullName}</h1>
            <p
              className={`text-xs ${
                onlineUsers.includes(selectedUser._id) ? 'text-green-500' : 'text-zinc-500'
              }`}
            >
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
    )
  )
}
export default Header
