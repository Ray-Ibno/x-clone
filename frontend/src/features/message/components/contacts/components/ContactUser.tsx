import { useChatActions, useChatStore } from '../../../store/useChatStore'
import { formatMessageDate } from '../../../../../utils/date'
import type { Chat } from '../../../../../types/chat-model'
import useGetUser from '../../../../../hooks/useGetUser'

type ContactUserProps = {
  chat: Chat
}

const ContactUser = ({ chat }: ContactUserProps) => {
  const { data: authUser } = useGetUser()
  const { onlineUsers, selectedUser } = useChatStore()
  const { setSelectedUser } = useChatActions()

  const userChattedWith = chat.members.filter((member) => member._id !== authUser?._id)[0]

  return (
    <button
      onClick={() => setSelectedUser(userChattedWith)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
        selectedUser?._id === userChattedWith._id ? 'bg-base-300 ring-1 ring-base-300' : ''
      }`}
    >
      <div className="relative">
        <img
          src={
            (typeof userChattedWith.profileImg === 'string' && userChattedWith.profileImg) ||
            userChattedWith.profileImg ||
            '/avatar-placeholder.png'
          }
          className="size-12 object-cover rounded-full"
        />
        {onlineUsers.includes(userChattedWith._id) && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
        )}
      </div>
      <div className="block text-left min-w-0">
        <div className="font-extrabold truncate">{userChattedWith.fullName}</div>
        <div className="text-sm text-zinc-400">
          {chat.lastMessage.image ? 'sent an image' : chat.lastMessage.text}
        </div>
      </div>
      <p className="ml-auto self-start text-sm text-zinc-400">
        {formatMessageDate(chat.lastMessage.createdAt)}
      </p>
    </button>
  )
}
export default ContactUser
