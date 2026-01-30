import {
  ChatBox,
  Contacts,
  NoChatSelected,
  useChatSocket,
  useChatStore,
  useChatActions,
} from '../../features/message'
import { useEffect } from 'react'

const ChatPage = () => {
  const { selectedUser } = useChatStore()
  const { reset } = useChatActions()

  useChatSocket()

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return (
    <div className="border-l border-r border-gray-700 h-screen w-full">
      <div className="flex items-center lg:justify-center h-full">
        <Contacts />
        {selectedUser ? <ChatBox /> : <NoChatSelected />}
      </div>
    </div>
  )
}
export default ChatPage
