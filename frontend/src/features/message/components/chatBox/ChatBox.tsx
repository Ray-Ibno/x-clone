import { useChatActions, useChatStore } from '../../store/useChatStore'
import { useEffect } from 'react'
import Header from './componetns/Header'
import ChatInfo from './componetns/ChatInfo'
import MessageInput from './componetns/MessageInput'
import Conversation from './componetns/Conversation'

const ChatBox = () => {
  const { selectedUser } = useChatStore()
  const { getMessages } = useChatActions()

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (selectedUser) {
    return (
      <div
        className={`h-full w-full ${
          selectedUser ? 'flex' : 'hidden'
        } lg:flex flex-col items-center grow gap-6 `}
      >
        <Header />
        <ChatInfo />
        <Conversation />
        <MessageInput />
      </div>
    )
  }
}
export default ChatBox
